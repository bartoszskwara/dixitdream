package com.dixitdream.backend.events;

import com.dixitdream.backend.dao.entity.Notification;
import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.dao.repository.NotificationRepository;
import com.dixitdream.backend.notification.NotificationService;
import com.dixitdream.backend.notification.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import static com.dixitdream.backend.dao.entity.Notification.NotificationStatus.archived;
import static com.dixitdream.backend.notification.NotificationType.paintingLike;

@Component
@RequiredArgsConstructor
public class PaintingLikeEventListener implements ApplicationListener<PaintingLikeEvent> {

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Override
    public void onApplicationEvent(PaintingLikeEvent event) {
        switch (event.getPaintingLikeAction()) {
            case like:
                likePainting(event.getPainting(), event.getUser());
                break;
            case dislike:
                dislikePainting(event.getPainting(), event.getUser());
                break;
        }
    }

    private void likePainting(Painting painting, UserProfile user) {
        if(painting.getUser().equals(user)) {
            return;
        }
        notificationRepository.findNotArchivedNotificationByTypeAndContextIdAndUserId(paintingLike.name(), String.valueOf(painting.getId()), painting.getUser().getId())
                .ifPresentOrElse(
                        (notification) -> {},
                        () -> notificationService.createNotificationForPaintingLike(painting, user)
                );
    }

    private void dislikePainting(Painting painting, UserProfile user) {
        notificationRepository.findNewNotificationByTypeAndContextIdAndUserId(paintingLike.name(), String.valueOf(painting.getId()), painting.getUser().getId())
                .ifPresent((notification) -> {
                    notification.setStatus(archived);
                    notificationRepository.save(notification);
                });
    }
}
