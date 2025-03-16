import { AnalyticsEntry, AnalyticsResponse } from '../interfaces/analytics.interface';
import { UrlStorage } from '../utils/storage';
import { LocalStorage } from 'node-localstorage';

export class AnalyticsService {
    constructor(private storage: UrlStorage) { }

    /**
     * Getting filtered analytics data
     * @param filters Filter criteria
     * @returns Processed analytics response
     */
    getAnalytics(filters: {
        shortKey?: string;
        startDate?: Date;
        endDate?: Date;
    } = {}): AnalyticsResponse {
        let entries = this.storage.getAnalytics();

        // Apply filters
        if (filters.shortKey) {
            entries = entries.filter(entry => entry.shortKey === filters.shortKey);
        }

        if (filters.startDate) {
            entries = entries.filter(entry =>
                new Date(entry.timestamp) >= filters.startDate!
            );
        }

        if (filters.endDate) {
            entries = entries.filter(entry =>
                new Date(entry.timestamp) <= filters.endDate!
            );
        }

        return {
            count: entries.length,
            results: entries
        };
    }

    /**
     * Getting click statistics for a specific short URL
     * @param shortKey URL identifier
     * @returns Aggregated statistics
     */
    getClickStats(shortKey: string): {
        totalClicks: number;
        lastClicked?: Date;
        browsers: Record<string, number>;
    } {
        const entries = this.storage.getAnalytics()
            .filter(entry => entry.shortKey === shortKey);

        if (entries.length === 0) {
            return { totalClicks: 0, browsers: {} };
        }

        const browsers: Record<string, number> = {};
        let lastClicked: Date | undefined;

        entries.forEach(entry => {
            // Track browser usage
            const browser = this.parseBrowser(entry.userAgent);
            browsers[browser] = (browsers[browser] || 0) + 1;

            // Track last click
            const clickDate = new Date(entry.timestamp);
            if (!lastClicked || clickDate > lastClicked) {
                lastClicked = clickDate;
            }
        });

        return {
            totalClicks: entries.length,
            lastClicked,
            browsers
        };
    }

    /**
     * Parsing browser from user agent string
     * @param userAgent User agent string
     * @returns Browser name
     */
    private parseBrowser(userAgent?: string): string {
        if (!userAgent) return 'Unknown';

        const matches = userAgent.match(
            /(chrome|safari|firefox|msie|trident|edge|opera|opr)\/?\s*(\d+)/i
        );

        return matches ? matches[1].toLowerCase() : 'Unknown';
    }

    /**
     * Getting all unique short keys with click counts
     */
    getAllTrackedUrls(): Array<{
        shortKey: string;
        originalUrl: string | undefined;
        clickCount: number;
    }> {
        const entries = this.storage.getAnalytics();
        const urlEntries = this.storage.getUrls();
        const urlMap = new Map<string, { count: number; url: string | undefined }>();

        // First, we populate the map with URLs from the URL storage
        urlEntries.forEach(urlEntry => {
            urlMap.set(urlEntry.shortKey, {
                count: 0,
                url: urlEntry.originalUrl
            });
        });

        // Then we count the clicks from analytics
        entries.forEach(entry => {
            const shortKey = entry.shortKey;
            const existing = urlMap.get(shortKey) || { count: 0, url: undefined };

            urlMap.set(shortKey, {
                count: existing.count + 1,
                url: existing.url
            });
        });

        return Array.from(urlMap.entries()).map(([shortKey, data]) => ({
            shortKey,
            originalUrl: data.url,
            clickCount: data.count
        }));
    }
}

// Creating and exporting a singleton instance
const storagePath = './storage';
const localStorage = new LocalStorage(storagePath);
export const analyticsService = new AnalyticsService(new UrlStorage(localStorage));
