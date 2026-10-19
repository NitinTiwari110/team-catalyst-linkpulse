package com.catalyst.linkpulse.repository;

import com.catalyst.linkpulse.model.ClickEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
    long countByLinkId(String linkId);
    List<ClickEvent> findByLinkIdOrderByClickedAtDesc(String linkId);
}