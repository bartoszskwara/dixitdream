package com.dixitdream.backend.user;

import com.dixitdream.backend.user.validator.ShouldBeUnique;
import com.dixitdream.backend.user.validator.ValidPassword;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@ShouldBeUnique
public class NewUserDto {
    @Length(min = 3, message = "Username should be at least 3 characters long.")
    @NotBlank(message = "Username cannot be blank.")
    private String username;
    @Email(message = "Email is incorrect.")
    @NotBlank(message = "Email cannot be blank.")
    private String email;
    @ValidPassword
    private String password;
}
