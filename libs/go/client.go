package convertorio

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

const (
	// DefaultAPIURL is the default Convertorio API endpoint
	DefaultAPIURL = "https://api.convertorio.com"

	// DefaultMaxAttempts is the default maximum number of polling attempts
	DefaultMaxAttempts = 120

	// DefaultPollInterval is the default interval between polling attempts
	DefaultPollInterval = 2 * time.Second
)

// Client represents a Convertorio API client
type Client struct {
	apiKey         string
	baseURL        string
	httpClient     *http.Client
	maxAttempts    int
	pollInterval   time.Duration
	eventCallbacks map[string][]EventCallback
}

// EventCallback is a function type for event handlers
type EventCallback func(data map[string]interface{})

// ClientConfig holds configuration options for the client
type ClientConfig struct {
	APIKey       string
	BaseURL      string
	MaxAttempts  int
	PollInterval time.Duration
}

// NewClient creates a new Convertorio API client
func NewClient(config ClientConfig) *Client {
	baseURL := config.BaseURL
	if baseURL == "" {
		baseURL = DefaultAPIURL
	}

	maxAttempts := config.MaxAttempts
	if maxAttempts == 0 {
		maxAttempts = DefaultMaxAttempts
	}

	pollInterval := config.PollInterval
	if pollInterval == 0 {
		pollInterval = DefaultPollInterval
	}

	return &Client{
		apiKey:         config.APIKey,
		baseURL:        baseURL,
		httpClient:     &http.Client{Timeout: 60 * time.Second},
		maxAttempts:    maxAttempts,
		pollInterval:   pollInterval,
		eventCallbacks: make(map[string][]EventCallback),
	}
}

// On registers an event callback
func (c *Client) On(event string, callback EventCallback) {
	c.eventCallbacks[event] = append(c.eventCallbacks[event], callback)
}

// emit triggers all callbacks for the given event
func (c *Client) emit(event string, data map[string]interface{}) {
	if callbacks, ok := c.eventCallbacks[event]; ok {
		for _, callback := range callbacks {
			callback(data)
		}
	}
}

// ConvertFileOptions holds options for file conversion
type ConvertFileOptions struct {
	InputPath          string
	TargetFormat       string
	OutputPath         string
	ConversionMetadata map[string]interface{}
}

// ConvertFileResult holds the result of a file conversion
type ConvertFileResult struct {
	Success        bool                   `json:"success"`
	JobID          string                 `json:"job_id"`
	InputPath      string                 `json:"input_path"`
	OutputPath     string                 `json:"output_path"`
	SourceFormat   string                 `json:"source_format"`
	TargetFormat   string                 `json:"target_format"`
	FileSize       int64                  `json:"file_size"`
	ProcessingTime int                    `json:"processing_time"`
	DownloadURL    string                 `json:"download_url"`
	Metadata       map[string]interface{} `json:"metadata,omitempty"`
}

// ConvertFile converts a file from one format to another
func (c *Client) ConvertFile(options ConvertFileOptions) (*ConvertFileResult, error) {
	// Validate input
	if c.apiKey == "" {
		return nil, fmt.Errorf("API key is required")
	}

	if options.InputPath == "" {
		return nil, fmt.Errorf("input path is required")
	}

	if options.TargetFormat == "" {
		return nil, fmt.Errorf("target format is required")
	}

	// Check if input file exists
	fileInfo, err := os.Stat(options.InputPath)
	if err != nil {
		return nil, fmt.Errorf("input file not found: %w", err)
	}

	fileName := filepath.Base(options.InputPath)
	fileSize := fileInfo.Size()

	// Emit start event
	c.emit("start", map[string]interface{}{
		"file_name":     fileName,
		"source_format": filepath.Ext(fileName)[1:],
		"target_format": options.TargetFormat,
		"file_size":     fileSize,
	})

	// Step 1: Request upload URL
	c.emit("progress", map[string]interface{}{
		"step":    "requesting-upload-url",
		"message": "Requesting upload URL from server",
	})

	uploadData, err := c.requestUploadURL(fileName, options.TargetFormat, options.ConversionMetadata)
	if err != nil {
		c.emit("error", map[string]interface{}{"error": err.Error()})
		return nil, err
	}

	// Step 2: Upload file to S3
	c.emit("progress", map[string]interface{}{
		"step":    "uploading",
		"message": "Uploading file to cloud storage",
	})

	if err := c.uploadToS3(uploadData.UploadURL, options.InputPath); err != nil {
		c.emit("error", map[string]interface{}{"error": err.Error()})
		return nil, err
	}

	// Step 3: Confirm upload
	c.emit("progress", map[string]interface{}{
		"step":    "confirming",
		"message": "Confirming upload and starting conversion",
	})

	if err := c.confirmUpload(uploadData.JobID); err != nil {
		c.emit("error", map[string]interface{}{"error": err.Error()})
		return nil, err
	}

	// Step 4: Poll for job completion
	c.emit("progress", map[string]interface{}{
		"step":    "converting",
		"message": "Converting file (this may take a moment)",
	})

	job, err := c.pollJobStatus(uploadData.JobID)
	if err != nil {
		c.emit("error", map[string]interface{}{"error": err.Error()})
		return nil, err
	}

	// Step 5: Download converted file
	c.emit("progress", map[string]interface{}{
		"step":    "downloading",
		"message": "Downloading converted file",
	})

	outputPath := options.OutputPath
	if outputPath == "" {
		dir := filepath.Dir(options.InputPath)
		base := fileName[:len(fileName)-len(filepath.Ext(fileName))]
		outputPath = filepath.Join(dir, base+"."+options.TargetFormat)
	}

	if err := c.downloadFile(job.DownloadURL, outputPath); err != nil {
		c.emit("error", map[string]interface{}{"error": err.Error()})
		return nil, err
	}

	// Get file size
	outputInfo, _ := os.Stat(outputPath)
	var outputSize int64
	if outputInfo != nil {
		outputSize = outputInfo.Size()
	}

	result := &ConvertFileResult{
		Success:        true,
		JobID:          job.ID,
		InputPath:      options.InputPath,
		OutputPath:     outputPath,
		SourceFormat:   job.SourceFormat,
		TargetFormat:   job.TargetFormat,
		FileSize:       outputSize,
		ProcessingTime: job.ProcessingTimeMs,
		DownloadURL:    job.DownloadURL,
		Metadata:       job.Metadata,
	}

	// Emit complete event
	c.emit("complete", map[string]interface{}{
		"job_id":          result.JobID,
		"output_path":     result.OutputPath,
		"processing_time": result.ProcessingTime,
		"file_size":       result.FileSize,
	})

	return result, nil
}

