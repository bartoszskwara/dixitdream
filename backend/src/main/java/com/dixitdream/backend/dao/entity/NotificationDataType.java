package com.dixitdream.backend.dao.entity;

public class NotificationDataType extends JsonType {
    @Override
    public Class<NotificationData> returnedClass() {
        return NotificationData.class;
    }
}
