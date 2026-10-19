package com.catalyst.linkpulse.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "links", indexes = {
    @Index(name = "idx_short_code", columnList = "shortCode", unique = true),
    @Index(name = "idx_campaign_id", columnList = "campaignId")
})
public class Link {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 2048)
    private String originalUrl;

    @Column(nullable = false, unique = true, length = 64)
    private String shortCode;

    @Column(length = 64)
    private String customAlias;

    @Column(length = 255)
    private String title;

    @Column(nullable = false)
    private long clickCount = 0;

    private Integer clickLimit;

    private String expiresAt;

    @Column(nullable = false)
    private boolean isActive = true;

    private String password;

    @Column(length = 512)
    private String tags; // Comma-separated: "Hackathon, Docs"

    @Column(length = 64)
    private String campaignId;

    @Column(nullable = false)
    private String createdAt;

    @Column(nullable = false)
    private String updatedAt;

    public Link() {
        this.id = "link-" + System.currentTimeMillis();
        this.createdAt = Instant.now().toString();
        this.updatedAt = Instant.now().toString();
        this.clickCount = 0;
        this.isActive = true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }

    public String getCustomAlias() { return customAlias; }
    public void setCustomAlias(String customAlias) { this.customAlias = customAlias; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public long getClickCount() { return clickCount; }
    public void setClickCount(long clickCount) { this.clickCount = clickCount; }

    public Integer getClickLimit() { return clickLimit; }
    public void setClickLimit(Integer clickLimit) { this.clickLimit = clickLimit; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getCampaignId() { return campaignId; }
    public void setCampaignId(String campaignId) { this.campaignId = campaignId; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}