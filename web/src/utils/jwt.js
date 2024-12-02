export const accessToken = 'star_access_token';
export const refreshToken = 'star_refresh_token';

export function getAccessToken() {
  return localStorage.getItem(accessToken);
}

export function setAccessToken(token) {
  return localStorage.setItem(accessToken, token);
}

export function getRefreshToken() {
  return localStorage.getItem(refreshToken);
}

export function setRefreshToken(token) {
  return localStorage.setItem(refreshToken, token);
}

export function removeTokens() {
  localStorage.removeItem(accessToken);
  localStorage.removeItem(refreshToken);
}