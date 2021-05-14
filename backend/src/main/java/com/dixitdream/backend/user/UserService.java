package com.dixitdream.backend.user;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.projection.UserInfoDto;
import com.dixitdream.backend.dao.repository.UserRepository;
import com.dixitdream.backend.infrastructure.exception.BadRequestException;
import com.dixitdream.backend.infrastructure.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.trim;

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
        UserProfile user = mapUser(userDto);
        return userRepository.save(user);
    }

    private UserProfile mapUser(NewUserDto userDto) {
        UserProfile user = new UserProfile();
        user.setUsername(trim(userDto.getUsername()));
        user.setEmail(trim(userDto.getEmail()));
        user.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        return user;
    }

    public Boolean checkIfUserExistsByEmail(String email) {
        return isNotEmpty(email) ? userRepository.existsByEmail(email) : null;
    }

    public Boolean checkIfUserExistsByUsername(String username) {
        return isNotEmpty(username) ? userRepository.existsByUsername(username) : null;
    }
}
