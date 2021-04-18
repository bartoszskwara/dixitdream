package com.dixitdream.backend.profile;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileDto {
    private final Long id;
    private final String username;
    private final Integer followers;
    private final Integer paintings;
    private final String description;
}
