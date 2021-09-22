package com.dixitdream.backend.events;

import com.dixitdream.backend.dao.entity.Painting;
import com.dixitdream.backend.dao.entity.UserProfile;
import org.springframework.context.ApplicationEvent;

public class PaintingLikeEvent extends ApplicationEvent {
    private final PaintingLikeAction paintingLikeAction;
    private final UserProfile user;
    private final Painting painting;

    public PaintingLikeEvent(Object source, PaintingLikeAction paintingLikeAction, UserProfile user, Painting painting) {
        super(source);
        this.paintingLikeAction = paintingLikeAction;
        this.user = user;
        this.painting = painting;
    }

    public PaintingLikeAction getPaintingLikeAction() {
        return paintingLikeAction;
    }

    public UserProfile getUser() {
        return user;
    }

    public Painting getPainting() {
        return painting;
    }

    public enum PaintingLikeAction {
        like, dislike
    }
}
