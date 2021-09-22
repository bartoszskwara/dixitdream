package com.dixitdream.backend.events;

import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaintingLikeEventListener implements ApplicationListener<PaintingLikeEvent> {

    private final NotificationService notificationService;

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
        if(!painting.getUser().equals(user)) {
            notificationService.createNotificationForPaintingLike(painting, user);
        }
    }

    private void dislikePainting(Painting painting, UserProfile user) {
        //TODO: check if notification was not opened and archive it if needed
    }
}
