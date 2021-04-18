package com.dixitdream.backend.infrastructure.exception;

import com.dixitdream.backend.dto.ResponseErrorDto;
import com.dixitdream.backend.dto.ValidationErrorDto;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers,
                                                                  HttpStatus status, WebRequest request) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));

        Map<String, String> objectErrors = ex.getBindingResult().getGlobalErrors().stream()
                .collect(Collectors.toMap(ObjectError::getObjectName, ObjectError::getDefaultMessage));

        ValidationErrorDto errorDto = new ValidationErrorDto(fieldErrors, objectErrors);
        return handleExceptionInternal(ex, errorDto, headers, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    protected ResponseEntity<Object> handleConflict(RuntimeException ex, WebRequest request) {
        ResponseErrorDto errorDto = new ResponseErrorDto(ex.getMessage());
        return handleExceptionInternal(ex, errorDto, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }
}