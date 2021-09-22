package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Notification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends CrudRepository<Notification, Long> {

    @Query(value = "select * from Notification n " +
            "where n.id < :lastNotificationId and n.user_id = :userId " +
            "order by n.id desc " +
            "limit :limit", nativeQuery = true)
    List<Notification> findNotificationsForUser(@Param("limit") int limit,
                                                @Param("lastNotificationId") Long lastNotificationId,
                                                @Param("userId") Long userId);

    @Query(value = "select * from Notification n " +
            "where n.user_id = :userId " +
            "order by n.id desc " +
            "limit :limit", nativeQuery = true)
    List<Notification> findNotificationsForUser(@Param("limit") int limit,
                                                @Param("userId") Long userId);
}