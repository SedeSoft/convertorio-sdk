<?php

namespace Convertorio\SDK;

use Exception;

/**
 * Convertorio SDK Client for PHP
 *
 * Simple and powerful SDK to convert images using the Convertorio API.
 *
 * @package Convertorio\SDK
 * @version 1.2.0
 */
class ConvertorioClient
{
    /**
     * @var string API key
     */
    private $apiKey;

    /**
     * @var string Base URL for API
     */
    private $baseUrl;

    /**
     * @var array Event callbacks
     */
    private $eventCallbacks = [];

    /**
     * @var bool Verify SSL certificates
     */
    private $verifySsl = true;

    /**
     * Create a new Convertorio client
     *
     * @param string $apiKey Your Convertorio API key
     * @param string|null $baseUrl Optional custom API base URL
     * @param bool $verifySsl Verify SSL certificates (set to false for development)
     * @throws Exception If API key is not provided
     */
    public function __construct(string $apiKey, ?string $baseUrl = null, bool $verifySsl = true)
    {
        if (empty($apiKey)) {
            throw new Exception('API key is required. Get yours at https://convertorio.com/account');
        }

        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl ?? 'https://api.convertorio.com';
        $this->verifySsl = $verifySsl;
    }

    /**
     * Register an event callback
     *
     * @param string $event Event name (start, progress, status, complete, error)
     * @param callable $callback Callback function
     * @return self
     */
    public function on(string $event, callable $callback): self
    {
        if (!isset($this->eventCallbacks[$event])) {
            $this->eventCallbacks[$event] = [];
        }
        $this->eventCallbacks[$event][] = $callback;
        return $this;
    }

    /**
     * Emit an event to registered callbacks
     *
     * @param string $event Event name
     * @param array $data Event data
     */
    private function emit(string $event, array $data): void
    {
        if (isset($this->eventCallbacks[$event])) {
            foreach ($this->eventCallbacks[$event] as $callback) {
                call_user_func($callback, $data);
            }
        }
    }

