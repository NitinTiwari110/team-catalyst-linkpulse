package com.catalyst.linkpulse.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "click_events", indexes = {
    @Index(name = "idx_click_link_id", columnList = "linkId")
})
public class ClickEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String linkId;

    @Column(nullable = false)
    private String clickedAt;

    @Column(length = 128)
    private String referrer;

    @Column(length = 64)
    private String device;

    @Column(length = 64)
    private String browser;

    @Column(length = 64)
    private String country;

    @Column(length = 64)
    private String ipAddress;

    public ClickEvent() {
        this.clickedAt = Instant.now().toString();
    }

    public ClickEvent(String linkId, String referrer, String device, String browser, String country, String ipAddress) {
        this();
        this.linkId = linkId;
        this.referrer = referrer;
        this.device = device;
        this.browser = browser;
        this.country = country;
        this.ipAddress = ipAddress;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLinkId() { return linkId; }
    public void setLinkId(String linkId) { this.linkId = linkId; }

    public String getClickedAt() { return clickedAt; }
    public void setClickedAt(String clickedAt) { this.clickedAt = clickedAt; }

    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }

    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}