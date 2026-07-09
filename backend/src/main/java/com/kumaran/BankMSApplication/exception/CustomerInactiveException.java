package com.kumaran.BankMSApplication.exception;

public class CustomerInactiveException extends RuntimeException {

    public CustomerInactiveException(String message) {
        super(message);
    }
}