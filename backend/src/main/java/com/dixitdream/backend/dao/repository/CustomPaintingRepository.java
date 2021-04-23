package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.projection.PaintingProjectionDto;

import java.util.Collection;
import java.util.List;

public interface CustomPaintingRepository {
    List<PaintingProjectionDto> findPaintings(String query, Collection<String> tags, Long challengeId, Long profileId, Long lastPaintingId, int limit, Profile currentProfile);
}