using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Convertorio.SDK
{
    /// <summary>
    /// Convertorio SDK Client for .NET
    /// Simple and powerful SDK to convert images using the Convertorio API
    /// </summary>
    public class ConvertorioClient : IDisposable
    {
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly HttpClient _httpClient;
        private bool _disposed;

        /// <summary>
        /// Event fired when a conversion starts
        /// </summary>
        public event EventHandler<ConversionStartEventArgs> ConversionStart;

        /// <summary>
        /// Event fired when conversion progress updates
        /// </summary>
        public event EventHandler<ConversionProgressEventArgs> ConversionProgress;

        /// <summary>
        /// Event fired when conversion status updates
        /// </summary>
        public event EventHandler<ConversionStatusEventArgs> ConversionStatus;

        /// <summary>
        /// Event fired when a conversion completes successfully
        /// </summary>
        public event EventHandler<ConversionCompleteEventArgs> ConversionComplete;

        /// <summary>
        /// Event fired when a conversion encounters an error
        /// </summary>
        public event EventHandler<ConversionErrorEventArgs> ConversionError;

        /// <summary>
        /// Create a new Convertorio client
        /// </summary>
        /// <param name="apiKey">Your Convertorio API key</param>
        /// <param name="baseUrl">API base URL (default: https://api.convertorio.com)</param>
        public ConvertorioClient(string apiKey, string baseUrl = "https://api.convertorio.com")
        {
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new ArgumentException("API key is required. Get yours at https://convertorio.com/account", nameof(apiKey));
            }

            _apiKey = apiKey;
            _baseUrl = baseUrl.TrimEnd('/');

            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(_baseUrl)
            };
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        /// <summary>
        /// Convert an image file
        /// </summary>
        /// <param name="options">Conversion options</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Conversion result with download URL and file path</returns>
        public async Task<ConversionResult> ConvertFileAsync(ConversionOptions options, CancellationToken cancellationToken = default)
        {
            if (options == null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            if (string.IsNullOrWhiteSpace(options.InputPath))
            {
                throw new ArgumentException("InputPath is required", nameof(options));
            }

            if (string.IsNullOrWhiteSpace(options.TargetFormat))
            {
                throw new ArgumentException("TargetFormat is required", nameof(options));
            }

            // Validate input file exists
            if (!File.Exists(options.InputPath))
            {
                throw new FileNotFoundException($"Input file not found: {options.InputPath}");
            }

            var fileInfo = new FileInfo(options.InputPath);
            var fileName = Path.GetFileName(options.InputPath);
            var sourceFormat = Path.GetExtension(options.InputPath).TrimStart('.').ToLowerInvariant();

            OnConversionStart(new ConversionStartEventArgs
            {
                FileName = fileName,
                SourceFormat = sourceFormat,
                TargetFormat = options.TargetFormat
            });

            try
            {
                // Step 1: Request upload URL
                OnConversionProgress(new ConversionProgressEventArgs
                {
                    Step = "requesting-upload-url",
                    Message = "Requesting upload URL from server..."
                });

                var uploadUrlRequest = new
                {
                    filename = fileName,
                    source_format = sourceFormat,
                    target_format = options.TargetFormat.ToLowerInvariant(),
                    file_size = fileInfo.Length,
                    conversion_metadata = options.ConversionMetadata
                };

                var uploadResponse = await PostAsync<UploadUrlResponse>("/v1/convert/upload-url", uploadUrlRequest, cancellationToken);

                if (!uploadResponse.Success)
                {
                    throw new ConvertorioException(uploadResponse.Error ?? "Failed to get upload URL");
                }

                var jobId = uploadResponse.JobId;
                var uploadUrl = uploadResponse.UploadUrl;

                OnConversionProgress(new ConversionProgressEventArgs
                {
                    Step = "uploading",
                    Message = "Uploading file to cloud storage...",
                    JobId = jobId
                });

                // Step 2: Upload file to S3
                await UploadFileAsync(uploadUrl, options.InputPath, $"image/{sourceFormat}", cancellationToken);

                OnConversionProgress(new ConversionProgressEventArgs
                {
                    Step = "confirming",
                    Message = "Confirming upload and queuing conversion...",
                    JobId = jobId
                });

                // Step 3: Confirm upload and queue conversion
                var confirmRequest = new { job_id = jobId };
                var confirmResponse = await PostAsync<ConfirmResponse>("/v1/convert/confirm", confirmRequest, cancellationToken);

                if (!confirmResponse.Success)
                {
                    throw new ConvertorioException(confirmResponse.Error ?? "Failed to confirm upload");
                }

                OnConversionProgress(new ConversionProgressEventArgs
                {
                    Step = "converting",
                    Message = "Converting image...",
                    JobId = jobId,
                    Status = confirmResponse.Status
                });

                // Step 4: Poll for completion
                var job = await PollJobStatusAsync(jobId, cancellationToken);

                OnConversionProgress(new ConversionProgressEventArgs
                {
                    Step = "downloading",
                    Message = "Downloading converted file...",
                    JobId = jobId
                });

                // Step 5: Download converted file
                var outputPath = options.OutputPath ?? GenerateOutputPath(options.InputPath, options.TargetFormat);
                await DownloadFileAsync(job.DownloadUrl, outputPath, cancellationToken);

                var result = new ConversionResult
                {
                    Success = true,
                    JobId = jobId,
                    InputPath = options.InputPath,
                    OutputPath = outputPath,
                    SourceFormat = sourceFormat,
                    TargetFormat = options.TargetFormat.ToLowerInvariant(),
                    FileSize = new FileInfo(outputPath).Length,
                    ProcessingTime = job.ProcessingTimeMs ?? 0,
                    DownloadUrl = job.DownloadUrl,
                    TokensUsed = job.TokensUsed
                };

                OnConversionComplete(new ConversionCompleteEventArgs { Result = result });

                return result;
            }
            catch (Exception ex)
            {
                var errorArgs = new ConversionErrorEventArgs
                {
                    Error = ex.Message,
                    InputPath = options.InputPath,
                    TargetFormat = options.TargetFormat,
                    Exception = ex
                };

                OnConversionError(errorArgs);
                throw;
            }
        }

        /// <summary>
        /// Poll job status until completion
        /// </summary>
        private async Task<JobDetails> PollJobStatusAsync(string jobId, CancellationToken cancellationToken, int maxAttempts = 60, int intervalMs = 2000)
        {
            int attempts = 0;

            while (attempts < maxAttempts)
            {
                attempts++;

                // Wait before polling (except first attempt)
                if (attempts > 1)
                {
                    await Task.Delay(intervalMs, cancellationToken);
                }

                var response = await GetAsync<JobStatusResponse>($"/v1/jobs/{jobId}", cancellationToken);

                if (!response.Success)
                {
                    throw new ConvertorioException("Failed to get job status");
                }

                var job = response.Job;

                OnConversionStatus(new ConversionStatusEventArgs
                {
                    JobId = jobId,
                    Status = job.Status,
                    Attempt = attempts,
                    MaxAttempts = maxAttempts
                });

                if (job.Status == "completed")
                {
                    return job;
                }

                if (job.Status == "failed")
                {
                    throw new ConvertorioException(job.ErrorMessage ?? "Conversion failed");
                }

                if (job.Status == "expired")
                {
                    throw new ConvertorioException("Job expired");
                }
            }

            throw new ConvertorioException("Conversion timeout - job did not complete in time");
        }

        /// <summary>
        /// Upload file to presigned URL
        /// </summary>
        private async Task UploadFileAsync(string url, string filePath, string contentType, CancellationToken cancellationToken)
        {
            using (var fileStream = File.OpenRead(filePath))
            using (var content = new StreamContent(fileStream))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

                using (var uploadClient = new HttpClient())
                {
                    var response = await uploadClient.PutAsync(url, content, cancellationToken);
                    response.EnsureSuccessStatusCode();
                }
            }
        }

        /// <summary>
        /// Download file from URL
        /// </summary>
        private async Task DownloadFileAsync(string url, string outputPath, CancellationToken cancellationToken)
        {
            using (var downloadClient = new HttpClient())
            {
                var response = await downloadClient.GetAsync(url, cancellationToken);
                response.EnsureSuccessStatusCode();

                // Ensure output directory exists
                var outputDir = Path.GetDirectoryName(outputPath);
                if (!string.IsNullOrEmpty(outputDir) && !Directory.Exists(outputDir))
                {
                    Directory.CreateDirectory(outputDir);
                }

                using (var fileStream = File.Create(outputPath))
                {
                    await response.Content.CopyToAsync(fileStream);
                }
            }
        }

        /// <summary>
        /// Generate output path based on input path and target format
        /// </summary>
        private string GenerateOutputPath(string inputPath, string targetFormat)
        {
            var directory = Path.GetDirectoryName(inputPath);
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(inputPath);
            var newFileName = $"{fileNameWithoutExt}.{targetFormat.ToLowerInvariant()}";

            return string.IsNullOrEmpty(directory)
                ? newFileName
                : Path.Combine(directory, newFileName);
        }

        /// <summary>
        /// Get account information
        /// </summary>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Account details</returns>
        public async Task<AccountInfo> GetAccountAsync(CancellationToken cancellationToken = default)
        {
            var response = await GetAsync<AccountResponse>("/v1/account", cancellationToken);

            if (!response.Success)
            {
                throw new ConvertorioException(response.Error ?? "Failed to get account info");
            }

            return response.Account;
        }

        /// <summary>
        /// List conversion jobs
        /// </summary>
        /// <param name="options">List options</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>List of jobs</returns>
        public async Task<JobInfo[]> ListJobsAsync(ListJobsOptions options = null, CancellationToken cancellationToken = default)
        {
            options = options ?? new ListJobsOptions();

            var queryParams = new System.Collections.Generic.List<string>();
            if (options.Limit.HasValue) queryParams.Add($"limit={options.Limit}");
            if (options.Offset.HasValue) queryParams.Add($"offset={options.Offset}");
            if (!string.IsNullOrWhiteSpace(options.Status)) queryParams.Add($"status={options.Status}");

            var queryString = queryParams.Count > 0 ? "?" + string.Join("&", queryParams) : "";
            var response = await GetAsync<ListJobsResponse>($"/v1/jobs{queryString}", cancellationToken);

            if (!response.Success)
            {
                throw new ConvertorioException(response.Error ?? "Failed to list jobs");
            }

            return response.Jobs;
        }

        /// <summary>
        /// Get job status
        /// </summary>
        /// <param name="jobId">Job ID</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Job details</returns>
        public async Task<JobDetails> GetJobAsync(string jobId, CancellationToken cancellationToken = default)
        {
            var response = await GetAsync<JobStatusResponse>($"/v1/jobs/{jobId}", cancellationToken);

            if (!response.Success)
            {
                throw new ConvertorioException(response.Error ?? "Failed to get job");
            }

            return response.Job;
        }

        #region HTTP Methods

        private async Task<T> GetAsync<T>(string endpoint, CancellationToken cancellationToken)
        {
            var response = await _httpClient.GetAsync(endpoint, cancellationToken);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new ConvertorioException($"API request failed: {response.StatusCode} - {content}");
            }

            return JsonConvert.DeserializeObject<T>(content);
        }

        private async Task<T> PostAsync<T>(string endpoint, object data, CancellationToken cancellationToken)
        {
            var json = JsonConvert.SerializeObject(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(endpoint, content, cancellationToken);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new ConvertorioException($"API request failed: {response.StatusCode} - {responseContent}");
            }

            return JsonConvert.DeserializeObject<T>(responseContent);
        }

        #endregion

        #region Event Handlers

        protected virtual void OnConversionStart(ConversionStartEventArgs e)
        {
            ConversionStart?.Invoke(this, e);
        }

        protected virtual void OnConversionProgress(ConversionProgressEventArgs e)
        {
            ConversionProgress?.Invoke(this, e);
        }

        protected virtual void OnConversionStatus(ConversionStatusEventArgs e)
        {
            ConversionStatus?.Invoke(this, e);
        }

        protected virtual void OnConversionComplete(ConversionCompleteEventArgs e)
        {
            ConversionComplete?.Invoke(this, e);
        }

        protected virtual void OnConversionError(ConversionErrorEventArgs e)
        {
            ConversionError?.Invoke(this, e);
        }

        #endregion

        #region IDisposable

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;

            if (disposing)
            {
                _httpClient?.Dispose();
            }

            _disposed = true;
        }

        #endregion
    }
}
