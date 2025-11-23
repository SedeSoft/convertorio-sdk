const axios = require('axios');
const fs = require('fs');
const { EventEmitter } = require('events');
const path = require('path');

/**
 * Convertorio SDK for Node.js
 *
 * Simple and powerful SDK to convert images using the Convertorio API
 */
class ConvertorioClient extends EventEmitter {
    /**
     * Create a new Convertorio client
     * @param {Object} config - Configuration object
     * @param {string} config.apiKey - Your Convertorio API key
     * @param {string} [config.baseUrl='https://api.convertorio.com'] - API base URL
     */
    constructor(config) {
        super();

        if (!config || !config.apiKey) {
            throw new Error('API key is required. Get yours at https://convertorio.com/account');
        }

        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://api.convertorio.com';

        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Convert an image file
     * @param {Object} options - Conversion options
     * @param {string} options.inputPath - Path to the input file
     * @param {string} options.targetFormat - Target format (jpg, png, webp, avif, etc.)
     * @param {string} [options.outputPath] - Optional output path (auto-generated if not provided)
     * @param {Object} [options.conversionMetadata] - Advanced conversion options
     * @param {string} [options.conversionMetadata.aspect_ratio] - Target aspect ratio (original, 1:1, 4:3, 16:9, 9:16, 21:9, custom)
     * @param {string} [options.conversionMetadata.crop_strategy] - Crop strategy (fit, crop-center, crop-top, crop-bottom, crop-left, crop-right)
     * @param {number} [options.conversionMetadata.quality] - Compression quality 1-100 (for JPG, WebP, AVIF)
     * @param {number} [options.conversionMetadata.icon_size] - Icon size in pixels (for ICO format: 16, 32, 48, 64, 128, 256)
     * @returns {Promise<Object>} Conversion result with download URL and file path
     */
    async convertFile(options) {
        const { inputPath, targetFormat, outputPath, conversionMetadata } = options;

        if (!inputPath) {
            throw new Error('inputPath is required');
        }

        if (!targetFormat) {
            throw new Error('targetFormat is required');
        }

        // Validate input file exists
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file not found: ${inputPath}`);
        }

        const fileStats = fs.statSync(inputPath);
        const fileName = path.basename(inputPath);
        const sourceFormat = path.extname(inputPath).substring(1).toLowerCase();

        this.emit('start', { fileName, sourceFormat, targetFormat });

        try {
            // Step 1: Request upload URL
            this.emit('progress', {
                step: 'requesting-upload-url',
                message: 'Requesting upload URL from server...'
            });

            const requestBody = {
                filename: fileName,
                source_format: sourceFormat,
                target_format: targetFormat.toLowerCase(),
                file_size: fileStats.size
            };

            // Add conversion metadata if provided
            if (conversionMetadata && Object.keys(conversionMetadata).length > 0) {
                requestBody.conversion_metadata = conversionMetadata;
            }

            const uploadRequest = await this.client.post('/v1/convert/upload-url', requestBody);

            if (!uploadRequest.data.success) {
                throw new Error(uploadRequest.data.error || 'Failed to get upload URL');
            }

            const { job_id, upload_url } = uploadRequest.data;

            this.emit('progress', {
                step: 'uploading',
                message: 'Uploading file to cloud storage...',
                jobId: job_id
            });

            // Step 2: Upload file to S3
            const fileBuffer = fs.readFileSync(inputPath);
            await axios.put(upload_url, fileBuffer, {
                headers: {
                    'Content-Type': `image/${sourceFormat}`
                }
            });

            this.emit('progress', {
                step: 'confirming',
                message: 'Confirming upload and queuing conversion...',
                jobId: job_id
            });

            // Step 3: Confirm upload and queue conversion
            const confirmRequest = await this.client.post('/v1/convert/confirm', {
                job_id
            });

            if (!confirmRequest.data.success) {
                throw new Error(confirmRequest.data.error || 'Failed to confirm upload');
            }

            this.emit('progress', {
                step: 'converting',
                message: 'Converting image...',
                jobId: job_id,
                status: confirmRequest.data.status
            });

            // Step 4: Poll for completion
            const result = await this._pollJobStatus(job_id);

            this.emit('progress', {
                step: 'downloading',
                message: 'Downloading converted file...',
                jobId: job_id
            });

            // Step 5: Download converted file
            const finalOutputPath = outputPath || this._generateOutputPath(inputPath, targetFormat);
            await this._downloadFile(result.download_url, finalOutputPath);

            const conversionResult = {
                success: true,
                jobId: job_id,
                inputPath,
                outputPath: finalOutputPath,
                sourceFormat,
                targetFormat: targetFormat.toLowerCase(),
                fileSize: fs.statSync(finalOutputPath).size,
                processingTime: result.processing_time_ms,
                downloadUrl: result.download_url,
                tokensUsed: result.tokens_used
            };

            this.emit('complete', conversionResult);

            return conversionResult;

        } catch (error) {
            const errorDetails = {
                success: false,
                error: error.message,
                inputPath,
                targetFormat
            };

            this.emit('error', errorDetails);
            throw error;
        }
    }

    /**
     * Poll job status until completion
     * @private
     * @param {string} jobId - Job ID to poll
     * @param {number} [maxAttempts=60] - Maximum polling attempts
     * @param {number} [interval=2000] - Polling interval in milliseconds
     * @returns {Promise<Object>} Job result
     */
    async _pollJobStatus(jobId, maxAttempts = 60, interval = 2000) {
        let attempts = 0;

        while (attempts < maxAttempts) {
            attempts++;

            // Wait before polling (except first attempt)
            if (attempts > 1) {
                await this._sleep(interval);
            }

            const statusRequest = await this.client.get(`/v1/jobs/${jobId}`);

            if (!statusRequest.data.success) {
                throw new Error('Failed to get job status');
            }

            const job = statusRequest.data.job;
            const { status } = job;

            this.emit('status', {
                jobId,
                status,
                attempt: attempts,
                maxAttempts
            });

            if (status === 'completed') {
                return job;
            }

            if (status === 'failed') {
                throw new Error(job.error_message || 'Conversion failed');
            }

            if (status === 'expired') {
                throw new Error('Job expired');
            }
        }

        throw new Error('Conversion timeout - job did not complete in time');
    }

    /**
     * Download file from URL
     * @private
     * @param {string} url - Download URL
     * @param {string} outputPath - Output file path
     */
    async _downloadFile(url, outputPath) {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, response.data);
    }

    /**
     * Generate output path based on input path and target format
     * @private
     * @param {string} inputPath - Input file path
     * @param {string} targetFormat - Target format
     * @returns {string} Output file path
     */
    _generateOutputPath(inputPath, targetFormat) {
        const dir = path.dirname(inputPath);
        const baseName = path.basename(inputPath, path.extname(inputPath));
        return path.join(dir, `${baseName}.${targetFormat.toLowerCase()}`);
    }

    /**
     * Sleep for specified milliseconds
     * @private
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise<void>}
     */
    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get account information
     * @returns {Promise<Object>} Account details
     */
    async getAccount() {
        const response = await this.client.get('/v1/account');
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to get account info');
        }
        return response.data.account;
    }

    /**
     * List conversion jobs
     * @param {Object} [options] - List options
     * @param {number} [options.limit=50] - Number of jobs to return
     * @param {number} [options.offset=0] - Offset for pagination
     * @param {string} [options.status] - Filter by status (completed, failed, processing, etc.)
     * @returns {Promise<Array>} List of jobs
     */
    async listJobs(options = {}) {
        const params = new URLSearchParams();
        if (options.limit) params.append('limit', options.limit);
        if (options.offset) params.append('offset', options.offset);
        if (options.status) params.append('status', options.status);

        const response = await this.client.get(`/v1/jobs?${params.toString()}`);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to list jobs');
        }
        return response.data.jobs;
    }

    /**
     * Get job status
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Job details
     */
    async getJob(jobId) {
        const response = await this.client.get(`/v1/jobs/${jobId}`);
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to get job');
        }
        return response.data.job;
    }
}

module.exports = ConvertorioClient;
