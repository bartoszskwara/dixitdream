package com.dixitdream.backend.infrastructure.security;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserAuthenticationService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserProfile user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found!"));
        return new AuthUserDetails(user);
    }
}
