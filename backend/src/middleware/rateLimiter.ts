import type { Socket } from "socket.io";

export type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  /** Events that are never rate limited (e.g. WebRTC signaling bursts). */
  exemptEvents?: string[];
};

type TokenBucket = {
  tokens: number;
  lastRefillTime: number;
};

/**
 * Per-socket, per-event token bucket rate limiter.
 *
 * Register with `io.use(createSocketRateLimiter(...))`. The connection-level
 * middleware installs an event-level `socket.use` hook, so every incoming event
 * (not just the handshake) consumes a token. The bucket is dropped on disconnect.
 */
export function createSocketRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests } = options;
  const exempt = new Set(options.exemptEvents ?? []);

  // Tokens refill at this rate: maxRequests tokens per windowMs
  const refillRatePerMs = maxRequests / windowMs;

  return (socket: Socket, next: (err?: Error) => void) => {
    const bucket: TokenBucket = { tokens: maxRequests, lastRefillTime: Date.now() };

    socket.use(([event], nextEvent) => {
      if (exempt.has(event)) {
        nextEvent();
        return;
      }

      const now = Date.now();
      const elapsed = now - bucket.lastRefillTime;
      bucket.tokens = Math.min(maxRequests, bucket.tokens + elapsed * refillRatePerMs);
      bucket.lastRefillTime = now;

      if (bucket.tokens >= 1) {
        bucket.tokens -= 1;
        nextEvent();
        return;
      }

      // Time needed to refill 1 token
      const retryAfterMs = (1 - bucket.tokens) / refillRatePerMs;
      const err = new Error("Rate limit exceeded.");
      (err as { data?: { code: string; retryAfterMs: number } }).data = {
        code: "RATE_LIMITED",
        retryAfterMs: Math.ceil(retryAfterMs),
      };
      nextEvent(err);
    });

    next();
  };
}
