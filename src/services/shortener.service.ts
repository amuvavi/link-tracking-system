import { UrlEntry, ShortenResponse } from '../interfaces/url.interface';
import { UrlStorage } from '../utils/storage';
import crypto from 'crypto';

export class ShortenerService {
    constructor(private storage: UrlStorage) { }

    /**
     * Creating or retrieving existing shortened URL
     * @param originalUrl URL to shorten
     * @returns ShortenResponse with original and shortened URL
     */
    public shortenUrl(originalUrl: string): string {
        const shortKey = this.generateShortKey(originalUrl);
        const urlEntry: UrlEntry = {
            originalUrl,
            shortKey,
            createdAt: new Date().toISOString() // Ensuring createdAt is a string
        };
        this.storage.saveUrl(urlEntry);
        return shortKey;
    }

    /**
     * Retrieving original URL from short key
     * @param shortKey Short URL identifier
     * @returns Original URL or null if not found
     */
    getOriginalUrl(shortKey: string): string | null {
        const entry = this.storage.getUrl(shortKey);
        return entry?.originalUrl || null;
    }

    /**
     * Checking if a URL already exists in storage
     * @param url URL to check
     * @returns Existing short key if found
     */
    urlExists(url: string): string | null {
        const entry = this.storage.getUrls().find(entry =>
            entry.originalUrl === url
        );
        return entry?.shortKey || null;
    }

    private generateShortKey(url: string): string {
        return crypto.createHash('sha256')
            .update(url)
            .digest('hex')
            .substring(0, 8);
    }
}