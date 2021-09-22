package com.dixitdream.backend.events;

import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.UserProfile;
import com.dixitdream.backend.events.PaintingLikeEvent.PaintingLikeAction;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaintingLikeEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public void publishLikeEvent(final UserProfile userProfile, Painting painting) {
        PaintingLikeEvent actionEvent = new PaintingLikeEvent(this, PaintingLikeAction.like, userProfile, painting);
        applicationEventPublisher.publishEvent(actionEvent);
    }

    public void publishDislikeEvent(final UserProfile userProfile, Painting painting) {
        PaintingLikeEvent actionEvent = new PaintingLikeEvent(this, PaintingLikeAction.dislike, userProfile, painting);
        applicationEventPublisher.publishEvent(actionEvent);
    }
}
