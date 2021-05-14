package com.dixitdream.backend.challenge;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dao.repository.ChallengeRepository;
import com.dixitdream.backend.infrastructure.exception.ResourceNotFoundException;
import com.dixitdream.backend.tags.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Set;

import static org.apache.commons.lang3.StringUtils.trim;

@RequiredArgsConstructor
@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final TagMapper tagMapper;

    public Challenge getCurrentChallenge() {
        return challengeRepository.findTopByActiveTrue()
                .orElseThrow(() -> new ResourceNotFoundException("There are no active challenges currently"));
    }

    public Challenge createChallenge(NewChallengeDto challengeDto) {
        Challenge challenge = mapChallenge(challengeDto);
        return challengeRepository.save(challenge);
    }

    private Challenge mapChallenge(NewChallengeDto challengeDto) {
        Set<Tag> tags = tagMapper.mapTags(challengeDto.getTags());
        Challenge challenge = new Challenge();
        challenge.setName(trim(challengeDto.getName()));
        challenge.setTags(tags);
        challenge.setStartDate(LocalDateTime.ofEpochSecond(challengeDto.getStartDate(), 0, ZoneOffset.UTC));
        challenge.setEndDate(LocalDateTime.ofEpochSecond(challengeDto.getEndDate(), 0, ZoneOffset.UTC));
        return challenge;
    }
}
