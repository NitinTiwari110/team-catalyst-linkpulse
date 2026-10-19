package com.catalyst.linkpulse.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "campaigns")
public class Campaign {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String createdAt;

    public Campaign() {
        this.id = "camp-" + System.currentTimeMillis();
        this.createdAt = Instant.now().toString();
    }

    public Campaign(String name, String description) {
        this();
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}