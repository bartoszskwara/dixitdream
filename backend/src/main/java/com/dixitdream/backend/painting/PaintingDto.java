package com.dixitdream.backend.painting;

import com.dixitdream.backend.profile.ProfileDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaintingDto {
    private final Long id;
    private final String url;
    private final String title;
    private final String description;
    private final ProfileDto profile;
    private final Integer likes;
    private final boolean liked;
    private final Integer visits;
    private final Set<String> tags;
    private final boolean removable;
}
