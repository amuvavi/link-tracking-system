import { HttpError } from './errors';
import crypto from 'crypto';
import { AnalyticsEntry } from '../interfaces/analytics.interface';

export interface NormalizedError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

/**
 * Generates a short key for a given URL.
 * @param url - The URL to generate a short key for.
 * @returns A short key.
 */
export function generateShortKey(url: string): string {
    return crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
}

/**
 * Validates if a given URL is a valid HTTP or HTTPS URL.
 * @param url - The URL to validate.
 * @returns True if the URL is valid, false otherwise.
 */
export function validateUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Parses the user agent string to detect the browser.
 * @param userAgent - The user agent string.
 * @returns The name of the browser.
 */
export function parseBrowser(userAgent?: string): string {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
}

/**
 * Format timestamp for analytics display
 * @param entry Analytics entry
 * @returns Human-readable date string
 */
export const formatAnalyticsDate = (entry: AnalyticsEntry): string => {
    return new Date(entry.timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
};

/**
 * Normalizes an error object to a standard format.
 * @param error - The error object.
 * @returns The normalized error object.
 */
export function normalizeError(error: any): { code: string; message: string } {
    if (error instanceof HttpError) {
        return {
            code: error.code,
            message: error.message
        };
    }
    if (error instanceof Error) {
        return {
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message
        };
    }
    return {
        code: 'UNEXPECTED_ERROR',
        message: 'An unexpected error occurred'
    };
}

/**
 * Sanitizes a URL by removing fragments and trailing slashes.
 * @param url - The URL to sanitize.
 * @returns The sanitized URL.
 * @throws HttpError if the URL is invalid.
 */
export function sanitizeUrl(url: string): string {
    try {
        const parsedUrl = new URL(url);
        parsedUrl.hash = '';
        return parsedUrl.toString().replace(/\/+$/, '');
    } catch {
        throw new HttpError(400, 'Invalid URL format');
    }
}

/**
 * Generate unique identifier
 * @param length Desired ID length
 * @returns Random alphanumeric string
 */
export const generateUniqueId = (length = 12): string => {
    return crypto.randomBytes(length)
        .toString('base64')
        .replace(/[+/=]/g, '')
        .substring(0, length);
};
