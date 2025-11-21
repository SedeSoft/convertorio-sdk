package com.sedesoft.convertorio;

import com.google.gson.annotations.SerializedName;

/**
 * Represents account information
 */
public class Account {
    private String id;
    private String email;

    @SerializedName("api_key")
    private String apiKey;

    @SerializedName("points_balance")
    private Integer pointsBalance;

    @SerializedName("total_conversions")
    private Integer totalConversions;

    @SerializedName("created_at")
    private String createdAt;

    // Getters
    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getApiKey() {
        return apiKey;
    }

    public Integer getPointsBalance() {
        return pointsBalance;
    }

    public Integer getTotalConversions() {
        return totalConversions;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    @Override
    public String toString() {
        return "Account{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", apiKey='" + apiKey + '\'' +
                ", pointsBalance=" + pointsBalance +
                ", totalConversions=" + totalConversions +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }
}
