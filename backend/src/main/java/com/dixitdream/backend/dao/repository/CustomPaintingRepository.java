package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Painting;

import java.util.Collection;
import java.util.List;

public interface CustomPaintingRepository {
    List<Painting> findPaintings(String query, Collection<String> tags, Long challengeId, Long profileId, Long lastPaintingId, int limit);
}