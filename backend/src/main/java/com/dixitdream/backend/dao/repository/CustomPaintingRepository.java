package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.projection.PaintingProjectionDto;

import java.util.Collection;
import java.util.List;

public interface CustomPaintingRepository {
    List<PaintingProjectionDto> findPaintings(String query, Collection<String> tags, Long challengeId, Long userId, Long lastPaintingId, int limit, UserProfile currentUser);
}