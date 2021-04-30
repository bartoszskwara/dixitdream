package com.dixitdream.backend.user;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.projection.UserInfoDto;
import com.dixitdream.backend.dao.repository.UserRepository;
import com.dixitdream.backend.infrastructure.exception.BadRequestException;
import com.dixitdream.backend.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder bCryptPasswordEncoder;
    private final CurrentUserService currentUserService;

    public UserProfile getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    public UserInfoDto getCurrentUserInfo() {
        Long currentUserId = currentUserService.getCurrentUser().getId();
        return userRepository.findUserById(currentUserId).orElseThrow(() -> new ResourceNotFoundException("No current user."));
    }

    public UserProfile getCurrentUser() {
        Long currentUserId = currentUserService.getCurrentUser().getId();
        return userRepository.findById(currentUserId).orElseThrow(() -> new ResourceNotFoundException("No user."));
    }

    public UserProfile createUser(NewUserDto userDto) {
        validateUser(userDto);
        UserProfile user = mapUser(userDto);
        return userRepository.save(user);
    }

    private UserProfile mapUser(NewUserDto userDto) {
        UserProfile user = new UserProfile();
        user.setUsername(userDto.getUsername());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        return user;
    }

    private void validateUser(NewUserDto userDto) {
        if(isEmailInvalid(userDto.getEmail())) {
            throw new BadRequestException("Email is incorrect.");
        }
    }

    private boolean isEmailInvalid(String email) {
        return false;
    }
}
