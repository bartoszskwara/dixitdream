package com.dixitdream.backend.notification;

import com.dixitdream.backend.dao.entity.Notification;
import com.dixitdream.backend.dto.ListContentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping(value = "")
    public ResponseEntity<ListContentDto<NotificationDto>> getNotifications(@RequestParam(name = "limit", defaultValue = "5", required = false) int limit,
                                                                            @RequestParam(name = "lastNotificationId", required = false) Long lastNotificationId) {
        List<Notification> notifications = notificationService.getNotifications(limit, lastNotificationId);
        List<NotificationDto> dtos = notifications.stream()
                .map(n -> NotificationDto.builder()
                        .id(n.getId())
                        .type(n.getType())
                        .content(notificationService.generateContentForNotification(n))
                        .contextId(n.getNotificationData().getContextId())
                        .avatarUrl(notificationService.getAvatarForNotification(n))
                        .datetime(n.getDatetime().atZone(ZoneId.systemDefault()).toEpochSecond())
                        .isNew(!n.isOpened())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ListContentDto<>(dtos));
    }

    @PutMapping(value = "/{notificationId}")
    public ResponseEntity<Void> openNotification(@NotNull @PathVariable Long notificationId) {
        notificationService.openNotification(notificationId);
        return ResponseEntity.ok().build();
    }
}
