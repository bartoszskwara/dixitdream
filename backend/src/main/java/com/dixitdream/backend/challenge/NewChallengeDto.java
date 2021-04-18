package com.dixitdream.backend.challenge;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NewChallengeDto {
    @NotBlank(message = "Name cannot be blank.")
    private String name;
    @NotEmpty(message = "Tags cannot be empty.")
    private Set<String> tags;
    @NotNull(message = "Start date cannot be null.")
    private Long startDate;
    @NotNull(message = "End date cannot be null.")
    private Long endDate;
}
