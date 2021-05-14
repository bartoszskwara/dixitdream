package com.dixitdream.backend.user;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.projection.UserInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/current")
    public ResponseEntity<UserDto> getCurrentUser() {
        UserInfoDto user = userService.getCurrentUserInfo();
        UserDto dto = UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .followers(user.getFollowers())
                .paintings(user.getPaintings())
                .build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long userId) {
        UserProfile user = userService.getUser(userId);
        UserDto dto = UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .followers(user.getFollowers().size())
                .paintings(user.getPaintings().size())
                .description(user.getDescription())
                .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody NewUserDto userDto) {
        UserProfile user = userService.createUser(userDto);
        UserDto dto = UserDto.builder()
                .id(user.getId())
                .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/exists")
    public ResponseEntity<UserExistsDto> checkIfUserExists(@RequestBody NewUserDto userDto) {
        Boolean existsByUsername = userService.checkIfUserExistsByUsername(userDto.getUsername());
        Boolean existsByEmail = userService.checkIfUserExistsByEmail(userDto.getEmail());
        UserExistsDto dto = UserExistsDto.builder()
                .username(existsByUsername)
                .email(existsByEmail)
                .build();
        return ResponseEntity.ok(dto);
    }
}