// requestUploadURL requests an upload URL from the API
func (c *Client) requestUploadURL(fileName, targetFormat string, metadata map[string]interface{}) (*UploadURLResponse, error) {
	reqBody := map[string]interface{}{
		"file_name":     fileName,
		"target_format": targetFormat,
	}

	if metadata != nil {
		reqBody["conversion_metadata"] = metadata
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", c.baseURL+"/api/upload/request-url", bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(bodyBytes))
	}

	var result UploadURLResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &result, nil
}

// uploadToS3 uploads a file to S3
func (c *Client) uploadToS3(uploadURL, filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	// Get file info to set content length
	fileInfo, err := file.Stat()
	if err != nil {
		return fmt.Errorf("failed to stat file: %w", err)
	}

	req, err := http.NewRequest("PUT", uploadURL, file)
	if err != nil {
		return fmt.Errorf("failed to create upload request: %w", err)
	}

	// Set appropriate headers for S3
	req.Header.Set("Content-Type", "application/octet-stream")
	req.ContentLength = fileInfo.Size()

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("upload failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("upload failed (status %d): %s", resp.StatusCode, string(bodyBytes))
	}

	return nil
}

// confirmUpload confirms the upload and starts the conversion
func (c *Client) confirmUpload(jobID string) error {
	reqBody := map[string]interface{}{
		"job_id": jobID,
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", c.baseURL+"/api/upload/confirm", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(bodyBytes))
	}

	return nil
}

// pollJobStatus polls the job status until it's complete or fails
func (c *Client) pollJobStatus(jobID string) (*Job, error) {
	for attempt := 1; attempt <= c.maxAttempts; attempt++ {
		c.emit("status", map[string]interface{}{
			"status":       "polling",
			"attempt":      attempt,
			"max_attempts": c.maxAttempts,
		})

		job, err := c.GetJob(jobID)
		if err != nil {
			return nil, err
		}

		if job.Status == "completed" {
			return job, nil
		}

		if job.Status == "failed" {
			return nil, fmt.Errorf("conversion failed: %s", job.Error)
		}

		time.Sleep(c.pollInterval)
	}

	return nil, fmt.Errorf("conversion timeout after %d attempts", c.maxAttempts)
}

// downloadFile downloads a file from a URL
func (c *Client) downloadFile(url, destPath string) error {
	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("download failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("download failed with status: %d", resp.StatusCode)
	}

	// Create destination directory if it doesn't exist
	dir := filepath.Dir(destPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	file, err := os.Create(destPath)
	if err != nil {
		return fmt.Errorf("failed to create file: %w", err)
	}
	defer file.Close()

	if _, err := io.Copy(file, resp.Body); err != nil {
		return fmt.Errorf("failed to write file: %w", err)
	}

	return nil
}

// GetAccount retrieves account information
func (c *Client) GetAccount() (*Account, error) {
	req, err := http.NewRequest("GET", c.baseURL+"/api/account", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(bodyBytes))
	}

	var account Account
	if err := json.NewDecoder(resp.Body).Decode(&account); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &account, nil
}

// ListJobs retrieves a list of conversion jobs
func (c *Client) ListJobs(limit, offset int, status string) ([]*Job, error) {
	url := fmt.Sprintf("%s/api/jobs?limit=%d&offset=%d", c.baseURL, limit, offset)
	if status != "" {
		url += "&status=" + status
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(bodyBytes))
	}

	var jobs []*Job
	if err := json.NewDecoder(resp.Body).Decode(&jobs); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return jobs, nil
}

// GetJob retrieves details for a specific job
func (c *Client) GetJob(jobID string) (*Job, error) {
	req, err := http.NewRequest("GET", c.baseURL+"/api/jobs/"+jobID, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(bodyBytes))
	}

	var job Job
	if err := json.NewDecoder(resp.Body).Decode(&job); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &job, nil
}
