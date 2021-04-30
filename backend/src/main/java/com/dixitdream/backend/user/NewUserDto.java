package com.dixitdream.backend.user;

import com.dixitdream.backend.user.validator.ShouldBeUnique;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@ShouldBeUnique
public class NewUserDto {
    @NotBlank(message = "Username cannot be blank.")
    private String username;
    @NotBlank(message = "First name cannot be blank.")
    private String firstName;
    @NotBlank(message = "Last name cannot be blank.")
    private String lastName;
    @NotBlank(message = "Email cannot be blank.")
    private String email;
    @Length(min = 8, message = "Password should be at least 8 characters long.")
    @NotBlank(message = "Password cannot be blank.")
    private String password;
}
