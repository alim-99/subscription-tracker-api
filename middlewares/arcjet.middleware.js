import aj from '../config/arcjet.js';

const arcjetMiddleware =  async (req, res, next) => {
  try {
    const descision = await aj.protect(req, {requested: 1});

    if(descision.isDenied()) {
      if (descision.reason.isRateLimit()) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
      if (descision.reason.isBot()) {
        return res.status(403).json({ error: 'Bot detected' });
      }

      return res.status(403).json({ error: 'Access denied' });
    }

    next();

  } catch(error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    next(error);
  }
}

export default arcjetMiddleware;