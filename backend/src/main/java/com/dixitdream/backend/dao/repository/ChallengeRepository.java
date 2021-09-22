package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.projection.ChallengeUsers;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ChallengeRepository extends CrudRepository<Challenge, Long>, CustomChallengeRepository {

    Optional<Challenge> findTopByActiveTrue();

    @Query("select new com.dixitdream.backend.dao.projection.ChallengeUsers(c.id, count(distinct p.user.id)) " +
            "from Challenge c " +
            "left join c.paintings p " +
            "group by c.id ")
    List<ChallengeUsers> findNumberOfUsersInChallenges(Set<Long> challengeIds);
}