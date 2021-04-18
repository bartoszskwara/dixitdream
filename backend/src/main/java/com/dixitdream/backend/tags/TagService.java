package com.dixitdream.backend.tags;

import com.dixitdream.backend.dao.projection.TagCountDto;
import com.dixitdream.backend.dao.repository.TagRepository;
import com.dixitdream.backend.painting.AmazonS3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService extends AmazonS3Service {

    private final TagRepository tagRepository;

    public List<TagCountDto> getTags(String query, int limit, Long lastCount, String lastName) {
        if(lastCount == null || lastName == null) {
            return tagRepository.findByQuery(query, limit);
        }
        return tagRepository.findMoreByQuery(query, limit, lastCount, lastName);
    }
}
