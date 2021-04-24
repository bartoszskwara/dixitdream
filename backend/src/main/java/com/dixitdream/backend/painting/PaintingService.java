package com.dixitdream.backend.painting;

import com.dixitdream.backend.dao.entity.Challenge;
import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.Profile;
import com.dixitdream.backend.dao.projection.PaintingProjectionDto;
import com.dixitdream.backend.dao.projection.ProfileInfoDto;
import com.dixitdream.backend.dao.repository.ChallengeRepository;
import com.dixitdream.backend.dao.repository.PaintingRepository;
import com.dixitdream.backend.infrastructure.exception.BadRequestException;
import com.dixitdream.backend.infrastructure.exception.ResourceNotFoundException;
import com.dixitdream.backend.infrastructure.exception.ServerErrorException;
import com.dixitdream.backend.profile.ProfileService;
import com.dixitdream.backend.tags.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
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
        return paintingRepository.findByIdWithDetails(paintingId).orElseThrow(() -> new ResourceNotFoundException("Painting not found"));
    }

    public List<PaintingProjectionDto> getPaintings(String query, int limit, Long lastPaintingId, Collection<String> tags, Long challengeId, Long profileId) {
        return paintingRepository.findPaintings(query, tags, challengeId, profileId, lastPaintingId, limit, profileService.getCurrentProfile());
    }

    public Painting uploadPainting(String title, String description, Set<String> tags, Long challengeId, MultipartFile multipartFile) {
        ProfileInfoDto profile = profileService.getCurrentProfileInfo();
        validateAspectRatio(multipartFile);
        String filePath = uploadFile(multipartFile, profile.getId());

        Challenge challenge = challengeId != null ? challengeRepository.findById(challengeId).orElse(null) : null;
        Painting painting = new Painting();
        painting.setTitle(title);
        painting.setDescription(description);
        painting.addTags(tagMapper.mapTags(tags));
        painting.setProfile(profileService.getCurrentProfile());
        painting.setFilePath(filePath);
        painting.setChallenge(challenge);
        painting.setCreationDate(new Timestamp(LocalDateTime.now().toEpochSecond(ZoneOffset.UTC) * 1000));
        return paintingRepository.save(painting);
    }

    public void deletePainting(Long paintingId) {
        Painting painting = paintingRepository.findById(paintingId).orElseThrow(() -> new ResourceNotFoundException("Painting not found"));
        String filePath = painting.getFilePath();
        painting.setTags(new HashSet<>());
        paintingRepository.delete(painting);
        deleteObject(filePath);
    }

    public void toggleLikePainting(Long paintingId) {
        Painting painting = paintingRepository.findById(paintingId).orElseThrow(() -> new ResourceNotFoundException("Painting not found"));
        Profile currentProfile = profileService.getCurrentProfile();
        if(!painting.getLikes().contains(currentProfile)) {
            painting.addLike(currentProfile);
        } else {
            painting.removeLike(currentProfile);
        }
        paintingRepository.save(painting);
    }

    public boolean visitPainting(Long paintingId) {
        Painting painting = paintingRepository.findById(paintingId).orElseThrow(() -> new ResourceNotFoundException("Painting not found"));
        Profile currentProfile = profileService.getCurrentProfile();
        if(!painting.getVisits().contains(currentProfile) && !painting.getProfile().equals(currentProfile)) {
            painting.addVisit(currentProfile);
            paintingRepository.save(painting);
            return true;
        }
        return false;
    }

    private String uploadFile(MultipartFile multipartFile, Long id) {
        try {
            File file = convertMultiPartToFile(multipartFile);
            String filePath = getFilePath(id);
            uploadFileTos3bucket(filePath, file);
            file.delete();
            return filePath;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerErrorException("Error when uploading file");
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
            throw new BadRequestException("Invalid file.");
        }
        return convFile;
    }

    private void validateAspectRatio(MultipartFile multipartFile) {
        try {
            BufferedImage image = ImageIO.read(multipartFile.getInputStream());
            if(Math.round(((float) image.getWidth() / (float) image.getHeight()) * 100.0) / 100.0 != Math.round(((float) 7/11)* 100.0) / 100.0 ) {
                throw new BadRequestException("Invalid aspect ratio of the painting.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
