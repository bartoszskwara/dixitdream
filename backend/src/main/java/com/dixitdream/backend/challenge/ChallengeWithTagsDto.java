package com.dixitdream.backend.challenge;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@AllArgsConstructor
public class ChallengeWithTagsDto {
    private final Long id;
    private final String name;
    private final boolean active;
    private final Set<String> tags;
    private final LocalDateTime endDate;
    private final Integer numberOfPaintings;
    private final Long numberOfUsers;
}
