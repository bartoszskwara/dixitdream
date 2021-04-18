package com.dixitdream.backend.settings;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class SettingsService {

    @Value("${settings.uploadInfo.maxSize.size}")
    private Integer uploadInfoMaxSize;

    @Value("${settings.uploadInfo.ratio}")
    private String uploadInfoRatio;

    @Value("${settings.uploadInfo.extensions}")
    private Set<String> extensions;

    public Integer getUploadInfoMaxSize() {
        return uploadInfoMaxSize;
    }

    public String getUploadInfoMaxSizeUnit() {
        return "MB";
    }

    public String getUploadInfoRatio() {
        return uploadInfoRatio;
    }

    public Set<String> getExtensions() {
        return extensions;
    }
}
