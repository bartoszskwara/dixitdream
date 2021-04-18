package com.dixitdream.backend.tags;

import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dao.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;

import static java.util.stream.Collectors.toSet;

@RequiredArgsConstructor
@Service
public class TagMapper {

    private final TagRepository tagRepository;

    public Set<Tag> mapTags(Set<String> tagNames) {
        Set<Tag> tags = tagRepository.findAllByNames(tagNames.stream().map(String::trim).collect(toSet()));
        if(tags.size() < tagNames.size()) {
            Set<String> names = tags.stream().map(Tag::getName).collect(toSet());
            Collection<String> tagsToCreate = CollectionUtils.disjunction(tagNames, names);
            tags.addAll(tagsToCreate.stream().map(this::mapToTag).collect(toSet()));
        }
        return tags;
    }

    private Tag mapToTag(String name) {
        Tag tag = new Tag();
        tag.setName(name);
        return tag;
    }
}
