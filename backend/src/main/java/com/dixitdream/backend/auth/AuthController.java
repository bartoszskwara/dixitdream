package com.dixitdream.backend.auth;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.infrastructure.exception.ForbiddenException;
import com.dixitdream.backend.infrastructure.security.AuthUserDetails;
import com.dixitdream.backend.infrastructure.security.JwtTokenUtil;
import com.dixitdream.backend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Valid LoginRequestDto request) {
        try {
            UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
            Authentication authenticate = authenticationManager.authenticate(authRequest);

            AuthUserDetails user = (AuthUserDetails) authenticate.getPrincipal();

            return ResponseEntity.ok()
                    .body(LoginResponseDto.builder()
                            .userId(user.getUser().getId())
                            .accessToken(jwtTokenUtil.generateAccessToken(user.getUsername(), user.getUser().getId()))
                            .refreshToken(jwtTokenUtil.generateRefreshToken(user.getUsername(), user.getUser().getId()))
                            .build());
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDto> refreshToken(@RequestBody @Valid RefreshRequestDto request) {
        if(!jwtTokenUtil.validateRefreshToken(request.getRefreshToken())) {
            throw new ForbiddenException("Invalid refresh token!");
        }
        UserProfile user = userService.getUser(jwtTokenUtil.getUserId(request.getRefreshToken()));
        return ResponseEntity.ok()
                .body(LoginResponseDto.builder()
                        .userId(user.getId())
                        .accessToken(jwtTokenUtil.generateAccessToken(user.getEmail(), user.getId()))
                        .build());
    }
}
