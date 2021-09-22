package com.dixitdream.backend.notification;

import com.dixitdream.backend.dao.entity.Notification;
import com.dixitdream.backend.dao.entity.NotificationData;
import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.repository.NotificationRepository;
import com.dixitdream.backend.dao.repository.PaintingRepository;
import com.dixitdream.backend.dao.repository.UserRepository;
import com.dixitdream.backend.infrastructure.exception.BadRequestException;
import com.dixitdream.backend.infrastructure.exception.ForbiddenException;
import com.dixitdream.backend.painting.PaintingService;
import com.dixitdream.backend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.joining;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final PaintingService paintingService;
    private final UserRepository userRepository;
    private final PaintingRepository paintingRepository;

    public void createNotificationForPaintingLike(Painting painting, UserProfile liker) {
        createNotificationForType(NotificationType.paintingLike, painting, liker);
    }

    private void createNotificationForType(NotificationType type, Painting painting, UserProfile liker) {
        Notification notification = new Notification();
        notification.setType(type.name());
        notification.setUser(painting.getUser());
        notification.setDatetime(LocalDateTime.now().atZone(ZoneId.systemDefault()).toLocalDateTime());
        notification.setNotificationData(new NotificationData(painting.getId(), List.of(liker.getId())));
        notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(int limit, Long lastNotificationId) {
        UserProfile currentUser = userService.getCurrentUser();
        if(lastNotificationId == null) {
            return notificationRepository.findNotificationsForUser(limit, currentUser.getId());
        }
        return notificationRepository.findNotificationsForUser(limit, lastNotificationId, currentUser.getId());
    }

    public void openNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new BadRequestException("Notification not found."));
        UserProfile currentUser = userService.getCurrentUser();
        if(!notification.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Access to notification denied.");
        }
        notification.setOpened(true);
        notificationRepository.save(notification);
    }

    public String generateContentForNotification(Notification notification) {
        switch (NotificationType.valueOf(notification.getType())) {
            case paintingLike:
                return generateContentForPaintingLike(notification);
            default:
                return null;
        }
    }

    public String getAvatarForNotification(Notification notification) {
        switch (NotificationType.valueOf(notification.getType())) {
            case paintingLike:
                return getPaintingUrl(notification);
            default:
                return null;
        }
    }

    private String generateContentForPaintingLike(Notification notification) {
        List<UserProfile> users = userRepository.findAllByIds(notification.getNotificationData().getLikers());
        Painting painting = paintingRepository.findById(notification.getNotificationData().getContextId()).orElse(null);
        String likeClause = users.size() > 1 ? " like your painting " : " likes your painting ";
        String usernames = users.size() > 3 ?
                users.stream().limit(3).map(UserProfile::getUsername).collect(joining(", ")) :
                users.stream().map(UserProfile::getUsername).collect(joining(", "));
        return painting != null ? usernames + likeClause + painting.getTitle() : null;
    }

    private String getPaintingUrl(Notification notification) {
        Painting painting = paintingRepository.findById(notification.getNotificationData().getContextId()).orElse(null);
        return painting != null ? paintingService.getFileUrl(painting.getFilePath()) : null;
    }
}
