package com.dixitdream.backend.challenge;

import static java.util.Arrays.asList;

public enum ChallengeName {
    DreamlandChallenge("Dreamland Challenge");

    private final String name;

    ChallengeName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
