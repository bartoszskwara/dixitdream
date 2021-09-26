package com.dixitdream.backend.dao.repository;

import com.dixitdream.backend.dao.entity.Notification;
import com.dixitdream.backend.notification.NotificationType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends CrudRepository<Notification, Long> {

    @Query(value = "select * from Notification n " +
            "where n.id < :lastNotificationId and n.user_id = :userId " +
            "and n.status != 'archived' " +
            "order by n.id desc " +
            "limit :limit", nativeQuery = true)
    List<Notification> findNotificationsForUser(@Param("limit") int limit,
                                                @Param("lastNotificationId") Long lastNotificationId,
                                                @Param("userId") Long userId);

    @Query(value = "select * from Notification n " +
            "where n.user_id = :userId " +
            "and n.status != 'archived' " +
            "order by n.id desc " +
            "limit :limit", nativeQuery = true)
    List<Notification> findNotificationsForUser(@Param("limit") int limit,
                                                @Param("userId") Long userId);

    @Query(value = "select * from Notification n " +
            "where type = :type " +
            "and notification_data->>'contextId'= :contextId " +
            "and user_id = :userId " +
            "and status = 'created' ", nativeQuery = true)
    Optional<Notification> findNewNotificationByTypeAndContextIdAndUserId(@Param("type") String type,
                                                                          @Param("contextId") String contextId,
                                                                          @Param("userId") Long userId);

    @Query(value = "select * from Notification n " +
            "where type = :type " +
            "and notification_data->>'contextId'= :contextId " +
            "and user_id = :userId " +
            "and status != 'archived' ", nativeQuery = true)
    Optional<Notification> findNotArchivedNotificationByTypeAndContextIdAndUserId(@Param("type") String type,
                                                                                  @Param("contextId") String contextId,
                                                                                  @Param("userId") Long userId);
}