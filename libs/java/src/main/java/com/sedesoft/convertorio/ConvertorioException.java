package com.sedesoft.convertorio;

/**
 * Exception thrown by Convertorio SDK
 */
public class ConvertorioException extends Exception {
    public ConvertorioException(String message) {
        super(message);
    }

    public ConvertorioException(String message, Throwable cause) {
        super(message, cause);
    }
}
