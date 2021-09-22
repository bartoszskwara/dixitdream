package com.dixitdream.backend.challenge;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Tag;
import com.dixitdream.backend.dao.repository.ChallengeRepository;
import com.dixitdream.backend.dao.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.dixitdream.backend.challenge.ChallengeName.DreamlandChallenge;
import static java.util.Collections.emptySet;
import static java.util.stream.Collectors.toMap;

@RequiredArgsConstructor
@Component
public class ChallengeCreator {

    private final ChallengeRepository challengeRepository;
    private final TagRepository tagRepository;

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void createChallengeIfNeeded() {
        Challenge challenge = challengeRepository.findTopByActiveTrue().orElse(null);
        if(challenge == null || shouldBeClosed(challenge)) {
            createNewActiveChallenge();
            if(challenge != null) {
                challenge.setActive(false);
                challengeRepository.save(challenge);
            }
        }
    }

    private boolean shouldBeClosed(Challenge challenge) {
        return !LocalDateTime.now().plusSeconds(5).isBefore(challenge.getEndDate());
    }

    private Challenge createNewActiveChallenge() {
        Challenge challenge = new Challenge();
        challenge.setName(DreamlandChallenge.getName());
        challenge.setTags(findRandomChallengeTags());
        challenge.setStartDate(LocalDateTime.now().atZone(ZoneId.systemDefault()).toLocalDateTime());
        challenge.setEndDate(LocalDateTime.now().atZone(ZoneId.systemDefault()).toLocalDateTime().plusDays(7));
        //challenge.setEndDate(LocalDateTime.now().atZone(ZoneId.systemDefault()).plusMinutes(5).toLocalDateTime());
        challenge.setActive(true);
        return challengeRepository.save(challenge);
    }

    private Set<Tag> findRandomChallengeTags() {
        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new ClassPathResource("static/nounlist.txt").getInputStream()))) {
            List<String> lines = bufferedReader.lines().collect(Collectors.toList());
            Set<String> words = new HashSet<>();
            int firstIndex = RandomUtils.nextInt(0, lines.size());
            words.add(lines.get(firstIndex));
            words.add(lines.get(findAnotherIndex(firstIndex, lines.size())));
            Set<Tag> tags = tagRepository.findAllByNames(words);
            return tags.size() == 2 ? tags : createMissingTags(words, tags);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return emptySet();
    }

    private int findAnotherIndex(int firstIndex, int maxSize) {
        int index;
        do {
            index = RandomUtils.nextInt(0, maxSize);
        } while(firstIndex == index);
        return index;
    }

    private Set<Tag> createMissingTags(Set<String> words, Set<Tag> tags) {
        Map<String, Tag> tagsMap = tags.stream().collect(toMap(Tag::getName, t -> t));
        return words.stream()
                .map(w -> tagsMap.containsKey(w) ? tagsMap.get(w) : createTag(w))
                .collect(Collectors.toSet());
    }

    private Tag createTag(String name) {
        Tag tag = new Tag();
        tag.setName(name);
        return tagRepository.save(tag);
    }

}
