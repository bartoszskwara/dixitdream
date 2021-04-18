package com.dixitdream.backend.profile.validator;

import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.repository.ProfileRepository;
import com.dixitdream.backend.profile.NewProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Service
@RequiredArgsConstructor
public class ProfileUniqueValidator implements ConstraintValidator<ShouldBeUnique, NewProfileDto> {

    private final ProfileRepository profileRepository;

    @Override
    public void initialize(ShouldBeUnique constraintAnnotation) {

    }

    @Override
    public boolean isValid(NewProfileDto newProfileDto, ConstraintValidatorContext constraintValidatorContext) {
        Profile profile = profileRepository.findByEmailOrUsername(newProfileDto.getEmail(), newProfileDto.getUsername());
        return profile == null;
    }
}