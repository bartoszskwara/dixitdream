package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Challenge;

import java.util.Collection;
import java.util.List;

public interface CustomChallengeRepository {
    List<Challenge> findChallenges(String query, Collection<String> tags, Long lastPaintingId, int limit);
}