package convertorio

// UploadURLResponse represents the response from requesting an upload URL
type UploadURLResponse struct {
	JobID     string `json:"job_id"`
	UploadURL string `json:"upload_url"`
}

// Job represents a conversion job
type Job struct {
	ID               string                 `json:"id"`
	Status           string                 `json:"status"`
	OriginalFilename string                 `json:"original_filename"`
	SourceFormat     string                 `json:"source_format"`
	TargetFormat     string                 `json:"target_format"`
	DownloadURL      string                 `json:"download_url,omitempty"`
	ProcessingTimeMs int                    `json:"processing_time_ms,omitempty"`
	Error            string                 `json:"error,omitempty"`
	CreatedAt        string                 `json:"created_at"`
	CompletedAt      string                 `json:"completed_at,omitempty"`
	Metadata         map[string]interface{} `json:"metadata,omitempty"`
}

// Account represents a user account
type Account struct {
	ID                       string `json:"id"`
	Email                    string `json:"email"`
	Name                     string `json:"name"`
	Plan                     string `json:"plan"`
	Points                   int    `json:"points"`
	DailyConversionsRemaining int    `json:"daily_conversions_remaining"`
	TotalConversions         int    `json:"total_conversions"`
}
