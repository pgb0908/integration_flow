package com.example.cp.exception;

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String resourceName, Long id) {
        super("NOT_FOUND", resourceName + " not found with id: " + id);
    }

    public ResourceNotFoundException(String message) {
        super("NOT_FOUND", message);
    }
}
