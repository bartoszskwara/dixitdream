package com.dixitdream.backend.dao.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@TypeDefs({
        @TypeDef(name = "NotificationDataType", typeClass = NotificationDataType.class)
})
public class Notification {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    private String type;
    private boolean opened;
    @Type(type = "NotificationDataType")
    private NotificationData notificationData;
    @NotNull
    private LocalDateTime datetime;

    @ManyToOne(fetch = FetchType.LAZY)
    private UserProfile user;

    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    public enum NotificationStatus {
        created, open, archived
    }
}
