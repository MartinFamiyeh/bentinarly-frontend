/**
 * Utility functions for JWT token management
 */

/**
 * Decode JWT token without verification (client-side only)
 * Returns the payload as an object
 */
export function decodeJWT(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if a JWT token is expired or will expire soon
 * @param token - JWT token string
 * @param bufferSeconds - Number of seconds before expiration to consider it "expiring soon" (default: 300 = 5 minutes)
 * @returns true if token is expired or expiring soon
 */
export function isTokenExpiringSoon(token: string | null, bufferSeconds: number = 300): boolean {
  if (!token) return false; // Changed from true to false - don't refresh if no token

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    // If we can't decode or no exp field, assume it's valid (don't refresh)
    // This prevents infinite refresh loops
    return false;
  }

  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const bufferTime = bufferSeconds * 1000;

  // Token is expired or will expire within buffer time
  const isExpiring = expirationTime <= currentTime + bufferTime;
  
  // Only return true if token is actually expiring soon AND not already expired by more than buffer
  // This prevents refreshing already-expired tokens repeatedly
  if (isExpiring && expirationTime > currentTime - bufferTime) {
    return true;
  }
  
  return false;
}

/**
 * Get the expiration time of a JWT token
 * @param token - JWT token string
 * @returns Expiration timestamp in milliseconds, or null if invalid
 */
export function getTokenExpiration(token: string | null): number | null {
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;

  return decoded.exp * 1000; // Convert to milliseconds
}

/**
 * Get time until token expires in milliseconds
 * @param token - JWT token string
 * @returns Milliseconds until expiration, or null if invalid/expired
 */
export function getTimeUntilExpiration(token: string | null): number | null {
  if (!token) return null;

  const expiration = getTokenExpiration(token);
  if (!expiration) return null;

  const timeUntil = expiration - Date.now();
  return timeUntil > 0 ? timeUntil : null;
}

