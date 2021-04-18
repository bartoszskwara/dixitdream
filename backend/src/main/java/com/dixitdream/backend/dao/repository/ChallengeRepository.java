package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Challenge;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ChallengeRepository extends CrudRepository<Challenge, Long> {

    Optional<Challenge> findTopByActiveTrue();
}