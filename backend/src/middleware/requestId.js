import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to generate a unique request ID for each incoming request
 * and attach it to the request and response objects
 */
const requestId = (req, res, next) => {
    // Use the X-Request-ID header if it exists, otherwise generate a new UUID
    const requestId = req.headers['x-request-id'] || uuidv4();
    
    // Add request ID to the request object
    req.id = requestId;
    
    // Add request ID to the response headers
    res.setHeader('X-Request-ID', requestId);
    
    next();
};

export default requestId;
