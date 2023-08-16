export const baseName = "/time-tracker";
export const apiBase = "https://cshadiev.com/time-tracker/api";
// export const apiBase = "http://localhost:5000";
export const unprotectedRoutes = ["/users/token/"].map((r) => apiBase + r);
export const REDIRECT_DELAY_SECONDS = 2;
export const DEFAULT_SESSION_DURATION = 25 * 60;
