package com.dixitdream.backend.infrastructure.exception;

public class ServerErrorException extends RuntimeException {
    public ServerErrorException(String errorMessage) {
        super(errorMessage);
    }
}
