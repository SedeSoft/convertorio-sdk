package com.sedesoft.convertorio;

import java.util.Map;

/**
 * Options for file conversion
 */
public class ConversionOptions {
    private final String inputPath;
    private final String targetFormat;
    private final String outputPath;
    private final Map<String, Object> conversionMetadata;

    private ConversionOptions(Builder builder) {
        this.inputPath = builder.inputPath;
        this.targetFormat = builder.targetFormat;
        this.outputPath = builder.outputPath;
        this.conversionMetadata = builder.conversionMetadata;
    }

    public String getInputPath() {
        return inputPath;
    }

    public String getTargetFormat() {
        return targetFormat;
    }

    public String getOutputPath() {
        return outputPath;
    }

    public Map<String, Object> getConversionMetadata() {
        return conversionMetadata;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String inputPath;
        private String targetFormat;
        private String outputPath;
        private Map<String, Object> conversionMetadata;

        public Builder inputPath(String inputPath) {
            this.inputPath = inputPath;
            return this;
        }

        public Builder targetFormat(String targetFormat) {
            this.targetFormat = targetFormat;
            return this;
        }

        public Builder outputPath(String outputPath) {
            this.outputPath = outputPath;
            return this;
        }

        public Builder conversionMetadata(Map<String, Object> conversionMetadata) {
            this.conversionMetadata = conversionMetadata;
            return this;
        }

        public ConversionOptions build() {
            return new ConversionOptions(this);
        }
    }
}
