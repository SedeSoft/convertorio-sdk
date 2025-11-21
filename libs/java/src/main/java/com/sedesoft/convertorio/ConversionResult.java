package com.sedesoft.convertorio;

/**
 * Result of a file conversion
 */
public class ConversionResult {
    private final boolean success;
    private final String jobId;
    private final String inputPath;
    private final String outputPath;
    private final String sourceFormat;
    private final String targetFormat;
    private final long fileSize;
    private final long processingTime;
    private final String downloadUrl;

    public ConversionResult(boolean success, String jobId, String inputPath, String outputPath,
                          String sourceFormat, String targetFormat, long fileSize,
                          long processingTime, String downloadUrl) {
        this.success = success;
        this.jobId = jobId;
        this.inputPath = inputPath;
        this.outputPath = outputPath;
        this.sourceFormat = sourceFormat;
        this.targetFormat = targetFormat;
        this.fileSize = fileSize;
        this.processingTime = processingTime;
        this.downloadUrl = downloadUrl;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getJobId() {
        return jobId;
    }

    public String getInputPath() {
        return inputPath;
    }

    public String getOutputPath() {
        return outputPath;
    }

    public String getSourceFormat() {
        return sourceFormat;
    }

    public String getTargetFormat() {
        return targetFormat;
    }

    public long getFileSize() {
        return fileSize;
    }

    public long getProcessingTime() {
        return processingTime;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    @Override
    public String toString() {
        return "ConversionResult{" +
                "success=" + success +
                ", jobId='" + jobId + '\'' +
                ", inputPath='" + inputPath + '\'' +
                ", outputPath='" + outputPath + '\'' +
                ", sourceFormat='" + sourceFormat + '\'' +
                ", targetFormat='" + targetFormat + '\'' +
                ", fileSize=" + fileSize +
                ", processingTime=" + processingTime +
                ", downloadUrl='" + downloadUrl + '\'' +
                '}';
    }
}
