import {
    generateShortKey,
    validateUrl,
    parseBrowser,
    normalizeError,
    sanitizeUrl
} from '../../src/utils/helpers';
import { HttpError } from '../../src/utils/errors';

describe('URL Helpers', () => {
    describe('generateShortKey()', () => {
        it('should generate 8-character hex string', () => {
            const url = 'https://example.com';
            const key = generateShortKey(url);
            expect(key).toHaveLength(8);
            expect(key).toMatch(/^[a-f0-9]{8}$/);
        });

        it('should produce same key for identical URLs', () => {
            const url1 = 'https://example.com/path?query=1';
            const url2 = 'https://example.com/path?query=1';
            expect(generateShortKey(url1)).toEqual(generateShortKey(url2));
        });

        it('should produce different keys for different URLs', () => {
            const url1 = 'https://example.com/1';
            const url2 = 'https://example.com/2';
            expect(generateShortKey(url1)).not.toEqual(generateShortKey(url2));
        });
    });

    describe('validateUrl()', () => {
        it('should accept valid HTTP URLs', () => {
            expect(validateUrl('http://example.com')).toBe(true);
            expect(validateUrl('https://sub.example.com/path?q=1')).toBe(true);
        });

        it('should reject invalid URLs', () => {
            expect(validateUrl('ftp://example.com')).toBe(false);
            expect(validateUrl('javascript:alert(1)')).toBe(false);
        });
    });

    describe('parseBrowser()', () => {
        it('should detect common browsers', () => {
            const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
            expect(parseBrowser(chromeUA)).toBe('Chrome');

            const firefoxUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0';
            expect(parseBrowser(firefoxUA)).toBe('Firefox');
        });

        it('should return Unknown for missing/unrecognized UA', () => {
            expect(parseBrowser()).toBe('Unknown');
            expect(parseBrowser('curl/7.68.0')).toBe('Unknown');
        });
    });

    describe('normalizeError()', () => {
        it('should handle HttpError instances', () => {
            const error = new HttpError(404, 'Not found');
            const result = normalizeError(error);
            expect(result).toEqual({
                code: 'NOT_FOUND',
                message: 'Not found'
            });
        });

        it('should handle generic errors', () => {
            const error = new Error('Something went wrong');
            const result = normalizeError(error);
            expect(result).toEqual({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong'
            });
        });

        it('should handle non-Error objects', () => {
            const result = normalizeError('Something broke');
            expect(result).toEqual({
                code: 'UNEXPECTED_ERROR',
                message: 'An unexpected error occurred'
            });
        });
    });

    describe('sanitizeUrl()', () => {
        it('should remove fragments and trailing slashes', () => {
            expect(sanitizeUrl('https://example.com/path/#anchor'))
                .toBe('https://example.com/path');
            expect(sanitizeUrl('https://example.com//'))
                .toBe('https://example.com');
        });

        it('should throw for invalid URLs', () => {
            expect(() => sanitizeUrl('not-a-url')).toThrow(HttpError);
        });
    });
});