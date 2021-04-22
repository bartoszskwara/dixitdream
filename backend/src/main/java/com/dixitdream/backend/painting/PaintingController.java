package com.dixitdream.backend.painting;

import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dto.ListContentDto;
import com.dixitdream.backend.profile.ProfileDto;
import com.dixitdream.backend.profile.ProfileService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RequiredArgsConstructor
@RestController
@RequestMapping("/painting")
public class PaintingController {

    @Value("${settings.uploadInfo.maxSize.size:5}")
    private Integer maxFileSizeMB;

    private final PaintingService paintingService;
    private final ProfileService profileService;

    @GetMapping(value = "/{paintingId}")
    public ResponseEntity<PaintingDto> getPainting(@PathVariable Long paintingId) {
        Painting painting = paintingService.getPainting(paintingId);
        Profile currentProfile = profileService.getCurrentProfile();
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
                .removable(currentProfile.getId().equals(painting.getProfile().getId()))
                .likes(painting.getLikes().size())
                .liked(painting.getLikes().contains(currentProfile))
                .visits(painting.getVisits().size())
                .build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping(value = "")
    public ResponseEntity<ListContentDto> getPaintings(@NotNull @RequestBody PaintingFilterDto dto) {
        String query = isNotEmpty(dto.getQuery()) ? dto.getQuery() : "";
        int limit = dto.getLimit() != null ? dto.getLimit() : 10;
        Collection<String> tags = CollectionUtils.emptyIfNull(dto.getTags());
        Profile currentProfile = profileService.getCurrentProfile();
        List<Painting> paintings = paintingService.getPaintings(query, limit, dto.getLastPaintingId(), tags, dto.getChallengeId(), dto.getProfileId());
        List<PaintingDto> dtos = paintings.stream()
                .map(p -> PaintingDto.builder()
                        .id(p.getId())
                        .url(paintingService.getFileUrl(p.getFilePath()))
                        .profile(ProfileDto.builder()
                                .id(p.getProfile().getId())
                                .build())
                        .likes(p.getLikes().size())
                        .liked(p.getLikes().contains(currentProfile))
                        .visits(p.getVisits().size())
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

    @PutMapping("/{paintingId}/like")
    public ResponseEntity<Void> toggleLikePainting(@PathVariable Long paintingId) {
        paintingService.toggleLikePainting(paintingId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{paintingId}/visit")
    public ResponseEntity<Map> visitPainting(@PathVariable Long paintingId) {
        boolean newVisit = paintingService.visitPainting(paintingId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("newVisit", newVisit);
        return ResponseEntity.ok(response);
    }

    private void validatePainting(NewPaintingDto dto) {
        if(dto.getFile().getSize() > maxFileSizeMB * 1024 * 1024) {
            throw new IllegalArgumentException("File size is too big.");
        }
    }
}
