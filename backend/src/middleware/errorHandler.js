import { 
    ValidationError, 
    AuthenticationError, 
    AuthorizationError, 
    ResourceNotFoundError, 
    RateLimitError 
} from '../utils/errors/index.js';
import logger from '../utils/logger.js';

/**
 * Centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    // Generate a unique error ID for tracking
    const errorId = Date.now().toString(36);
    
    // Log the error with request context
    const errorContext = {
        errorId,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id,
        params: req.params,
        query: req.query,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
    };

    // Handle specific error types
    if (err instanceof ValidationError) {
        logger.warn(`Validation Error: ${err.message}`, { 
            ...errorContext, 
            details: err.details || {}
        });
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            errorId
        });
    }

    if (err instanceof AuthenticationError) {
        logger.warn(`Authentication Error: ${err.message}`, errorContext);
        return res.status(401).json({
            error: 'Authentication Failed',
            message: err.message,
            errorId
        });
    }

    if (err instanceof AuthorizationError) {
        logger.warn(`Authorization Error: ${err.message}`, errorContext);
        return res.status(403).json({
            error: 'Forbidden',
            message: err.message,
            errorId
        });
    }

    if (err instanceof ResourceNotFoundError) {
        logger.warn(`Resource Not Found: ${err.message}`, errorContext);
        return res.status(404).json({
            error: 'Not Found',
            message: err.message,
            errorId
        });
    }

    if (err instanceof RateLimitError) {
        logger.warn(`Rate Limit Exceeded: ${err.message}`, {
            ...errorContext,
            retryAfter: err.retryAfter
        });
        return res.status(429).json({
            error: 'Too Many Requests',
            message: err.message,
            retryAfter: err.retryAfter,
            errorId
        });
    }

    // Handle database errors
    if (err.name === 'PrismaClientKnownRequestError') {
        logger.error(`Database Error (${err.code}): ${err.message}`, {
            ...errorContext,
            code: err.code,
            meta: err.meta,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        
        return res.status(500).json({
            error: 'Database Error',
            message: 'An error occurred while processing your request',
            errorId
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        logger.warn(`JWT Error: ${err.message}`, errorContext);
        return res.status(401).json({
            error: 'Invalid Token',
            message: 'Your session has expired or is invalid',
            errorId
        });
    }

    // Default error handler (500)
    logger.error(`Unhandled Error: ${err.message}`, { 
        ...errorContext, 
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        error: {
            name: err.name,
            message: err.message
        }
    });

    // In production, don't expose stack traces
    const errorResponse = {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        errorId
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(500).json(errorResponse);
};

/**
 * 404 handler middleware
 */
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    
    logger.warn(`404 Not Found: ${req.originalUrl}`, {
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
    });
    
    next(error);
};
