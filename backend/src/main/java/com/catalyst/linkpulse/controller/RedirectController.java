package com.catalyst.linkpulse.controller;

import com.catalyst.linkpulse.model.Link;
import com.catalyst.linkpulse.service.AnalyticsService;
import com.catalyst.linkpulse.service.LinkService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;

@Controller
public class RedirectController {

    private final LinkService linkService;
    private final AnalyticsService analyticsService;

    public RedirectController(LinkService linkService, AnalyticsService analyticsService) {
        this.linkService = linkService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/{shortCode:[a-zA-Z0-9-_]+}")
    public void redirect(
            @PathVariable String shortCode,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        // Avoid capturing standard static endpoints
        if ("favicon.ico".equals(shortCode) || "error".equals(shortCode)) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        Optional<Link> linkOpt = linkService.getRawLinkByShortCode(shortCode);

        if (linkOpt.isEmpty()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Short link not found or has been removed.");
            return;
        }

        Link link = linkOpt.get();

        // 1. Safety Killswitch Check
        if (!link.isActive()) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "This link has been disabled by the owner.");
            return;
        }

        // 2. Expiration Date Check
        if (link.getExpiresAt() != null && !link.getExpiresAt().isEmpty()) {
            try {
                Instant expiry = Instant.parse(link.getExpiresAt());
                if (Instant.now().isAfter(expiry)) {
                    response.sendError(HttpServletResponse.SC_GONE, "This link has expired.");
                    return;
                }
            } catch (Exception ignored) {}
        }

        // 3. Click Limit Check
        if (link.getClickLimit() != null && link.getClickLimit() > 0) {
            if (link.getClickCount() >= link.getClickLimit()) {
                response.sendError(HttpServletResponse.SC_GONE, "This link has reached its maximum click limit.");
                return;
            }
        }

        // 4. Record Real-time Click Telemetry
        analyticsService.recordClick(link, request);

        // 5. High-speed Redirect
        response.sendRedirect(link.getOriginalUrl());
    }
}