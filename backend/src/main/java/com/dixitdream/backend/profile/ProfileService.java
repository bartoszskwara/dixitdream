package com.dixitdream.backend.profile;

import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.repository.ProfileRepository;
import com.dixitdream.backend.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public Profile getProfile(Long id) {
        return profileRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profile not found."));
    }

    public Profile getCurrentProfile() {
        return profileRepository.findAll().stream().findAny().orElseThrow(() -> new IllegalArgumentException("No profile."));
    }

    public Profile createProfile(NewProfileDto profileDto) {
        Profile profile = mapProfile(profileDto);
        return profileRepository.save(profile);
    }

    private Profile mapProfile(NewProfileDto profileDto) {
        Profile profile = new Profile();
        profile.setUsername(profileDto.getUsername());
        profile.setFirstName(profileDto.getFirstName());
        profile.setLastName(profileDto.getLastName());
        profile.setEmail(profileDto.getEmail());
        return profile;
    }
}
