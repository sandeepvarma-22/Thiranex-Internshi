package com.student.management.exception;

public class DuplicateRollNumberException extends RuntimeException {
    public DuplicateRollNumberException(String message) {
        super(message);
    }
}
