package com.dixitdream.backend.dao.projection;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaintingProjectionDto {
    private final Long id;
    private final String filePath;
    private final Long profileId;
    private final Integer visits;
    private final Integer likes;
    private final boolean likedByCurrentProfile;
}
