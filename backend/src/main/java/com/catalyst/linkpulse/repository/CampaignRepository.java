package com.catalyst.linkpulse.repository;

import com.catalyst.linkpulse.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, String> {
    List<Campaign> findAllByOrderByCreatedAtDesc();
}