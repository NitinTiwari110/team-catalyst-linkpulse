package com.catalyst.linkpulse.dto;

import java.util.List;

public class LinkAnalyticsDto {
    private String linkId;
    private long totalClicks;
    private long uniqueVisitors;
    private List<TimeseriesDataPoint> clicksOverTime;
    private List<ClickMetricItem> referrers;
    private List<ClickMetricItem> devices;
    private List<ClickMetricItem> browsers;
    private List<ClickMetricItem> countries;

    public LinkAnalyticsDto() {}

    public static class TimeseriesDataPoint {
        private String date;
        private long clicks;
        private long uniqueVisitors;

        public TimeseriesDataPoint(String date, long clicks, long uniqueVisitors) {
            this.date = date;
            this.clicks = clicks;
            this.uniqueVisitors = uniqueVisitors;
        }

        public String getDate() { return date; }
        public long getClicks() { return clicks; }
        public long getUniqueVisitors() { return uniqueVisitors; }
    }

    public static class ClickMetricItem {
        private String name;
        private long clicks;
        private double percentage;

        public ClickMetricItem(String name, long clicks, double percentage) {
            this.name = name;
            this.clicks = clicks;
            this.percentage = percentage;
        }

        public String getName() { return name; }
        public long getClicks() { return clicks; }
        public double getPercentage() { return percentage; }
    }

    // Getters and Setters
    public String getLinkId() { return linkId; }
    public void setLinkId(String linkId) { this.linkId = linkId; }

    public long getTotalClicks() { return totalClicks; }
    public void setTotalClicks(long totalClicks) { this.totalClicks = totalClicks; }

    public long getUniqueVisitors() { return uniqueVisitors; }
    public void setUniqueVisitors(long uniqueVisitors) { this.uniqueVisitors = uniqueVisitors; }

    public List<TimeseriesDataPoint> getClicksOverTime() { return clicksOverTime; }
    public void setClicksOverTime(List<TimeseriesDataPoint> clicksOverTime) { this.clicksOverTime = clicksOverTime; }

    public List<ClickMetricItem> getReferrers() { return referrers; }
    public void setReferrers(List<ClickMetricItem> referrers) { this.referrers = referrers; }

    public List<ClickMetricItem> getDevices() { return devices; }
    public void setDevices(List<ClickMetricItem> devices) { this.devices = devices; }

    public List<ClickMetricItem> getBrowsers() { return browsers; }
    public void setBrowsers(List<ClickMetricItem> browsers) { this.browsers = browsers; }

    public List<ClickMetricItem> getCountries() { return countries; }
    public void setCountries(List<ClickMetricItem> countries) { this.countries = countries; }
}