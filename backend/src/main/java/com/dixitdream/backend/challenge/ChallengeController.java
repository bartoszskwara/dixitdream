package com.dixitdream.backend.challenge;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dto.ListContentDto;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/challenge")
public class ChallengeController {

    private final ChallengeService challengeService;

    @GetMapping(value = "")
    public ResponseEntity<ListContentDto<ChallengeDto>> getChallenges(@RequestParam(defaultValue = "") String query,
                                                                      @RequestParam(defaultValue = "10") int limit,
                                                                      @RequestParam(required = false) Long lastChallengeId,
                                                                      @RequestParam(required = false) Set<String> tags) {
        Collection<String> searchTags = CollectionUtils.emptyIfNull(tags);
        List<ChallengeWithTagsDto> challenges = challengeService.getChallenges(query, limit, lastChallengeId, searchTags);
        List<ChallengeDto> dtos = challenges.stream()
                .map(c -> ChallengeDto.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .tags(c.getTags())
                        .active(c.isActive())
                        .endDate(c.getEndDate().atZone(ZoneId.systemDefault()).toEpochSecond())
                        .numberOfPaintings(c.getNumberOfPaintings())
                        .numberOfUsers(c.getNumberOfUsers())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ListContentDto<>(dtos));
    }

    @GetMapping("/current")
    public ResponseEntity<ChallengeDto> getCurrentChallenge() {
        Challenge challenge = challengeService.getCurrentChallenge();
        ChallengeDto dto = ChallengeDto.builder()
                .id(challenge.getId())
                .name(challenge.getName())
                .endDate(challenge.getEndDate().atZone(ZoneId.systemDefault()).toEpochSecond())
                .tags(challenge.getTags().stream().map(Tag::getName).collect(Collectors.toSet()))
                .build();
        return ResponseEntity.ok(dto);
    }
}
