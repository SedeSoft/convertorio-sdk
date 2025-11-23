package com.sedesoft.convertorio;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import okhttp3.*;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

/**
 * Convertorio SDK Client for Java
 *
 * Simple and powerful SDK to convert images using the Convertorio API.
 *
 * @version 1.2.0
 */
public class ConvertorioClient {
    private final String apiKey;
    private final String baseUrl;
    private final OkHttpClient httpClient;
    private final Gson gson;
    private final Map<String, Consumer<EventData>> eventListeners;

    private static final int MAX_POLLING_ATTEMPTS = 60;
    private static final int POLLING_INTERVAL_MS = 2000;
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    /**
     * Create a new Convertorio client
     *
     * @param config Configuration object
     * @throws IllegalArgumentException if API key is not provided
     */
    public ConvertorioClient(ClientConfig config) {
        if (config.getApiKey() == null || config.getApiKey().isEmpty()) {
            throw new IllegalArgumentException("API key is required. Get yours at https://convertorio.com/account");
        }

        this.apiKey = config.getApiKey();
        this.baseUrl = config.getBaseUrl() != null ? config.getBaseUrl() : "https://api.convertorio.com";
        this.gson = new Gson();
        this.eventListeners = new HashMap<>();

        this.httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();
    }

    /**
     * Register an event listener
     *
     * @param event Event name (start, progress, status, complete, error)
     * @param listener Event callback
     * @return this client instance for chaining
     */
    public ConvertorioClient on(String event, Consumer<EventData> listener) {
        eventListeners.put(event, listener);
        return this;
    }

    /**
     * Emit an event to registered listeners
     */
    private void emit(String event, EventData data) {
        Consumer<EventData> listener = eventListeners.get(event);
        if (listener != null) {
            listener.accept(data);
        }
    }

    /**
     * Convert an image file
     *
     * @param options Conversion options
     * @return Conversion result with download URL and file path
     * @throws ConvertorioException if conversion fails
     */
    public ConversionResult convertFile(ConversionOptions options) throws ConvertorioException {
        if (options.getInputPath() == null) {
            throw new IllegalArgumentException("inputPath is required");
        }

        if (options.getTargetFormat() == null) {
            throw new IllegalArgumentException("targetFormat is required");
        }

        File inputFile = new File(options.getInputPath());
        if (!inputFile.exists()) {
            throw new ConvertorioException("Input file not found: " + options.getInputPath());
        }

        String fileName = inputFile.getName();
        String sourceFormat = getFileExtension(fileName);
        long fileSize = inputFile.length();

        emit("start", EventData.builder()
            .set("fileName", fileName)
            .set("sourceFormat", sourceFormat)
            .set("targetFormat", options.getTargetFormat())
            .build());

        try {
            // Step 1: Request upload URL
            emit("progress", EventData.builder()
                .set("step", "requesting-upload-url")
                .set("message", "Requesting upload URL from server...")
                .build());

            JsonObject requestBody = new JsonObject();
            requestBody.addProperty("filename", fileName);
            requestBody.addProperty("source_format", sourceFormat);
            requestBody.addProperty("target_format", options.getTargetFormat().toLowerCase());
            requestBody.addProperty("file_size", fileSize);

            if (options.getConversionMetadata() != null && !options.getConversionMetadata().isEmpty()) {
                requestBody.add("conversion_metadata", gson.toJsonTree(options.getConversionMetadata()));
            }

            JsonObject uploadResponse = makeRequest("POST", "/v1/convert/upload-url", requestBody);

            if (!uploadResponse.get("success").getAsBoolean()) {
                throw new ConvertorioException(uploadResponse.has("error") ?
                    uploadResponse.get("error").getAsString() : "Failed to get upload URL");
            }

            String jobId = uploadResponse.get("job_id").getAsString();
            String uploadUrl = uploadResponse.get("upload_url").getAsString();

            // Step 2: Upload file to S3
            emit("progress", EventData.builder()
                .set("step", "uploading")
                .set("message", "Uploading file to cloud storage...")
                .set("jobId", jobId)
                .build());

            uploadFile(uploadUrl, inputFile, sourceFormat);

            // Step 3: Confirm upload and queue conversion
            emit("progress", EventData.builder()
                .set("step", "confirming")
                .set("message", "Confirming upload and queuing conversion...")
                .set("jobId", jobId)
                .build());

            JsonObject confirmBody = new JsonObject();
            confirmBody.addProperty("job_id", jobId);
            JsonObject confirmResponse = makeRequest("POST", "/v1/convert/confirm", confirmBody);

            if (!confirmResponse.get("success").getAsBoolean()) {
                throw new ConvertorioException(confirmResponse.has("error") ?
                    confirmResponse.get("error").getAsString() : "Failed to confirm upload");
            }

            // Step 4: Poll for completion
            emit("progress", EventData.builder()
                .set("step", "converting")
                .set("message", "Converting image...")
                .set("jobId", jobId)
                .set("status", confirmResponse.has("status") ? confirmResponse.get("status").getAsString() : "queued")
                .build());

            Job job = pollJobStatus(jobId);

            // Step 5: Download converted file
            emit("progress", EventData.builder()
                .set("step", "downloading")
                .set("message", "Downloading converted file...")
                .set("jobId", jobId)
                .build());

            String outputPath = options.getOutputPath() != null ?
                options.getOutputPath() : generateOutputPath(options.getInputPath(), options.getTargetFormat());

            downloadFile(job.getDownloadUrl(), outputPath);

            ConversionResult result = new ConversionResult(
                true,
                jobId,
                options.getInputPath(),
                outputPath,
                sourceFormat,
                options.getTargetFormat().toLowerCase(),
                new File(outputPath).length(),
                job.getProcessingTimeMs(),
                job.getDownloadUrl(),
                job.getTokensUsed()
            );

            emit("complete", EventData.fromResult(result));
            return result;

        } catch (ConvertorioException e) {
            EventData errorData = EventData.builder()
                .set("success", false)
                .set("error", e.getMessage())
                .set("inputPath", options.getInputPath())
                .set("targetFormat", options.getTargetFormat())
                .build();
            emit("error", errorData);
            throw e;
        }
    }

