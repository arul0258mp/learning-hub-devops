// ============================================================
//  MIDDLEWARE/RATELIMIT.JS — Simple Daily Rate Limiter
//  Limits each user to 10 requests per 24 hours.
// ============================================================

const usageStore = {}; // In-memory store: { userId: { count: N, lastReset: timestamp } }

function dailyRateLimit(limit = 10) {
  return (req, res, next) => {
    const userId = req.user?.id || req.ip; // Fallback to IP if no user
    const now    = Date.now();
    const DAY    = 24 * 60 * 60 * 1000;

    if (!usageStore[userId]) {
      usageStore[userId] = { count: 0, lastReset: now };
    }

    const usage = usageStore[userId];

    // Reset if more than 24h passed
    if (now - usage.lastReset > DAY) {
      usage.count     = 0;
      usage.lastReset = now;
    }

    if (usage.count >= limit) {
      return res.status(429).json({
        error: `Daily limit reached (${limit} questions). Please try again tomorrow or add your own API key to remove this limit.`
      });
    }

    usage.count++;
    
    // Pass remaining count to headers
    res.setHeader('X-RateLimit-Remaining', limit - usage.count);
    
    next();
  };
}

module.exports = { dailyRateLimit };
