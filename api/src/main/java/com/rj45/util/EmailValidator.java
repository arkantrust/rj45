package com.rj45.util;

import java.net.IDN;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Validates email addresses with comprehensive checks and provides formatting utilities.
 * Implements RFC 5322 standards and common practical limitations.
 */
public record EmailValidator(String email) {
    
    // RFC 5322 compliant regex
    private static final String EMAIL_REGEX = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX, Pattern.CASE_INSENSITIVE);
    
    // Common configuration constants
    private static final int MAX_LOCAL_PART_LENGTH = 64;
    private static final int MAX_DOMAIN_PART_LENGTH = 255;
    private static final int MAX_TOTAL_LENGTH = 254;
    
    // Common disposable email domains
    private static final Set<String> DISPOSABLE_DOMAINS = new HashSet<>(Arrays.asList(
        "tempmail.com", "throwawaymail.com", "guerrillamail.com", "mailinator.com",
        "10minutemail.com", "yopmail.com", "tempmail.net", "disposablemail.com"
    ));

    /**
     * Validates if the provided email address is valid according to RFC 5322
     * and additional practical constraints.
     *
     * @return true if the email is valid, false otherwise
     */
    public boolean isValid() {
        if (email == null || email.isBlank())
            return false;

        String normalizedEmail = normalize();
        
        // Check total length
        if (normalizedEmail.length() > MAX_TOTAL_LENGTH)
            return false;

        // Basic pattern check
        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches())
            return false;

        String[] parts = normalizedEmail.split("@", 2);
        if (parts.length != 2)
            return false;

        String localPart = parts[0];
        String domain = parts[1];

        // Check lengths of parts
        if (localPart.length() > MAX_LOCAL_PART_LENGTH || 
            domain.length() > MAX_DOMAIN_PART_LENGTH)
            return false;

        // Additional domain checks
        try {
            // Convert IDN (International Domain Names) to ASCII
            String asciiDomain = IDN.toASCII(domain);
            
            // Check for valid domain structure
            if (!isValidDomain(asciiDomain))
                return false;

        } catch (IllegalArgumentException e) {
            return false;
        }

        return true;
    }

    /**
     * Checks if the email is from a known disposable email provider.
     *
     * @return true if the email is from a disposable domain
     */
    public boolean isDisposable() {
        if (!isValid())
            return false;

        String domain = getDomain().toLowerCase();
        return DISPOSABLE_DOMAINS.contains(domain);
    }

    /**
     * Gets the local part of the email address (before @).
     *
     * @return the local part of the email, or null if invalid
     */
    public String getLocalPart() {
        if (!isValid())
            return null;

        return email.split("@")[0];
    }

    /**
     * Gets the domain part of the email address (after @).
     *
     * @return the domain part of the email, or null if invalid
     */
    public String getDomain() {
        if (!isValid())
            return null;

        return email.split("@")[1];
    }

    /**
     * Normalizes the email address by trimming whitespace and converting to lowercase.
     *
     * @return normalized email address
     */
    public String normalize() {
        if (email == null)
            return null;

        return email.trim().toLowerCase();
    }

    /**
     * Validates the structure of a domain name.
     *
     * @param domain the domain to validate
     * @return true if the domain structure is valid
     */
    private boolean isValidDomain(String domain) {
        if (domain == null || domain.length() < 1)
            return false;

        String[] parts = domain.split("\\.");
        
        // Must have at least one dot and valid parts
        if (parts.length < 2)
            return false;

        // Check each part
        for (String part : parts) {
            // Parts cannot be empty or start/end with hyphen
            if (part.isEmpty() || part.startsWith("-") || part.endsWith("-"))
                return false;
            
            // Parts must only contain letters, numbers, and hyphens
            if (!part.matches("^[a-zA-Z0-9-]+$"))
                return false;

        }

        return true;
    }

    /**
     * Checks if the email has a valid MX record (requires DNS lookup).
     * TODO: use javax.naming.directory.DirContext to perform DNS lookups
     * @return true if the domain has valid MX records
     */
    public boolean hasMxRecord() {
        throw new UnsupportedOperationException("MX record checking not implemented");
    }

}