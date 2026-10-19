package com.catalyst.linkpulse.dto;

public class CampaignDto {
    private String id;
    private String name;
    private String description;
    private int linkCount;
    private long totalClicks;
    private String createdAt;

    public CampaignDto() {}

    public CampaignDto(String id, String name, String description, int linkCount, long totalClicks, String createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.linkCount = linkCount;
        this.totalClicks = totalClicks;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getLinkCount() { return linkCount; }
    public void setLinkCount(int linkCount) { this.linkCount = linkCount; }

    public long getTotalClicks() { return totalClicks; }
    public void setTotalClicks(long totalClicks) { this.totalClicks = totalClicks; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}