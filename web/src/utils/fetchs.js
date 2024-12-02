import { getAccessToken, getRefreshToken } from '../utils/jwt.js';
import { setAuthData, validateAuthResponse, logout, userId } from '../services/auth.js';
import { apiUrl, analyticsUrl } from '../utils/config.js';

// Types for better code clarity and IDE support
/**
 * @typedef {Object} FetchOptions
 * @property {Headers | Record<string, string>} [headers] - Request headers
 * @property {string} [method] - HTTP method
 * @property {any} [body] - Request body
 * @property {number} [timeout] - Request timeout in milliseconds
 * @property {number} [retries] - Number of retry attempts
 * @property {boolean} [skipRefresh] - Skip token refresh on 401
 */

/**
 * @typedef {Object} TokenResponse
 * @property {string} access - Access token
 * @property {string} refresh - Refresh token
 */

// Constants
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Custom error classes for better error handling
class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TokenError';
  }
}

/**
 * Delay utility for retry mechanism
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Creates Headers object from various input types
 * @param {Headers | Record<string, string> | undefined} headers
 * @returns {Headers}
 */
const normalizeHeaders = (headers) => {
  if (headers instanceof Headers) return headers;
  const normalized = new Headers();
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      normalized.append(key, value);
    });
  }
  return normalized;
};

/**
 * Secure fetch client with automatic token refresh and retry logic
 * @param {string | URL} url - Request URL
 * @param {FetchOptions} [options] - Request options
 * @returns {Promise<Response>}
 * @throws {ApiError} When request fails
 * @throws {TokenError} When authentication fails
 */
export async function fetchs(url, options = {}) {
  const {
    headers,
    method = 'GET',
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    skipRefresh = false,
    ...restOptions
  } = options;

  let attempts = 0;

  while (attempts <= retries) {
    const normalizedHeaders = normalizeHeaders(headers);
    const accessToken = getAccessToken();
    if (accessToken)
      normalizedHeaders.set('Authorization', `Bearer ${accessToken}`);
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        method,
        headers: normalizedHeaders,
        signal: controller.signal,
        ...restOptions
      });

      clearTimeout(timeoutId);

      // Handle 401 with token refresh
      if (res.status === 401 && !skipRefresh) {
        try {
          await refreshAuthToken();
          return await fetchs(url, { ...options, skipRefresh: true });
        } catch (refreshError) {
          logout();
          throw new TokenError(refreshError.message);
        }
      }

      // Handle other error status codes
      if (!res.ok) {
        throw new ApiError(
          `Request failed with status ${res.status}`,
          res.status,
          res
        );
      }

      return res;

    } catch (error) {
      attempts++;

      // Don't retry on authentication errors or if max retries reached
      if (
        error instanceof TokenError ||
        attempts > retries ||
        error.name === 'AbortError'
      ) {
        throw error;
      }

      // Wait before retrying
      await delay(RETRY_DELAY * attempts);
    }
  }
}

/**
 * Refresh authentication tokens
 * @returns {Promise<TokenResponse>}
 * @throws {TokenError}
 */
async function refreshAuthToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken)
    throw new TokenError('No refresh token available');

  if (!userId)
    throw new Error('No user ID available');

  const res = await fetch(`${apiUrl}/auth/refresh/${userId}`, {
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  });

  if (res.status === 403)
    throw new TokenError('Invalid refresh token');

  if (!res.ok)
    throw new TokenError('Token refresh failed');

  const data = await res.json();
  validateAuthResponse(data);
  setAuthData(data);
  return data;
}

/**
 * Make a request to the core API
 * @param {string} path - API endpoint path
 * @param {FetchOptions} [options] - Request options
 * @returns {Promise<Response>}
 */
export async function fetchApi(path, options) {
  return fetchs(`${apiUrl}/${path.replace(/^\/+/, '')}`, options);
}

/**
 * Make a request to the analytics API
 * @param {string} path - API endpoint path
 * @param {FetchOptions} [options] - Request options
 * @returns {Promise<Response>}
 */
export async function fetchAnalytics(path, options) {
  return fetchs(`${analyticsUrl}/${path.replace(/^\/+/, '')}`, options);
}