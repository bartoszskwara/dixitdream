package com.dixitdream.backend.challenge;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.time.ZoneOffset;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/challenge")
public class ChallengeController {

    private final ChallengeService challengeService;

    @GetMapping("")
    public ResponseEntity<ChallengeDto> getCurrentChallenge() {
        Challenge challenge = challengeService.getCurrentChallenge();
        ChallengeDto dto = ChallengeDto.builder()
                .id(challenge.getId())
                .name(challenge.getName())
                .endDate(challenge.getEndDate().toEpochSecond(ZoneOffset.UTC))
                .tags(challenge.getTags().stream().map(Tag::getName).collect(Collectors.toSet()))
                .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("")
    public ResponseEntity<ChallengeDto> createChallenge(@Valid @RequestBody NewChallengeDto newChallengeDto) {
        Challenge challenge = challengeService.createChallenge(newChallengeDto);
        ChallengeDto dto = ChallengeDto.builder()
                .id(challenge.getId())
                .build();
        return ResponseEntity.ok(dto);
    }
}
