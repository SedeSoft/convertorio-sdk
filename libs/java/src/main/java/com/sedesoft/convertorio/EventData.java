package com.sedesoft.convertorio;

import java.util.HashMap;
import java.util.Map;

/**
 * Event data passed to event listeners
 */
public class EventData {
    private final Map<String, Object> data;

    private EventData(Map<String, Object> data) {
        this.data = data;
    }

    public Object get(String key) {
        return data.get(key);
    }

    public String getString(String key) {
        Object value = data.get(key);
        return value != null ? value.toString() : null;
    }

    public Integer getInt(String key) {
        Object value = data.get(key);
        if (value instanceof Integer) {
            return (Integer) value;
        }
        return null;
    }

    public Long getLong(String key) {
        Object value = data.get(key);
        if (value instanceof Long) {
            return (Long) value;
        } else if (value instanceof Integer) {
            return ((Integer) value).longValue();
        }
        return null;
    }

    public Boolean getBoolean(String key) {
        Object value = data.get(key);
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        return null;
    }

    public Map<String, Object> getAll() {
        return new HashMap<>(data);
    }

    public static Builder builder() {
        return new Builder();
    }

    public static EventData fromResult(ConversionResult result) {
        return builder()
            .set("success", result.isSuccess())
            .set("jobId", result.getJobId())
            .set("inputPath", result.getInputPath())
            .set("outputPath", result.getOutputPath())
            .set("sourceFormat", result.getSourceFormat())
            .set("targetFormat", result.getTargetFormat())
            .set("fileSize", result.getFileSize())
            .set("processingTime", result.getProcessingTime())
            .set("downloadUrl", result.getDownloadUrl())
            .build();
    }

    public static class Builder {
        private final Map<String, Object> data = new HashMap<>();

        public Builder set(String key, Object value) {
            data.put(key, value);
            return this;
        }

        public EventData build() {
            return new EventData(data);
        }
    }

    @Override
    public String toString() {
        return "EventData{" + data + '}';
    }
}
