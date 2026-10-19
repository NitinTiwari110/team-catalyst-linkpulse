package com.catalyst.linkpulse.repository;

import com.catalyst.linkpulse.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LinkRepository extends JpaRepository<Link, String> {
    Optional<Link> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
    List<Link> findByCampaignId(String campaignId);
    List<Link> findAllByOrderByCreatedAtDesc();
}