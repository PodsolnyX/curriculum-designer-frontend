import {LS_KEY_ACCESS_TOKEN, LS_KEY_REFRESH_TOKEN, LS_KEY_SESSION_TOKEN} from "@/shared/const/localStorageKeys.ts";
import {LS_EVENT_NAME} from "@/shared/lib/hooks/useStorage.ts";

export function getAccessToken(): string | null {
    return JSON.parse(localStorage.getItem(LS_KEY_ACCESS_TOKEN));
}

export function getRefreshToken(): string | null {
    return JSON.parse(localStorage.getItem(LS_KEY_REFRESH_TOKEN));
}

export function getSessionToken(): string | null {
    return JSON.parse(sessionStorage.getItem(LS_KEY_SESSION_TOKEN));
}

export function removeAccessToken(): void {
    localStorage.setItem(LS_KEY_ACCESS_TOKEN, JSON.stringify(""));
    window.dispatchEvent(new StorageEvent(LS_EVENT_NAME, { key: LS_KEY_ACCESS_TOKEN }));
}

export function removeRefreshToken(): void {
    localStorage.setItem(LS_KEY_REFRESH_TOKEN, JSON.stringify(""));
}

export function removeSessionToken(): void {
    sessionStorage.setItem(LS_KEY_SESSION_TOKEN, JSON.stringify(""));
}

export function setAccessToken(token: string): void {
    localStorage.setItem(LS_KEY_ACCESS_TOKEN, JSON.stringify(token));
    window.dispatchEvent(new StorageEvent(LS_EVENT_NAME, { key: LS_KEY_ACCESS_TOKEN }));
}

export function setRefreshToken(token: string): void {
    localStorage.setItem(LS_KEY_REFRESH_TOKEN, JSON.stringify(token));
}

export function setSessionToken(token: string): void {
    sessionStorage.setItem(LS_KEY_SESSION_TOKEN, JSON.stringify(token));
}