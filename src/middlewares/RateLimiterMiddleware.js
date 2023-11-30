import { rateLimit } from "express-rate-limit";

const MAX_REQUESTS_PER_MINUTE = 200;

const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  limit: MAX_REQUESTS_PER_MINUTE,
  message: `You have exceeded your ${MAX_REQUESTS_PER_MINUTE} requests per minute limit.`,
});

export { rateLimitMiddleware };
