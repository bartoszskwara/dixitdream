package com.dixitdream.backend.user;

import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.infrastructure.security.AuthUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CurrentUserService {

    public UserProfile getCurrentUser() {
        return ((AuthUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser();
    }

}