    /**
     * Poll job status until completion
     */
    private Job pollJobStatus(String jobId) throws ConvertorioException {
        int attempts = 0;

        while (attempts < MAX_POLLING_ATTEMPTS) {
            attempts++;

            if (attempts > 1) {
                try {
                    Thread.sleep(POLLING_INTERVAL_MS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new ConvertorioException("Polling interrupted");
                }
            }

            JsonObject statusResponse = makeRequest("GET", "/v1/jobs/" + jobId, null);

            if (!statusResponse.get("success").getAsBoolean()) {
                throw new ConvertorioException("Failed to get job status");
            }

            Job job = gson.fromJson(statusResponse.get("job"), Job.class);
            String status = job.getStatus();

            emit("status", EventData.builder()
                .set("jobId", jobId)
                .set("status", status)
                .set("attempt", attempts)
                .set("maxAttempts", MAX_POLLING_ATTEMPTS)
                .build());

            if ("completed".equals(status)) {
                return job;
            }

            if ("failed".equals(status)) {
                throw new ConvertorioException(job.getErrorMessage() != null ?
                    job.getErrorMessage() : "Conversion failed");
            }

            if ("expired".equals(status)) {
                throw new ConvertorioException("Job expired");
            }
        }

        throw new ConvertorioException("Conversion timeout - job did not complete in time");
    }

    /**
     * Upload file to S3
     */
    private void uploadFile(String url, File file, String sourceFormat) throws ConvertorioException {
        try {
            byte[] fileData = Files.readAllBytes(file.toPath());
            RequestBody body = RequestBody.create(fileData, MediaType.get("image/" + sourceFormat));

            Request request = new Request.Builder()
                .url(url)
                .put(body)
                .addHeader("Content-Type", "image/" + sourceFormat)
                .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new ConvertorioException("Failed to upload file. HTTP Status: " + response.code());
                }
            }
        } catch (IOException e) {
            throw new ConvertorioException("Upload failed: " + e.getMessage(), e);
        }
    }

    /**
     * Download file from URL
     */
    private void downloadFile(String url, String outputPath) throws ConvertorioException {
        try {
            Request request = new Request.Builder()
                .url(url)
                .get()
                .build();

            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new ConvertorioException("Failed to download file. HTTP Status: " + response.code());
                }

                File outputFile = new File(outputPath);
                File parentDir = outputFile.getParentFile();
                if (parentDir != null && !parentDir.exists()) {
                    parentDir.mkdirs();
                }

                try (InputStream inputStream = response.body().byteStream();
                     FileOutputStream outputStream = new FileOutputStream(outputFile)) {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(buffer)) != -1) {
                        outputStream.write(buffer, 0, bytesRead);
                    }
                }
            }
        } catch (IOException e) {
            throw new ConvertorioException("Download failed: " + e.getMessage(), e);
        }
    }

    /**
     * Make HTTP request to API
     */
    private JsonObject makeRequest(String method, String endpoint, JsonObject data) throws ConvertorioException {
        try {
            String url = baseUrl + endpoint;
            Request.Builder requestBuilder = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json");

            if ("POST".equals(method) && data != null) {
                RequestBody body = RequestBody.create(gson.toJson(data), JSON);
                requestBuilder.post(body);
            } else {
                requestBuilder.get();
            }

            try (Response response = httpClient.newCall(requestBuilder.build()).execute()) {
                if (!response.isSuccessful()) {
                    throw new ConvertorioException("HTTP request failed with status code: " + response.code());
                }

                String responseBody = response.body().string();
                return gson.fromJson(responseBody, JsonObject.class);
            }
        } catch (IOException e) {
            throw new ConvertorioException("Request failed: " + e.getMessage(), e);
        }
    }

    /**
     * Generate output path based on input path and target format
     */
    private String generateOutputPath(String inputPath, String targetFormat) {
        File inputFile = new File(inputPath);
        String dir = inputFile.getParent();
        String baseName = getFileNameWithoutExtension(inputFile.getName());
        String separator = dir != null ? File.separator : "";
        return (dir != null ? dir : "") + separator + baseName + "." + targetFormat.toLowerCase();
    }

    /**
     * Get file extension without dot
     */
    private String getFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot > 0) {
            return fileName.substring(lastDot + 1).toLowerCase();
        }
        return "";
    }

    /**
     * Get file name without extension
     */
    private String getFileNameWithoutExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        if (lastDot > 0) {
            return fileName.substring(0, lastDot);
        }
        return fileName;
    }

    /**
     * Get account information
     *
     * @return Account details
     * @throws ConvertorioException if request fails
     */
    public Account getAccount() throws ConvertorioException {
        JsonObject response = makeRequest("GET", "/v1/account", null);

        if (!response.get("success").getAsBoolean()) {
            throw new ConvertorioException(response.has("error") ?
                response.get("error").getAsString() : "Failed to get account info");
        }

        return gson.fromJson(response.get("account"), Account.class);
    }

    /**
     * List conversion jobs
     *
     * @param limit Number of jobs to return (max: 100)
     * @param offset Offset for pagination
     * @param status Filter by status (completed, failed, processing, etc.)
     * @return Array of jobs
     * @throws ConvertorioException if request fails
     */
    public Job[] listJobs(int limit, int offset, String status) throws ConvertorioException {
        String endpoint = String.format("/v1/jobs?limit=%d&offset=%d", limit, offset);
        if (status != null && !status.isEmpty()) {
            endpoint += "&status=" + status;
        }

        JsonObject response = makeRequest("GET", endpoint, null);

        if (!response.get("success").getAsBoolean()) {
            throw new ConvertorioException(response.has("error") ?
                response.get("error").getAsString() : "Failed to list jobs");
        }

        return gson.fromJson(response.get("jobs"), Job[].class);
    }

    /**
     * Get job status
     *
     * @param jobId Job ID
     * @return Job details
     * @throws ConvertorioException if request fails
     */
    public Job getJob(String jobId) throws ConvertorioException {
        JsonObject response = makeRequest("GET", "/v1/jobs/" + jobId, null);

        if (!response.get("success").getAsBoolean()) {
            throw new ConvertorioException(response.has("error") ?
                response.get("error").getAsString() : "Failed to get job");
        }

        return gson.fromJson(response.get("job"), Job.class);
    }
}