    /**
     * Convert an image file
     *
     * @param string $inputPath Path to the input file
     * @param string $targetFormat Target format (jpg, png, webp, avif, etc.)
     * @param string|null $outputPath Optional output path (auto-generated if not provided)
     * @param array|null $conversionMetadata Advanced conversion options
     *   - aspect_ratio: Target aspect ratio (original, 1:1, 4:3, 16:9, 9:16, 21:9, custom)
     *   - crop_strategy: Crop strategy (fit, crop-center, crop-top, crop-bottom, crop-left, crop-right)
     *   - quality: Compression quality 1-100 (for JPG, WebP, AVIF, HEIC)
     *   - icon_size: Icon size in pixels (for ICO format: 16, 32, 48, 64, 128, 256)
     *   - resize_width: Target width in pixels (1-10000)
     *   - resize_height: Target height in pixels (1-10000)
     * @return array Conversion result with download URL and file path
     * @throws Exception If conversion fails
     */
    public function convertFile(
        string $inputPath,
        string $targetFormat,
        ?string $outputPath = null,
        ?array $conversionMetadata = null
    ): array {
        // Validate input file exists
        if (!file_exists($inputPath)) {
            throw new Exception("Input file not found: {$inputPath}");
        }

        $fileSize = filesize($inputPath);
        $fileName = basename($inputPath);
        $sourceFormat = strtolower(pathinfo($inputPath, PATHINFO_EXTENSION));

        $this->emit('start', [
            'file_name' => $fileName,
            'source_format' => $sourceFormat,
            'target_format' => $targetFormat
        ]);

        try {
            // Step 1: Request upload URL
            $this->emit('progress', [
                'step' => 'requesting-upload-url',
                'message' => 'Requesting upload URL from server...'
            ]);

            $requestBody = [
                'filename' => $fileName,
                'source_format' => $sourceFormat,
                'target_format' => strtolower($targetFormat),
                'file_size' => $fileSize
            ];

            // Add conversion metadata if provided
            if ($conversionMetadata !== null && !empty($conversionMetadata)) {
                $requestBody['conversion_metadata'] = $conversionMetadata;
            }

            $uploadRequest = $this->makeRequest('POST', '/v1/convert/upload-url', $requestBody);

            if (!($uploadRequest['success'] ?? false)) {
                throw new Exception($uploadRequest['error'] ?? 'Failed to get upload URL');
            }

            $jobId = $uploadRequest['job_id'];
            $uploadUrl = $uploadRequest['upload_url'];

            // Step 2: Upload file to S3
            $this->emit('progress', [
                'step' => 'uploading',
                'message' => 'Uploading file to cloud storage...',
                'job_id' => $jobId
            ]);

            $fileData = file_get_contents($inputPath);
            $this->uploadFile($uploadUrl, $fileData, "image/{$sourceFormat}");

            // Step 3: Confirm upload and queue conversion
            $this->emit('progress', [
                'step' => 'confirming',
                'message' => 'Confirming upload and queuing conversion...',
                'job_id' => $jobId
            ]);

            $confirmRequest = $this->makeRequest('POST', '/v1/convert/confirm', ['job_id' => $jobId]);

            if (!($confirmRequest['success'] ?? false)) {
                throw new Exception($confirmRequest['error'] ?? 'Failed to confirm upload');
            }

            // Step 4: Poll for completion
            $this->emit('progress', [
                'step' => 'converting',
                'message' => 'Converting image...',
                'job_id' => $jobId,
                'status' => $confirmRequest['status'] ?? 'queued'
            ]);

            $result = $this->pollJobStatus($jobId);

            // Step 5: Download converted file
            $this->emit('progress', [
                'step' => 'downloading',
                'message' => 'Downloading converted file...',
                'job_id' => $jobId
            ]);

            $finalOutputPath = $outputPath ?? $this->generateOutputPath($inputPath, $targetFormat);
            $this->downloadFile($result['download_url'], $finalOutputPath);

            // Build conversion result
            $conversionResult = [
                'success' => true,
                'job_id' => $jobId,
                'input_path' => $inputPath,
                'output_path' => $finalOutputPath,
                'source_format' => $sourceFormat,
                'target_format' => strtolower($targetFormat),
                'file_size' => filesize($finalOutputPath),
                'processing_time' => $result['processing_time_ms'] ?? 0,
                'download_url' => $result['download_url']
            ];

            $this->emit('complete', $conversionResult);
            return $conversionResult;

        } catch (Exception $error) {
            $errorDetails = [
                'success' => false,
                'error' => $error->getMessage(),
                'input_path' => $inputPath,
                'target_format' => $targetFormat
            ];
            $this->emit('error', $errorDetails);
            throw $error;
        }
    }

    /**
     * Poll job status until completion
     *
     * @param string $jobId Job ID to poll
     * @param int $maxAttempts Maximum polling attempts
     * @param int $interval Polling interval in seconds
     * @return array Job result
     * @throws Exception If job fails or times out
     */
    private function pollJobStatus(string $jobId, int $maxAttempts = 60, int $interval = 2): array
    {
        $attempts = 0;

        while ($attempts < $maxAttempts) {
            $attempts++;

            // Wait before polling (except first attempt)
            if ($attempts > 1) {
                sleep($interval);
            }

            $statusRequest = $this->makeRequest('GET', "/v1/jobs/{$jobId}");

            if (!($statusRequest['success'] ?? false)) {
                throw new Exception('Failed to get job status');
            }

            $job = $statusRequest['job'];
            $status = $job['status'];

            $this->emit('status', [
                'job_id' => $jobId,
                'status' => $status,
                'attempt' => $attempts,
                'max_attempts' => $maxAttempts
            ]);

            if ($status === 'completed') {
                return $job;
            }

            if ($status === 'failed') {
                throw new Exception($job['error_message'] ?? 'Conversion failed');
            }

            if ($status === 'expired') {
                throw new Exception('Job expired');
            }
        }

        throw new Exception('Conversion timeout - job did not complete in time');
    }

