package com.sedesoft.convertorio;

import com.google.gson.annotations.SerializedName;

/**
 * Represents a conversion job
 */
public class Job {
    private String id;
    private String status;

    @SerializedName("source_format")
    private String sourceFormat;

    @SerializedName("target_format")
    private String targetFormat;

    @SerializedName("file_size")
    private Long fileSize;

    @SerializedName("processing_time_ms")
    private Long processingTimeMs;

    @SerializedName("download_url")
    private String downloadUrl;

    @SerializedName("error_message")
    private String errorMessage;

    @SerializedName("created_at")
    private String createdAt;

    @SerializedName("completed_at")
    private String completedAt;

    @SerializedName("expires_at")
    private String expiresAt;

    // Getters
    public String getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public String getSourceFormat() {
        return sourceFormat;
    }

    public String getTargetFormat() {
        return targetFormat;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public Long getProcessingTimeMs() {
        return processingTimeMs;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getCompletedAt() {
        return completedAt;
    }

    public String getExpiresAt() {
        return expiresAt;
    }

    @Override
    public String toString() {
        return "Job{" +
                "id='" + id + '\'' +
                ", status='" + status + '\'' +
                ", sourceFormat='" + sourceFormat + '\'' +
                ", targetFormat='" + targetFormat + '\'' +
                ", fileSize=" + fileSize +
                ", processingTimeMs=" + processingTimeMs +
                ", downloadUrl='" + downloadUrl + '\'' +
                ", errorMessage='" + errorMessage + '\'' +
                ", createdAt='" + createdAt + '\'' +
                ", completedAt='" + completedAt + '\'' +
                ", expiresAt='" + expiresAt + '\'' +
                '}';
    }
}
