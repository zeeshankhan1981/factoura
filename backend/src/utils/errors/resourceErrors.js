import AppError from './AppError.js';

class ResourceNotFoundError extends AppError {
    constructor(resource, id) {
        const message = id 
            ? `${resource} with ID ${id} not found`
            : `${resource} not found`;
        super(message, 404);
        this.name = 'ResourceNotFoundError';
    }
}

class RateLimitError extends AppError {
    constructor(retryAfter, message = 'Too many requests') {
        super(message, 429);
        this.name = 'RateLimitError';
        this.retryAfter = retryAfter;
    }
}

export { ResourceNotFoundError, RateLimitError };
