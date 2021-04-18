package com.dixitdream.backend.infrastructure.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
