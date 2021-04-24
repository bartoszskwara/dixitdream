package com.dixitdream.backend.profile;

import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.projection.ProfileInfoDto;
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

    public ProfileInfoDto getCurrentProfileInfo() {
        Long id = profileRepository.findAll().stream().findAny().orElseThrow(() -> new ResourceNotFoundException("No profile.")).getId();
        return profileRepository.findProfileById(id);
    }

    public Profile getCurrentProfile() {
        Long id = profileRepository.findAll().stream().findAny().orElseThrow(() -> new ResourceNotFoundException("No profile.")).getId();
        return profileRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No profile."));
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
