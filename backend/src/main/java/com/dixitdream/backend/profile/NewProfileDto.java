package com.dixitdream.backend.profile;

import com.dixitdream.backend.profile.validator.ShouldBeUnique;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@ShouldBeUnique
public class NewProfileDto {
    @NotBlank(message = "Username cannot be blank.")
    private String username;
    @NotBlank(message = "First name cannot be blank.")
    private String firstName;
    @NotBlank(message = "Last name cannot be blank.")
    private String lastName;
    @NotBlank(message = "Email cannot be blank.")
    private String email;
}
