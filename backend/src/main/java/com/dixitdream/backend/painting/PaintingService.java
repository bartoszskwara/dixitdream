package com.dixitdream.backend.painting;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.repository.ChallengeRepository;
import com.dixitdream.backend.dao.repository.PaintingRepository;
import com.dixitdream.backend.infrastructure.exception.ResourceNotFoundException;
import com.dixitdream.backend.profile.ProfileService;
import com.dixitdream.backend.tags.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PaintingService extends AmazonS3Service {

    private final TagMapper tagMapper;
    private final ProfileService profileService;
    private final PaintingRepository paintingRepository;
    private final ChallengeRepository challengeRepository;

    public Painting getPainting(Long paintingId) {
        return paintingRepository.findById(paintingId).orElseThrow(() -> new ResourceNotFoundException("Painting not found"));
    }

    public List<Painting> getPaintings(String query, int limit, Long lastPaintingId, Collection<String> tags, Long challengeId, Long profileId) {
        return paintingRepository.findPaintings(query, tags, challengeId, profileId, lastPaintingId, limit);
    }

    public String uploadPainting(String title, String description, Set<String> tags, Long challengeId, MultipartFile multipartFile) {
        Profile profile = profileService.getCurrentProfile();
        String filePath = uploadFile(multipartFile, profile);

        Challenge challenge = challengeId != null ? challengeRepository.findById(challengeId).orElse(null) : null;
        Painting painting = new Painting();
        painting.setTitle(title);
        painting.setDescription(description);
        painting.addTags(tagMapper.mapTags(tags));
        painting.setProfile(profileService.getCurrentProfile());
        painting.setFilePath(filePath);
        painting.setChallenge(challenge);
        painting.setCreationDate(new Timestamp(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC) * 1000));
        paintingRepository.save(painting);
        return getFileUrl(filePath);
    }

    public void deletePainting(Long paintingId) {
        Painting painting = paintingRepository.findById(paintingId).orElseThrow(() -> new IllegalArgumentException("Painting not found"));
        String filePath = painting.getFilePath();
        painting.setTags(new HashSet<>());
        paintingRepository.delete(painting);
        deleteObject(filePath);
    }

    private String uploadFile(MultipartFile multipartFile, Profile profile) {
        try {
            File file = convertMultiPartToFile(multipartFile);
            String filePath = getFilePath(profile.getId());
            uploadFileTos3bucket(filePath, file);
            file.delete();
            return filePath;
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Error when uploading file");
        }
    }

    private void uploadFileTos3bucket(String filePath, File file) {
        putObject(filePath, file);
    }

    private File convertMultiPartToFile(MultipartFile file) {
        File convFile = new File(file.getOriginalFilename());
        try {
            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(file.getBytes());
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Invalid file.");
        }
        return convFile;
    }
}
