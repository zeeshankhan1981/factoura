/**
 * Base application error class
 */
class AppError extends Error {
    constructor(message, statusCode, details = {}) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
        this.details = details;
        this.isOperational = true;
        
        // Capture stack trace, excluding constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
