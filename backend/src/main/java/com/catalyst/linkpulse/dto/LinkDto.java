package com.catalyst.linkpulse.dto;

import java.util.List;

public class LinkDto {
    private String id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private String title;
    private String customAlias;
    private String createdAt;
    private String updatedAt;
    private String expiresAt;
    private Integer clickLimit;
    private long clickCount;
    private boolean isActive;
    private boolean isPasswordProtected;
    private List<String> tags;
    private String campaignId;
    private String campaignName;

    public LinkDto() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }

    public String getShortUrl() { return shortUrl; }
    public void setShortUrl(String shortUrl) { this.shortUrl = shortUrl; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCustomAlias() { return customAlias; }
    public void setCustomAlias(String customAlias) { this.customAlias = customAlias; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }

    public Integer getClickLimit() { return clickLimit; }
    public void setClickLimit(Integer clickLimit) { this.clickLimit = clickLimit; }

    public long getClickCount() { return clickCount; }
    public void setClickCount(long clickCount) { this.clickCount = clickCount; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public boolean isPasswordProtected() { return isPasswordProtected; }
    public void setPasswordProtected(boolean passwordProtected) { isPasswordProtected = passwordProtected; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getCampaignId() { return campaignId; }
    public void setCampaignId(String campaignId) { this.campaignId = campaignId; }

    public String getCampaignName() { return campaignName; }
    public void setCampaignName(String campaignName) { this.campaignName = campaignName; }
}