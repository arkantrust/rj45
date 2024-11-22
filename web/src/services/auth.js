import { apiUrl } from '../utils/config';
import { fetchApi } from '../utils/fetchs';
import { setAccessToken, setRefreshToken, removeTokens } from '../utils/jwt';

// Types for better code clarity and type safety
/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User's full name
 * @property {string} email - User's email
 * @property {string} nationalId - User's national ID
 * @property {string} role - User's role
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} access - Access token
 * @property {string} refresh - Refresh token
 * @property {number} userId - User ID
 */

/**
 * @typedef {Object} AuthError
 * @property {string} message - Error message
 * @property {string} code - Error code
 * @property {Object} [details] - Additional error details
 */

// Constants
const USER_STORAGE_KEY = 'star_user_id';
const endpoint = `${apiUrl}/auth`;

// Custom error class for authentication errors
class AuthenticationError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.details = details;
  }
}

export const userId = localStorage.getItem(USER_STORAGE_KEY);

/**
   * Set authentication data in storage
   * @param {AuthResponse} data
   * @private
   */
function _setAuthData(data) {
  setAccessToken(data.access);
  setRefreshToken(data.refresh);
  localStorage.setItem(USER_STORAGE_KEY, data.userId);
}

/**
   * Sign in user with username and password
   * @param {string} username - User's email or national ID
   * @param {string} password - User's password
   * @returns {Promise<User>} Authenticated user data
   * @throws {AuthenticationError}
   */
export async function signIn(username, password) {
  try {
    const res = await fetch(endpoint + '/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        username: username.trim(),
        password: password.trim()
      })
    });

    if (res.status === 401) {
      throw new AuthenticationError('Invalid credentials', 'INVALID_CREDENTIALS');
    } else if (res.status === 404) {
      throw new AuthenticationError('User not found', 'USER_NOT_FOUND');
    } else if (!res.ok) {
      const error = await res.json();
      throw new AuthenticationError(
        error || 'Authentication failed',
        res.status,
        error
      );
    }

    const data = await res.json();
    
    // Validate response data
    _validateAuthResponse(data);

    // Set tokens
    _setAuthData(data);
  } catch (error) {
    console.error('[Auth Service] Sign in error:', error);
    throw _handleAuthError(error);
  }
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.nationalId - User's national ID
 * @param {string} userData.password - User's password
 * @param {string} userData.confirmation - User's password
 * @returns {Promise<void>}
 * @throws {AuthenticationError}
 */
export async function signUp(userData) {
  try {
    // Validate input data
    _validateSignUpData(userData);

    const res = await fetch(endpoint + '/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: userData.name.trim(),
        email: userData.email.trim(),
        nationalId: userData.nationalId.trim(),
        password: userData.password.trim(),
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new AuthenticationError(
        error || 'Registration failed',
        res.status,
        error
      );
    }
  } catch (error) {
    console.error('[Auth Service] Sign up error:', error);
    throw _handleAuthError(error);
  }
}

/**
 * Get current user data
 * @returns {Promise<User>}
 * @throws {AuthenticationError}
 */
export async function getUser() {
  try {
    const userId = localStorage.getItem(USER_STORAGE_KEY);
    if (!userId)
      throw new AuthenticationError('User not authenticated', 'NO_SESSION');

    const res = await fetchApi(`users/${userId}`);
    
    if (!res.ok) {
      throw new AuthenticationError(
        'Failed to get user data',
        res.status
      );
    }

    return await res.json();
  } catch (error) {
    console.error('[Auth Service] Get user error:', error);
    throw _handleAuthError(error);
  }
}

/**
 * Log out current user
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    // Attempt to invalidate session on the server
    await fetchApi('auth/logout', { method: 'POST' }).catch(() => {});
  } finally {
    // Clean up local state regardless of server response
    _clearAuthData();
  }
}

/**
 * Clear all authentication data
 * @private
 */
function _clearAuthData() {
  removeTokens();
  localStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Validate sign up data
 * @param {Object} data
 * @private
 */
function _validateSignUpData(data) {
  const { name, email, nationalId, password, confirmation } = data;

  if (password !== confirmation)
    throw new AuthenticationError('Passwords do not match', 'PASSWORD_MISMATCH');
  
  if (!name || typeof name !== 'string' || name.length < 2)
    throw new AuthenticationError('Invalid name', 'INVALID_NAME');
  
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    throw new AuthenticationError('Invalid email', 'INVALID_EMAIL');
  
  if (!nationalId || typeof nationalId !== 'string' || nationalId.length < 5)
    throw new AuthenticationError('Invalid national ID', 'INVALID_ID');
  
  if (!password || typeof password !== 'string' || password.length < 8)
    throw new AuthenticationError('Invalid password', 'INVALID_PASSWORD');
}

/**
 * Validate authentication response
 * @param {AuthResponse} data
 * @private
 */
function _validateAuthResponse(data) {
  if (!data.access || !data.refresh || !data.userId) {
    throw new AuthenticationError('Invalid auth response', 'INVALID_RESPONSE');
  }
}

/**
 * Handle authentication errors
 * @param {Error} error
 * @returns {AuthenticationError}
 * @private
 */
function _handleAuthError(error) {
  if (error instanceof AuthenticationError) {
    return error;
  }

  return new AuthenticationError(
    'Authentication failed',
    'UNKNOWN_ERROR',
    { originalError: error }
  );
}
