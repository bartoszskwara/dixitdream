package com.dixitdream.backend.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/settings")
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping("")
    public ResponseEntity<SettingsDto> getSettings() {
        SettingsDto dto = SettingsDto.builder()
                .uploadInfo(SettingsDto.UploadInfo.builder()
                        .ratio(settingsService.getUploadInfoRatio())
                        .maxSize(SettingsDto.MaxSize.builder()
                                .size(settingsService.getUploadInfoMaxSize())
                                .unit(settingsService.getUploadInfoMaxSizeUnit())
                                .build())
                        .extensions(settingsService.getExtensions())
                        .build())
                .build();
        return ResponseEntity.ok(dto);
    }
}
