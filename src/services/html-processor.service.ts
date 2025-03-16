import { JSDOM } from 'jsdom';
import { UrlStorage } from '../utils/storage';
import crypto from 'crypto';

export class HtmlProcessorService {
    constructor(private storage: UrlStorage) { }

    public processHtml(html: string): string {
        const dom = new JSDOM(html);
        const document = dom.window.document;

        document.querySelectorAll('a').forEach(anchor => {
            const originalUrl = anchor.href;
            if (this.isValidUrl(originalUrl)) {
                const shortKey = this.generateShortKey(originalUrl);

                if (!this.storage.getUrl(shortKey)) {
                    this.storage.saveUrl({
                        originalUrl,
                        shortKey,
                        createdAt: new Date().toISOString()
                    });
                }

                anchor.href = `http://localhost:3000/${shortKey}`;
            }
        });

        return dom.serialize();
    }

    private isValidUrl(url: string): boolean {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    }

    private generateShortKey(url: string): string {
        return crypto.createHash('sha256').update(url).digest('hex').substring(0, 8);
    }
}