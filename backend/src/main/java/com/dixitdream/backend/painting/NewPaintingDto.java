package com.dixitdream.backend.painting;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Set;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NewPaintingDto {
    @NotBlank(message = "Title cannot be blank.")
    private String title;
    @NotEmpty(message = "Tags cannot be empty.")
    private Set<String> tags;
    private String description;
    @NotNull
    private MultipartFile file;
    private Long challengeId;
}