    /**
     * Download file from URL
     *
     * @param string $url Download URL
     * @param string $outputPath Output file path
     * @throws Exception If download fails
     */
    private function downloadFile(string $url, string $outputPath): void
    {
        // Use cURL for better SSL control
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        // SSL verification settings
        if (!$this->verifySsl) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        }

        $fileData = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("Download failed: {$error}");
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            throw new Exception("Failed to download file. HTTP Status: {$httpCode}");
        }

        if ($fileData === false) {
            throw new Exception("Failed to download file from: {$url}");
        }

        // Ensure output directory exists
        $outputDir = dirname($outputPath);
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        if (file_put_contents($outputPath, $fileData) === false) {
            throw new Exception("Failed to write file to: {$outputPath}");
        }
    }

    /**
     * Upload file to S3
     *
     * @param string $url Upload URL
     * @param string $fileData File data
     * @param string $contentType Content type
     * @throws Exception If upload fails
     */
    private function uploadFile(string $url, string $fileData, string $contentType): void
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fileData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: {$contentType}",
            'Content-Length: ' . strlen($fileData)
        ]);

        // SSL verification settings
        if (!$this->verifySsl) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("Upload failed: {$error}");
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            throw new Exception("Failed to upload file. HTTP Status: {$httpCode}");
        }
    }

    /**
     * Generate output path based on input path and target format
     *
     * @param string $inputPath Input file path
     * @param string $targetFormat Target format
     * @return string Output file path
     */
    private function generateOutputPath(string $inputPath, string $targetFormat): string
    {
        $dir = dirname($inputPath);
        $baseName = pathinfo($inputPath, PATHINFO_FILENAME);
        return $dir . DIRECTORY_SEPARATOR . $baseName . '.' . strtolower($targetFormat);
    }

    /**
     * Make HTTP request to API
     *
     * @param string $method HTTP method
     * @param string $endpoint API endpoint
     * @param array|null $data Request data
     * @return array Response data
     * @throws Exception If request fails
     */
    private function makeRequest(string $method, string $endpoint, ?array $data = null): array
    {
        $url = $this->baseUrl . $endpoint;
        $ch = curl_init($url);

        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        // SSL verification settings
        if (!$this->verifySsl) {
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        }

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data !== null) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            }
        } elseif ($method === 'GET' && $data !== null) {
            $url .= '?' . http_build_query($data);
            curl_setopt($ch, CURLOPT_URL, $url);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("Request failed: {$error}");
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            throw new Exception("HTTP request failed with status code: {$httpCode}");
        }

        $decoded = json_decode($response, true);
        if ($decoded === null) {
            throw new Exception("Failed to decode JSON response");
        }

        return $decoded;
    }

    /**
     * Get account information
     *
     * @return array Account details
     * @throws Exception If request fails
     */
    public function getAccount(): array
    {
        $response = $this->makeRequest('GET', '/v1/account');

        if (!($response['success'] ?? false)) {
            throw new Exception($response['error'] ?? 'Failed to get account info');
        }

        return $response['account'];
    }

    /**
     * List conversion jobs
     *
     * @param int $limit Number of jobs to return (max: 100)
     * @param int $offset Offset for pagination
     * @param string|null $status Filter by status (completed, failed, processing, etc.)
     * @return array List of jobs
     * @throws Exception If request fails
     */
    public function listJobs(int $limit = 50, int $offset = 0, ?string $status = null): array
    {
        $params = ['limit' => $limit, 'offset' => $offset];
        if ($status !== null) {
            $params['status'] = $status;
        }

        $response = $this->makeRequest('GET', '/v1/jobs', $params);

        if (!($response['success'] ?? false)) {
            throw new Exception($response['error'] ?? 'Failed to list jobs');
        }

        return $response['jobs'];
    }

    /**
     * Get job status
     *
     * @param string $jobId Job ID
     * @return array Job details
     * @throws Exception If request fails
     */
    public function getJob(string $jobId): array
    {
        $response = $this->makeRequest('GET', "/v1/jobs/{$jobId}");

        if (!($response['success'] ?? false)) {
            throw new Exception($response['error'] ?? 'Failed to get job');
        }

        return $response['job'];
    }
}
