const rateLimit = require('express-rate-limit');

module.exports = ({ meta, config, managers }) => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: {
            error: 'Too many requests from this IP, please try again later.',
            code: 429
        }
    });

    return limiter;
}; 