// client/src/config.js
// =============================================================================
// Centralised frontend config — all REACT_APP_ env vars flow through here.
// Import this instead of calling process.env directly in components.
//
// Usage:
//   import config from './config';
//   const ws = new WebSocket(`${config.wsUrl}/${username}`);
// =============================================================================

const config = {
  // ---------------------------------------------------------------------------
  // Backend URLs
  // ---------------------------------------------------------------------------

  /** Base HTTP URL for REST calls (health, auth, history). */
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:8000",

  /** WebSocket base URL — username is appended at connection time. */
  wsUrl: process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws",

  // ---------------------------------------------------------------------------
  // App behaviour
  // ---------------------------------------------------------------------------

  /** Maximum number of characters allowed in a single chat message. */
  maxMessageLength: Number(process.env.REACT_APP_MAX_MESSAGE_LENGTH) || 500,

  /** How many historical messages to fetch on room join. */
  messageHistoryLimit: Number(process.env.REACT_APP_MESSAGE_HISTORY_LIMIT) || 50,

  // ---------------------------------------------------------------------------
  // WebSocket reconnect (exponential backoff)
  // ---------------------------------------------------------------------------

  /** Base delay (ms) before the first reconnect attempt. */
  wsReconnectBaseDelayMs:
    Number(process.env.REACT_APP_WS_RECONNECT_BASE_DELAY_MS) || 1000,

  /** Maximum delay cap (ms) — backoff will not exceed this. */
  wsReconnectMaxDelayMs:
    Number(process.env.REACT_APP_WS_RECONNECT_MAX_DELAY_MS) || 30000,

  /** Maximum number of reconnect attempts before giving up. */
  wsReconnectMaxAttempts:
    Number(process.env.REACT_APP_WS_RECONNECT_MAX_ATTEMPTS) || 10,

  // ---------------------------------------------------------------------------
  // Feature flags
  // ---------------------------------------------------------------------------

  /** Show the WebSocket connection status badge in the UI. */
  showConnectionStatus:
    process.env.REACT_APP_SHOW_CONNECTION_STATUS !== "false",

  /** Show a timestamp next to each chat message. */
  showTimestamps: process.env.REACT_APP_SHOW_TIMESTAMPS !== "false",
};

// Warn in development if the backend URL still points to localhost
// (catches the common mistake of forgetting to update .env before deploying).
if (
  process.env.NODE_ENV === "production" &&
  (config.apiUrl.includes("localhost") || config.wsUrl.includes("localhost"))
) {
  console.warn(
    "[config] WARNING: REACT_APP_API_URL / REACT_APP_WS_URL still point to " +
      "localhost in a production build. Did you forget to set them?"
  );
}

export default config;