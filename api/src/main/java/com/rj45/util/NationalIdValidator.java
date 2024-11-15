package com.rj45.util;

import java.util.regex.Pattern;

/**
 * Validates Colombian National ID numbers (Cédulas).
 * Rules implemented:
 * - Must be between 6 and 10 digits
 * - Must contain only numbers
 * - Must not be all zeros
 * - Must be within valid range (current range is roughly 100000 to 1999999999)
 */
public record NationalIdValidator(String nationalId) {

    private static final Pattern DIGITS_ONLY = Pattern.compile("^\\d+$");
    private static final int MIN_LENGTH = 6;
    private static final int MAX_LENGTH = 10;
    private static final long MIN_VALUE = 100000L;
    private static final long MAX_VALUE = 1999999999L;

    /**
     * Validates if the provided national ID is a valid Colombian cédula.
     *
     * @return true if the national ID is valid, false otherwise
     */
    public boolean isValid() {
        if (nationalId == null || nationalId.isEmpty())
            return false;

        // Check length constraints
        if (nationalId.length() < MIN_LENGTH || nationalId.length() > MAX_LENGTH)
            return false;

        // Check if contains only digits
        if (!DIGITS_ONLY.matcher(nationalId).matches())
            return false;

        try {
            long numericValue = Long.parseLong(nationalId);

            // Check if all zeros
            if (numericValue == 0)
                return false;

            // Check if within valid range
            return numericValue >= MIN_VALUE && numericValue <= MAX_VALUE;

        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * Formats the national ID with proper spacing for display.
     * Example: "1234567890" becomes "1.234.567.890"
     *
     * @return formatted national ID string, or original string if invalid
     */
    public String format() {
        if (!isValid())
            return nationalId;

        StringBuilder formatted = new StringBuilder();
        String reversed = new StringBuilder(nationalId).reverse().toString();
        
        for (int i = 0; i < reversed.length(); i++) {
            if (i > 0 && i % 3 == 0)
                formatted.insert(0, '.');

            formatted.insert(0, reversed.charAt(i));
        }
        
        return formatted.toString();
    }

    /**
     * Normalizes the national ID by removing any formatting and spaces.
     * Example: "1.234.567.890" becomes "1234567890"
     *
     * @return normalized national ID string
     */
    public String normalize() {
        if (nationalId == null)
            return null;

        return nationalId.replaceAll("[^0-9]", "");
    }
    
}