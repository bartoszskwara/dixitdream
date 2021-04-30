package com.dixitdream.backend.painting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaintingFilterDto {
    private String query;
    private Integer limit;
    private Long lastPaintingId;
    private Set<String> tags;
    private Long challengeId;
    private Long userId;
}
