package com.sedesoft.convertorio;

/**
 * Configuration for Convertorio client
 */
public class ClientConfig {
    private final String apiKey;
    private final String baseUrl;

    private ClientConfig(Builder builder) {
        this.apiKey = builder.apiKey;
        this.baseUrl = builder.baseUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String apiKey;
        private String baseUrl;

        public Builder apiKey(String apiKey) {
            this.apiKey = apiKey;
            return this;
        }

        public Builder baseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
            return this;
        }

        public ClientConfig build() {
            return new ClientConfig(this);
        }
    }
}
