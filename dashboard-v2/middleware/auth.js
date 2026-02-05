/**
 * Authentication middleware
 * Supports token-based auth for sensitive endpoints
 */

const requireAuth = (req, res, next) => {
  const authToken = process.env.AUTH_TOKEN;
  
  // If no auth token is configured, skip authentication
  if (!authToken) {
    return next();
  }
  
  // Check for token in header or query
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  
  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide a valid token'
    });
  }
  
  if (token !== authToken) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid authentication token'
    });
  }
  
  next();
};

const optionalAuth = (req, res, next) => {
  const authToken = process.env.AUTH_TOKEN;
  
  // If no auth token is configured, skip authentication
  if (!authToken) {
    req.authenticated = false;
    return next();
  }
  
  // Check for token
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  
  if (token && token === authToken) {
    req.authenticated = true;
  } else {
    req.authenticated = false;
  }
  
  next();
};

// Rate limiting helper (simple in-memory implementation)
const rateLimitStore = new Map();

const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const record = rateLimitStore.get(key);
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }
    
    record.count++;
    next();
  };
};

module.exports = {
  requireAuth,
  optionalAuth,
  rateLimit
};
