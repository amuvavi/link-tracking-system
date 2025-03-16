import { Request, Response, NextFunction } from 'express';

// Unified HttpError class
export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
        public code?: string,
        public details?: any
    ) {
        super(message);
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

// Error handling middleware
export const errorMiddleware = (
    error: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Set default values
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const code = error.code || 'INTERNAL_SERVER_ERROR';

    // Log the error in development
    if (process.env.NODE_ENV === 'development') {
        console.error(`[${new Date().toISOString()}] Error:`, {
            path: req.path,
            method: req.method,
            status,
            message,
            stack: error.stack
        });
    }

    // Construct error response
    const errorResponse: Record<string, any> = {
        error: code,
        message: message
    };

    // Add validation errors if present
    if (error.details) {
        errorResponse.details = error.details;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
    }

    res.status(status).json(errorResponse);
};

// Common error types
export const ERRORS = {
    NOT_FOUND: (message = 'Resource not found') =>
        new HttpError(404, message, 'NOT_FOUND'),
    VALIDATION_ERROR: (details: any) =>
        new HttpError(422, 'Validation failed', 'VALIDATION_ERROR', details),
    BAD_REQUEST: (message = 'Invalid request') =>
        new HttpError(400, message, 'BAD_REQUEST'),
    INTERNAL_ERROR: (message = 'Internal server error') =>
        new HttpError(500, message, 'INTERNAL_ERROR')
};