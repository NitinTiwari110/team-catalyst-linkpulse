package com.catalyst.linkpulse.service;

import com.catalyst.linkpulse.dto.CreateLinkRequest;
import com.catalyst.linkpulse.dto.LinkDto;
import com.catalyst.linkpulse.model.Campaign;
import com.catalyst.linkpulse.model.Link;
import com.catalyst.linkpulse.repository.CampaignRepository;
import com.catalyst.linkpulse.repository.LinkRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LinkService {

    private final LinkRepository linkRepository;
    private final CampaignRepository campaignRepository;
    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public LinkService(LinkRepository linkRepository, CampaignRepository campaignRepository) {
        this.linkRepository = linkRepository;
        this.campaignRepository = campaignRepository;
    }

    public List<LinkDto> getAllLinks() {
        return linkRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<LinkDto> getLinkById(String id) {
        return linkRepository.findById(id).map(this::toDto);
    }

    public Optional<Link> getRawLinkByShortCode(String shortCode) {
        return linkRepository.findByShortCode(shortCode);
    }

    @Transactional
    public LinkDto createLink(CreateLinkRequest request) {
        String cleanUrl = request.getOriginalUrl() != null ? request.getOriginalUrl().trim() : "";
        if (cleanUrl.isEmpty()) {
            throw new IllegalArgumentException("Original URL is required");
        }
        if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
            cleanUrl = "https://" + cleanUrl;
        }

        String shortCode;
        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            shortCode = request.getCustomAlias().trim().toLowerCase().replaceAll("[^a-z0-9-_]", "");
            if (linkRepository.existsByShortCode(shortCode)) {
                throw new IllegalArgumentException("Custom alias '" + shortCode + "' is already in use.");
            }
        } else {
            shortCode = generateUniqueShortCode();
        }

        String title = request.getTitle();
        if (title == null || title.trim().isEmpty()) {
            try {
                title = new URI(cleanUrl).getHost();
            } catch (Exception e) {
                title = "Short Link";
            }
        }

        Link link = new Link();
        link.setOriginalUrl(cleanUrl);
        link.setShortCode(shortCode);
        link.setCustomAlias(request.getCustomAlias());
        link.setTitle(title);
        link.setExpiresAt(request.getExpiresAt());
        link.setClickLimit(request.getClickLimit());
        link.setPassword(request.getPassword());
        link.setCampaignId(request.getCampaignId());

        if (request.getTags() != null && !request.getTags().isEmpty()) {
            link.setTags(String.join(",", request.getTags()));
        } else {
            link.setTags("Direct");
        }

        Link saved = linkRepository.save(link);
        return toDto(saved);
    }

    @Transactional
    public Optional<LinkDto> toggleStatus(String id, boolean isActive) {
        return linkRepository.findById(id).map(link -> {
            link.setActive(isActive);
            link.setUpdatedAt(Instant.now().toString());
            return toDto(linkRepository.save(link));
        });
    }

    @Transactional
    public boolean deleteLink(String id) {
        if (linkRepository.existsById(id)) {
            linkRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private String generateUniqueShortCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
            }
            code = sb.toString();
        } while (linkRepository.existsByShortCode(code));
        return code;
    }

    public LinkDto toDto(Link link) {
        LinkDto dto = new LinkDto();
        dto.setId(link.getId());
        dto.setOriginalUrl(link.getOriginalUrl());
        dto.setShortCode(link.getShortCode());
        dto.setShortUrl(baseUrl + "/" + link.getShortCode());
        dto.setTitle(link.getTitle());
        dto.setCustomAlias(link.getCustomAlias());
        dto.setCreatedAt(link.getCreatedAt());
        dto.setUpdatedAt(link.getUpdatedAt());
        dto.setExpiresAt(link.getExpiresAt());
        dto.setClickLimit(link.getClickLimit());
        dto.setClickCount(link.getClickCount());
        dto.setActive(link.isActive());
        dto.setPasswordProtected(link.getPassword() != null && !link.getPassword().trim().isEmpty());
        dto.setCampaignId(link.getCampaignId());

        if (link.getTags() != null && !link.getTags().trim().isEmpty()) {
            dto.setTags(Arrays.stream(link.getTags().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList()));
        } else {
            dto.setTags(Collections.emptyList());
        }

        if (link.getCampaignId() != null) {
            campaignRepository.findById(link.getCampaignId())
                    .ifPresent(camp -> dto.setCampaignName(camp.getName()));
        }

        return dto;
    }
}