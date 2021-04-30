package com.dixitdream.backend.user.validator;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.repository.UserRepository;
import com.dixitdream.backend.user.NewUserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Service
@RequiredArgsConstructor
public class UserUniqueValidator implements ConstraintValidator<ShouldBeUnique, NewUserDto> {

    private final UserRepository userRepository;

    @Override
    public void initialize(ShouldBeUnique constraintAnnotation) {

    }

    @Override
    public boolean isValid(NewUserDto newUserDto, ConstraintValidatorContext constraintValidatorContext) {
        UserProfile user = userRepository.findByEmailOrUsername(newUserDto.getEmail(), newUserDto.getUsername());
        return user == null;
    }
}