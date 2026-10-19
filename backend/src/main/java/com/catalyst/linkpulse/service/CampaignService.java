package com.catalyst.linkpulse.service;

import com.catalyst.linkpulse.dto.CampaignDto;
import com.catalyst.linkpulse.model.Campaign;
import com.catalyst.linkpulse.model.Link;
import com.catalyst.linkpulse.repository.CampaignRepository;
import com.catalyst.linkpulse.repository.LinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final LinkRepository linkRepository;

    public CampaignService(CampaignRepository campaignRepository, LinkRepository linkRepository) {
        this.campaignRepository = campaignRepository;
        this.linkRepository = linkRepository;
    }

    public List<CampaignDto> getAllCampaigns() {
        return campaignRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CampaignDto createCampaign(String name, String description) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Campaign name is required");
        }
        Campaign campaign = new Campaign(name.trim(), description != null ? description.trim() : "");
        Campaign saved = campaignRepository.save(campaign);
        return toDto(saved);
    }

    @Transactional
    public boolean deleteCampaign(String id) {
        if (campaignRepository.existsById(id)) {
            campaignRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private CampaignDto toDto(Campaign campaign) {
        List<Link> links = linkRepository.findByCampaignId(campaign.getId());
        int linkCount = links.size();
        long totalClicks = links.stream().mapToLong(Link::getClickCount).sum();

        return new CampaignDto(
                campaign.getId(),
                campaign.getName(),
                campaign.getDescription(),
                linkCount,
                totalClicks,
                campaign.getCreatedAt()
        );
    }
}