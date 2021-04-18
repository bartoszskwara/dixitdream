package com.dixitdream.backend.painting;

import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dto.ListContentDto;
import com.dixitdream.backend.profile.ProfileDto;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RequiredArgsConstructor
@RestController
@RequestMapping("/painting")
public class PaintingController {

    @Value("${settings.uploadInfo.maxSize.size:5}")
    private Integer maxFileSizeMB;

    private final PaintingService paintingService;

    @GetMapping(value = "/{paintingId}")
    public ResponseEntity<PaintingDto> getPainting(@PathVariable Long paintingId) {
        Painting painting = paintingService.getPainting(paintingId);
        ProfileDto profileDto = ProfileDto.builder()
                .id(painting.getProfile().getId())
                .username(painting.getProfile().getUsername())
                .build();
        PaintingDto dto = PaintingDto.builder()
                .id(painting.getId())
                .url(paintingService.getFileUrl(painting.getFilePath()))
                .title(painting.getTitle())
                .description(painting.getDescription())
                .profile(profileDto)
                .tags(painting.getTags().stream().map(Tag::getName).collect(Collectors.toSet()))
                .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping(value = "")
    public ResponseEntity<ListContentDto> getPaintings(@NotNull @RequestBody PaintingFilterDto dto) {
        String query = isNotEmpty(dto.getQuery()) ? dto.getQuery() : "";
        int limit = dto.getLimit() != null ? dto.getLimit() : 10;
        Collection<String> tags = CollectionUtils.emptyIfNull(dto.getTags());

        List<Painting> paintings = paintingService.getPaintings(query, limit, dto.getLastPaintingId(), tags, dto.getChallengeId(), dto.getProfileId());
        List<PaintingDto> dtos = paintings.stream()
                .map(p -> PaintingDto.builder()
                        .id(p.getId())
                        .url(paintingService.getFileUrl(p.getFilePath()))
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ListContentDto<>(dtos));
    }

    @PostMapping(value = "/upload")
    public ResponseEntity<PaintingDto> uploadPainting(@Valid @ModelAttribute NewPaintingDto dto) {
        validatePainting(dto);
        String paintingUrl = paintingService.uploadPainting(dto.getTitle(), dto.getDescription(), dto.getTags(), dto.getChallengeId(), dto.getFile());
        return ResponseEntity.ok(PaintingDto.builder().url(paintingUrl).build());
    }

    @DeleteMapping("/{paintingId}")
    public ResponseEntity<PaintingDto> deletePainting(@PathVariable Long paintingId) {
        paintingService.deletePainting(paintingId);
        return ResponseEntity.noContent().build();
    }

    private void validatePainting(NewPaintingDto dto) {
        if(dto.getFile().getSize() > maxFileSizeMB * 1024 * 1024) {
            throw new IllegalArgumentException("File size is too big.");
        }
    }
}
