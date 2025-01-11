require('dotenv').config();

const config = {
    mongodb: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/school_management'
    },
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-key'
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    },
    rateLimit: {
        windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
        max: process.env.RATE_LIMIT_MAX || 100
    }
};

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file');
    process.exit(1);
}

module.exports = config;
