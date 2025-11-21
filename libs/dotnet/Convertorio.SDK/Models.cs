using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Convertorio.SDK
{
    /// <summary>
    /// Conversion options
    /// </summary>
    public class ConversionOptions
    {
        /// <summary>
        /// Path to the input file
        /// </summary>
        public string InputPath { get; set; }

        /// <summary>
        /// Target format (jpg, png, webp, avif, etc.)
        /// </summary>
        public string TargetFormat { get; set; }

        /// <summary>
        /// Optional output path (auto-generated if not provided)
        /// </summary>
        public string OutputPath { get; set; }

        /// <summary>
        /// Advanced conversion options
        /// </summary>
        public ConversionMetadata ConversionMetadata { get; set; }
    }

    /// <summary>
    /// Advanced conversion metadata
    /// </summary>
    public class ConversionMetadata
    {
        /// <summary>
        /// Target aspect ratio (original, 1:1, 4:3, 16:9, 9:16, 21:9, custom)
        /// </summary>
        [JsonProperty("aspect_ratio")]
        public string AspectRatio { get; set; }

        /// <summary>
        /// Crop strategy (fit, crop-center, crop-top, crop-bottom, crop-left, crop-right)
        /// </summary>
        [JsonProperty("crop_strategy")]
        public string CropStrategy { get; set; }

        /// <summary>
        /// Compression quality 1-100 (for JPG, WebP, AVIF)
        /// </summary>
        [JsonProperty("quality")]
        public int? Quality { get; set; }

        /// <summary>
        /// Icon size in pixels (for ICO format: 16, 32, 48, 64, 128, 256)
        /// </summary>
        [JsonProperty("icon_size")]
        public int? IconSize { get; set; }

        /// <summary>
        /// Custom width in pixels (when aspect_ratio is "custom")
        /// </summary>
        [JsonProperty("custom_width")]
        public int? CustomWidth { get; set; }

        /// <summary>
        /// Custom height in pixels (when aspect_ratio is "custom")
        /// </summary>
        [JsonProperty("custom_height")]
        public int? CustomHeight { get; set; }
    }

    /// <summary>
    /// Conversion result
    /// </summary>
    public class ConversionResult
    {
        /// <summary>
        /// Whether the conversion was successful
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Job ID
        /// </summary>
        public string JobId { get; set; }

        /// <summary>
        /// Input file path
        /// </summary>
        public string InputPath { get; set; }

        /// <summary>
        /// Output file path
        /// </summary>
        public string OutputPath { get; set; }

        /// <summary>
        /// Source format
        /// </summary>
        public string SourceFormat { get; set; }

        /// <summary>
        /// Target format
        /// </summary>
        public string TargetFormat { get; set; }

        /// <summary>
        /// Output file size in bytes
        /// </summary>
        public long FileSize { get; set; }

        /// <summary>
        /// Processing time in milliseconds
        /// </summary>
        public int ProcessingTime { get; set; }

        /// <summary>
        /// Download URL
        /// </summary>
        public string DownloadUrl { get; set; }
    }

    /// <summary>
    /// Options for listing jobs
    /// </summary>
    public class ListJobsOptions
    {
        /// <summary>
        /// Number of jobs to return (default: 50)
        /// </summary>
        public int? Limit { get; set; } = 50;

        /// <summary>
        /// Offset for pagination (default: 0)
        /// </summary>
        public int? Offset { get; set; } = 0;

        /// <summary>
        /// Filter by status (completed, failed, processing, etc.)
        /// </summary>
        public string Status { get; set; }
    }

    /// <summary>
    /// Account information
    /// </summary>
    public class AccountInfo
    {
        [JsonProperty("user_id")]
        public string UserId { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("points_balance")]
        public int PointsBalance { get; set; }

        [JsonProperty("daily_conversions_used")]
        public int DailyConversionsUsed { get; set; }

        [JsonProperty("daily_conversions_limit")]
        public int DailyConversionsLimit { get; set; }

        [JsonProperty("total_conversions")]
        public int TotalConversions { get; set; }

        [JsonProperty("created_at")]
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Job information (summary)
    /// </summary>
    public class JobInfo
    {
        [JsonProperty("job_id")]
        public string JobId { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("source_format")]
        public string SourceFormat { get; set; }

        [JsonProperty("target_format")]
        public string TargetFormat { get; set; }

        [JsonProperty("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("completed_at")]
        public DateTime? CompletedAt { get; set; }
    }

    /// <summary>
    /// Job details (full)
    /// </summary>
    public class JobDetails
    {
        [JsonProperty("job_id")]
        public string JobId { get; set; }

        [JsonProperty("user_id")]
        public string UserId { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("source_format")]
        public string SourceFormat { get; set; }

        [JsonProperty("target_format")]
        public string TargetFormat { get; set; }

        [JsonProperty("input_file_path")]
        public string InputFilePath { get; set; }

        [JsonProperty("output_file_path")]
        public string OutputFilePath { get; set; }

        [JsonProperty("download_url")]
        public string DownloadUrl { get; set; }

        [JsonProperty("file_size")]
        public long? FileSize { get; set; }

        [JsonProperty("processing_time_ms")]
        public int? ProcessingTimeMs { get; set; }

        [JsonProperty("error_message")]
        public string ErrorMessage { get; set; }

        [JsonProperty("conversion_metadata")]
        public Dictionary<string, object> ConversionMetadata { get; set; }

        [JsonProperty("expires_at")]
        public DateTime ExpiresAt { get; set; }

        [JsonProperty("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonProperty("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }

    #region Event Args

    /// <summary>
    /// Event args for conversion start
    /// </summary>
    public class ConversionStartEventArgs : EventArgs
    {
        public string FileName { get; set; }
        public string SourceFormat { get; set; }
        public string TargetFormat { get; set; }
    }

    /// <summary>
    /// Event args for conversion progress
    /// </summary>
    public class ConversionProgressEventArgs : EventArgs
    {
        public string Step { get; set; }
        public string Message { get; set; }
        public string JobId { get; set; }
        public string Status { get; set; }
    }

    /// <summary>
    /// Event args for conversion status
    /// </summary>
    public class ConversionStatusEventArgs : EventArgs
    {
        public string JobId { get; set; }
        public string Status { get; set; }
        public int Attempt { get; set; }
        public int MaxAttempts { get; set; }
    }

    /// <summary>
    /// Event args for conversion complete
    /// </summary>
    public class ConversionCompleteEventArgs : EventArgs
    {
        public ConversionResult Result { get; set; }
    }

    /// <summary>
    /// Event args for conversion error
    /// </summary>
    public class ConversionErrorEventArgs : EventArgs
    {
        public string Error { get; set; }
        public string InputPath { get; set; }
        public string TargetFormat { get; set; }
        public Exception Exception { get; set; }
    }

    #endregion

    #region API Response Models

    internal class UploadUrlResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("job_id")]
        public string JobId { get; set; }

        [JsonProperty("upload_url")]
        public string UploadUrl { get; set; }

        [JsonProperty("error")]
        public string Error { get; set; }
    }

    internal class ConfirmResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("error")]
        public string Error { get; set; }
    }

    internal class JobStatusResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("job")]
        public JobDetails Job { get; set; }

        [JsonProperty("error")]
        public string Error { get; set; }
    }

    internal class AccountResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("account")]
        public AccountInfo Account { get; set; }

        [JsonProperty("error")]
        public string Error { get; set; }
    }

    internal class ListJobsResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }

        [JsonProperty("jobs")]
        public JobInfo[] Jobs { get; set; }

        [JsonProperty("error")]
        public string Error { get; set; }
    }

    #endregion
}
