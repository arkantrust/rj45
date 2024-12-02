package com.rj45.model;

public enum Role {

    EVALUATOR("evaluator"),
    ADMIN("admin");

    private final String name;

    Role(final String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }

}