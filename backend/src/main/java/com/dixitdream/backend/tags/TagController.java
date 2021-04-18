package com.dixitdream.backend.tags;

import com.dixitdream.backend.dao.projection.TagCountDto;
import com.dixitdream.backend.dto.ListContentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/tag")
public class TagController {

    private final TagService tagService;

    @GetMapping(value = "")
    public ResponseEntity<ListContentDto> getTags(@RequestParam(value = "query", defaultValue = "") String query,
                                                  @RequestParam(value = "limit", defaultValue = "10") int limit,
                                                  @RequestParam(value = "lastCount", required = false) Long lastCount,
                                                  @RequestParam(value = "lastName", required = false) String lastName) {
        List<TagCountDto> tags = tagService.getTags(query, limit, lastCount, lastName);
        List<TagDto> dtos = tags.stream()
                .map(t -> TagDto.builder()
                        //.id(t.getId())
                        .name(t.getTagName())
                        .count(t.getTagsCount())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ListContentDto<>(dtos));
    }

}
