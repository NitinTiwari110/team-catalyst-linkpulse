package com.catalyst.linkpulse.controller;

import com.catalyst.linkpulse.dto.ApiResponse;
import com.catalyst.linkpulse.dto.CreateLinkRequest;
import com.catalyst.linkpulse.dto.LinkAnalyticsDto;
import com.catalyst.linkpulse.dto.LinkDto;
import com.catalyst.linkpulse.service.AnalyticsService;
import com.catalyst.linkpulse.service.LinkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/links")
@CrossOrigin(origins = {"http://localhost:3000", "https://team-catalyst-linkpulse.vercel.app"})
public class LinkController {

    private final LinkService linkService;
    private final AnalyticsService analyticsService;

    public LinkController(LinkService linkService, AnalyticsService analyticsService) {
        this.linkService = linkService;
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LinkDto>>> getAllLinks() {
        List<LinkDto> links = linkService.getAllLinks();
        return ResponseEntity.ok(ApiResponse.success(links, "Links retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LinkDto>> getLinkById(@PathVariable String id) {
        return linkService.getLinkById(id)
                .map(link -> ResponseEntity.ok(ApiResponse.success(link, "Link found")))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("Link not found")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LinkDto>> createLink(@RequestBody CreateLinkRequest request) {
        try {
            LinkDto created = linkService.createLink(request);
            return ResponseEntity.ok(ApiResponse.success(created, "Short link created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to generate short link"));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LinkDto>> toggleStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> body
    ) {
        Boolean isActive = body.get("isActive");
        if (isActive == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("'isActive' field is required"));
        }

        return linkService.toggleStatus(id, isActive)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated, "Status updated successfully")))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("Link not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLink(@PathVariable String id) {
        if (linkService.deleteLink(id)) {
            return ResponseEntity.ok(ApiResponse.success(null, "Link deleted successfully"));
        }
        return ResponseEntity.status(404).body(ApiResponse.error("Link not found"));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<ApiResponse<LinkAnalyticsDto>> getAnalytics(@PathVariable String id) {
        if (linkService.getLinkById(id).isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("Link not found"));
        }
        LinkAnalyticsDto analytics = analyticsService.getAnalytics(id);
        return ResponseEntity.ok(ApiResponse.success(analytics, "Analytics retrieved successfully"));
    }
}