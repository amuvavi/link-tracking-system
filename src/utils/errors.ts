export class HttpError extends Error {
    public statusCode: number;
    public code: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = this.getCode(statusCode);
        Error.captureStackTrace(this, this.constructor);
    }

    private getCode(statusCode: number): string {
        switch (statusCode) {
            case 400:
                return 'BAD_REQUEST';
            case 401:
                return 'UNAUTHORIZED';
            case 403:
                return 'FORBIDDEN';
            case 404:
                return 'NOT_FOUND';
            case 500:
                return 'INTERNAL_SERVER_ERROR';
            default:
                return 'HTTP_ERROR';
        }
    }
}