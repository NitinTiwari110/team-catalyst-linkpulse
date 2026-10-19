package com.catalyst.linkpulse.controller;

import com.catalyst.linkpulse.dto.ApiResponse;
import com.catalyst.linkpulse.dto.CampaignDto;
import com.catalyst.linkpulse.service.CampaignService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = {"http://localhost:3000", "https://team-catalyst-linkpulse.vercel.app"})
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampaignDto>>> getAllCampaigns() {
        List<CampaignDto> campaigns = campaignService.getAllCampaigns();
        return ResponseEntity.ok(ApiResponse.success(campaigns, "Campaigns retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampaignDto>> createCampaign(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String description = body.get("description");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Campaign name is required"));
        }

        CampaignDto created = campaignService.createCampaign(name, description);
        return ResponseEntity.ok(ApiResponse.success(created, "Campaign created successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(@PathVariable String id) {
        if (campaignService.deleteCampaign(id)) {
            return ResponseEntity.ok(ApiResponse.success(null, "Campaign deleted successfully"));
        }
        return ResponseEntity.status(404).body(ApiResponse.error("Campaign not found"));
    }
}