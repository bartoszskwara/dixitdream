package com.dixitdream.backend.settings;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SettingsDto {

    private final UploadInfo uploadInfo;

    @Getter
    @Builder
    public static class UploadInfo {
        private final MaxSize maxSize;
        private final String ratio;
        private final Set<String> extensions;
    }

    @Getter
    @Builder
    public static class MaxSize {
        private final Integer size;
        private final String unit;
    }
}
