package com.dixitdream.backend.dao.projection;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoDto {
    private final Long id;
    private final String username;
    private final int followers;
    private final int following;
    private final int paintings;
}
