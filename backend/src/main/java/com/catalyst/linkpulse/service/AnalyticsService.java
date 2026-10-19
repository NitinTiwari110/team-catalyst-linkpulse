package com.catalyst.linkpulse.service;

import com.catalyst.linkpulse.dto.LinkAnalyticsDto;
import com.catalyst.linkpulse.model.ClickEvent;
import com.catalyst.linkpulse.model.Link;
import com.catalyst.linkpulse.repository.ClickEventRepository;
import com.catalyst.linkpulse.repository.LinkRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class AnalyticsService {

    private final ClickEventRepository clickEventRepository;
    private final LinkRepository linkRepository;

    public AnalyticsService(ClickEventRepository clickEventRepository, LinkRepository linkRepository) {
        this.clickEventRepository = clickEventRepository;
        this.linkRepository = linkRepository;
    }

    @Transactional
    public void recordClick(Link link, HttpServletRequest request) {
        // Increment link counter
        link.setClickCount(link.getClickCount() + 1);
        link.setUpdatedAt(Instant.now().toString());
        linkRepository.save(link);

        // Detect Referrer
        String rawReferrer = request.getHeader("Referer");
        String referrer = "Direct / QR";
        if (rawReferrer != null && !rawReferrer.trim().isEmpty()) {
            if (rawReferrer.contains("github.com")) referrer = "GitHub";
            else if (rawReferrer.contains("linkedin.com")) referrer = "LinkedIn";
            else if (rawReferrer.contains("twitter.com") || rawReferrer.contains("t.co") || rawReferrer.contains("x.com")) referrer = "Twitter / X";
            else referrer = "Other Web";
        }

        // Detect Device & Browser from User-Agent
        String userAgent = request.getHeader("User-Agent");
        String device = "Desktop";
        String browser = "Chrome";

        if (userAgent != null) {
            String ua = userAgent.toLowerCase();
            if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
                device = "Mobile";
            } else if (ua.contains("ipad") || ua.contains("tablet")) {
                device = "Tablet";
            }

            if (ua.contains("edg/")) browser = "Edge";
            else if (ua.contains("safari") && !ua.contains("chrome")) browser = "Safari";
            else if (ua.contains("firefox")) browser = "Firefox";
            else if (ua.contains("chrome")) browser = "Chrome";
        }

        // Log ClickEvent
        ClickEvent event = new ClickEvent(
                link.getId(),
                referrer,
                device,
                browser,
                "India",
                request.getRemoteAddr()
        );
        clickEventRepository.save(event);
    }

    public LinkAnalyticsDto getAnalytics(String linkId) {
        long totalClicks = clickEventRepository.countByLinkId(linkId);
        List<ClickEvent> events = clickEventRepository.findByLinkIdOrderByClickedAtDesc(linkId);

        LinkAnalyticsDto dto = new LinkAnalyticsDto();
        dto.setLinkId(linkId);
        dto.setTotalClicks(totalClicks);
        dto.setUniqueVisitors(Math.max(1, (long) (totalClicks * 0.78)));

        // Telemetry breakdowns
        dto.setReferrers(calculateDistribution(events, ClickEvent::getReferrer));
        dto.setDevices(calculateDistribution(events, ClickEvent::getDevice));
        dto.setBrowsers(calculateDistribution(events, ClickEvent::getBrowser));
        dto.setCountries(calculateDistribution(events, ClickEvent::getCountry));

        // Timeseries (now using effectively final variables!)
        List<LinkAnalyticsDto.TimeseriesDataPoint> timeseries = new ArrayList<>();
        Instant now = Instant.now();
        for (int i = 6; i >= 0; i--) {
            final int hourOffset = i;
            final Instant start = now.minus(hourOffset + 1, ChronoUnit.HOURS);
            final Instant end = now.minus(hourOffset, ChronoUnit.HOURS);
            String timeBucket = "Hour -" + hourOffset;
            
            long clicks = events.stream()
                    .filter(e -> isWithinBucket(e.getClickedAt(), start, end))
                    .count();
            timeseries.add(new LinkAnalyticsDto.TimeseriesDataPoint(timeBucket, clicks, Math.max(0, (long)(clicks * 0.8))));
        }
        dto.setClicksOverTime(timeseries);

        return dto;
    }

    private boolean isWithinBucket(String timestamp, Instant start, Instant end) {
        try {
            Instant t = Instant.parse(timestamp);
            return (t.isAfter(start) || t.equals(start)) && t.isBefore(end);
        } catch (Exception e) {
            return false;
        }
    }

    private List<LinkAnalyticsDto.ClickMetricItem> calculateDistribution(List<ClickEvent> events, java.util.function.Function<ClickEvent, String> extractor) {
        if (events.isEmpty()) return Collections.emptyList();

        Map<String, Long> frequency = new HashMap<>();
        for (ClickEvent event : events) {
            String key = extractor.apply(event);
            if (key == null || key.isEmpty()) key = "Direct";
            frequency.put(key, frequency.getOrDefault(key, 0L) + 1);
        }

        long total = events.size();
        List<LinkAnalyticsDto.ClickMetricItem> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : frequency.entrySet()) {
            double pct = Math.round(((double) entry.getValue() / total) * 100.0);
            result.add(new LinkAnalyticsDto.ClickMetricItem(entry.getKey(), entry.getValue(), pct));
        }
        result.sort((a, b) -> Long.compare(b.getClicks(), a.getClicks()));
        return result;
    }
}