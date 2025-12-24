import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit("my-rate-limit")

        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later" });
        }

        next();
    } catch (error) {
        // Log the error but don't block requests if rate limiter fails
        // This prevents the entire API from breaking due to Redis connection issues
        console.error("Rate limit error (allowing request to proceed):", error.message);
        // Continue to the next middleware/route instead of failing
        next();
    }
}

export default rateLimiter;