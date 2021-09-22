package com.dixitdream.backend.notification;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDto {
    private final Long id;
    private final Long contextId;
    private final String type;
    private final String content;
    private final String avatarUrl;
    private final Long datetime;
    private final boolean isNew;
}
