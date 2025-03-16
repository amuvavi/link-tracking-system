import { LocalStorage } from 'node-localstorage';
import { UrlEntry } from '../interfaces/url.interface';
import { AnalyticsEntry } from '../interfaces/analytics.interface';
import crypto from 'crypto';

export class UrlStorage {
    private localStorage: LocalStorage;
    private urlKey = 'url_entries';
    private analyticsKey = 'analytics_entries';

    constructor(localStorage: LocalStorage) {
        this.localStorage = localStorage;
        this.initializeStorage();
    }

    private initializeStorage() {
        if (!this.localStorage.getItem(this.urlKey)) {
            this.localStorage.setItem(this.urlKey, JSON.stringify([]));
        }
        if (!this.localStorage.getItem(this.analyticsKey)) {
            this.localStorage.setItem(this.analyticsKey, JSON.stringify([]));
        }
    }

    // URL methods
    saveUrl(entry: UrlEntry): string {
        const entries = this.getUrls();
        const existingEntry = entries.find(e => e.shortKey === entry.shortKey);
        if (!existingEntry) {
            entries.push(entry);
            this.localStorage.setItem(this.urlKey, JSON.stringify(entries));
        }
        return entry.shortKey;
    }

    getUrls(): UrlEntry[] {
        return JSON.parse(this.localStorage.getItem(this.urlKey) || '[]');
    }

    getUrl(shortKey: string): UrlEntry | undefined {
        return this.getUrls().find(entry => entry.shortKey === shortKey);
    }

    // Analytics methods
    public trackClick(shortKey: string, data: AnalyticsEntry): void {
        const entries = this.getAnalytics();
        entries.push({
            ...data,
            timestamp: new Date().toISOString()
        });
        this.localStorage.setItem(this.analyticsKey, JSON.stringify(entries));
    }

    getAnalytics(): AnalyticsEntry[] {
        return JSON.parse(this.localStorage.getItem(this.analyticsKey) || '[]');
    }

    private generateShortKey(url: string): string {
        return crypto.createHash('sha256').update(url).digest('hex').substring(0, 8);
    }
}