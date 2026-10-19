package com.catalyst.linkpulse.dto;

import java.util.List;

public class CreateLinkRequest {
    private String originalUrl;
    private String customAlias;
    private String title;
    private String expiresAt;
    private Integer clickLimit;
    private String password;
    private List<String> tags;
    private String campaignId;

    public CreateLinkRequest() {}

    // Getters and Setters
    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getCustomAlias() { return customAlias; }
    public void setCustomAlias(String customAlias) { this.customAlias = customAlias; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }

    public Integer getClickLimit() { return clickLimit; }
    public void setClickLimit(Integer clickLimit) { this.clickLimit = clickLimit; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getCampaignId() { return campaignId; }
    public void setCampaignId(String campaignId) { this.campaignId = campaignId; }
}