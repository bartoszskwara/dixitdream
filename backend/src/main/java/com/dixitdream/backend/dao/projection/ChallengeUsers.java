package com.dixitdream.backend.dao.projection;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChallengeUsers {
    private final Long challengeId;
    private final Long numberOfUsers;
}
