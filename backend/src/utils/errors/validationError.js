import AppError from './AppError.js';

class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = {}) {
        super(message, 400, { errors });
        this.name = 'ValidationError';
    }
}

export default ValidationError;
