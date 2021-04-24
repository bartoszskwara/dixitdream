package com.dixitdream.backend.profile;

import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.projection.ProfileInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/current")
    public ResponseEntity<ProfileDto> getCurrentProfile() {
        ProfileInfoDto profile = profileService.getCurrentProfileInfo();
        ProfileDto dto = ProfileDto.builder()
                .id(profile.getId())
                .username(profile.getUsername())
                .followers(profile.getFollowers())
                .paintings(profile.getPaintings())
                .build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long profileId) {
        Profile profile = profileService.getProfile(profileId);
        ProfileDto dto = ProfileDto.builder()
                .id(profile.getId())
                .username(profile.getUsername())
                .followers(profile.getFollowers().size())
                .paintings(profile.getPaintings().size())
                .description(profile.getDescription())
                .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("")
    public ResponseEntity<ProfileDto> createProfile(@Valid @RequestBody NewProfileDto profileDto) {
        Profile profile = profileService.createProfile(profileDto);
        ProfileDto dto = ProfileDto.builder()
                .id(profile.getId())
                .build();
        return ResponseEntity.ok(dto);
    }
}
