package com.dixitdream.backend.challenge;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dao.repository.ChallengeRepository;
import com.dixitdream.backend.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;

@RequiredArgsConstructor
@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;

    public Challenge getCurrentChallenge() {
        return challengeRepository.findTopByActiveTrue()
                .orElseThrow(() -> new ResourceNotFoundException("There are no active challenges currently"));
    }

    public List<ChallengeWithTagsDto> getChallenges(String query, int limit, Long lastChallengeId, Collection<String> tags) {
        List<Challenge> challenges = challengeRepository.findChallenges(query, tags, lastChallengeId, limit);
        Map<Long, Long> numberOfUsersByChallengeId = challenges.stream()
                .collect(toMap(Challenge::getId, c -> c.getPaintings().stream().map(p -> p.getUser().getId()).distinct().count()));

        return challenges.stream()
                .map(c -> createChallengeWithTagsDto(c, numberOfUsersByChallengeId.get(c.getId())))
                .sorted(Comparator.comparing(ChallengeWithTagsDto::getId, Comparator.reverseOrder()))
                .collect(Collectors.toList());
    }

    private ChallengeWithTagsDto createChallengeWithTagsDto(Challenge challenge, Long numberOfUsers) {
        Set<String> tags = challenge.getTags().stream().map(Tag::getName).collect(Collectors.toSet());
        return new ChallengeWithTagsDto(challenge.getId(), challenge.getName(), challenge.isActive(), tags, challenge.getEndDate(), challenge.getPaintings().size(), numberOfUsers);
    }
}
