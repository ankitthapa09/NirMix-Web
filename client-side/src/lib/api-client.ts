import { API_BASE } from "./property-api";

const TOKEN_KEY = "nirmix_token";
const REFRESH_KEY = "nirmix_refresh_token";

/** Browser events used to keep the React auth context in sync with token changes. */
export const AUTH_REFRESHED_EVENT = "nirmix:tokens-refreshed";
export const AUTH_EXPIRED_EVENT = "nirmix:auth-expired";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  window.dispatchEvent(new CustomEvent(AUTH_REFRESHED_EVENT, { detail: { accessToken } }));
}

// Only one refresh runs at a time; concurrent 401s share the same in-flight promise.
let refreshPromise: Promise<string | null> | null = null;

function refreshTokens(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      const next = json?.data;
      if (!next?.accessToken || !next?.refreshToken) return null;
      storeTokens(next.accessToken, next.refreshToken);
      return next.accessToken as string;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

function withAuth(init: RequestInit, token: string | null): RequestInit {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return { ...init, headers };
}

/**
 * Authenticated fetch. Injects the stored access token, and on a 401 transparently
 * refreshes the token once (single-flight) and retries the request. If the refresh
 * fails, fires AUTH_EXPIRED_EVENT so the auth context can log the user out.
 *
 * Callers set their own Content-Type; FormData bodies must NOT set one (the browser
 * adds the multipart boundary) — this wrapper only ever sets Authorization.
 */
export async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, withAuth(init, getAccessToken()));
  if (res.status !== 401) return res;

  const newToken = await refreshTokens();
  if (!newToken) {
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    return res; // original 401
  }
  return fetch(url, withAuth(init, newToken));
}
