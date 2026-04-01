/**
 * fetchWithAuth — drop-in replacement for fetch() for all authenticated API calls.
 *
 * Sends the HttpOnly `auth_token` cookie automatically via `credentials: 'include'`.
 * No need to read localStorage or manually set Authorization headers anywhere.
 *
 * Usage:
 *   import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
 *   const res = await fetchWithAuth('/api/users/me');
 *   const res = await fetchWithAuth('/api/posts', { method: 'POST', body: JSON.stringify(data) });
 */
export function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include', // sends the HttpOnly auth_token cookie automatically
  });
}
