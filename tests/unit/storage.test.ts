import { LocalStorage } from 'node-localstorage';
import { UrlStorage } from '../../src/utils/storage';
import { UrlEntry } from '../../src/interfaces/url.interface';
import { AnalyticsEntry } from '../../src/interfaces/analytics.interface';
import { v4 as uuidv4 } from 'uuid';

describe('UrlStorage', () => {
    let storage: UrlStorage;
    let testStorage: LocalStorage;
    const TEST_STORAGE_PATH = `./test-storage-${uuidv4()}`;

    beforeAll(() => {
        testStorage = new LocalStorage(TEST_STORAGE_PATH);
        storage = new UrlStorage(testStorage);
    });

    afterAll(() => {
        testStorage.clear();
    });

    beforeEach(() => {
        testStorage.clear();
    });

    describe('URL Storage', () => {
        const testEntry: UrlEntry = {
            originalUrl: 'https://example.com',
            shortKey: 'abcd1234',
            createdAt: new Date().toISOString()
        };

        it('should save and retrieve URLs', () => {
            storage.saveUrl(testEntry);
            const urls = storage.getUrls();
            expect(urls).toHaveLength(1);
            expect(urls[0]).toEqual(testEntry);
        });

        it('should handle duplicate entries', () => {
            storage.saveUrl(testEntry);
            storage.saveUrl(testEntry);
            expect(storage.getUrls()).toHaveLength(1);
        });
    });

    describe('Analytics Storage', () => {
        const testClick: AnalyticsEntry = {
            shortKey: 'abcd1234',
            originalUrl: 'https://example.com',
            timestamp: new Date().toISOString(),
            ipAddress: '192.168.1.1',
            userAgent: 'TestAgent/1.0'
        };

        it('should track clicks', () => {
            storage.trackClick(testClick.shortKey, testClick);
            expect(storage.getAnalytics()).toHaveLength(1);
        });

        it('should handle multiple clicks', () => {
            const testClick2: AnalyticsEntry = {
                shortKey: 'abcd1234',
                originalUrl: 'https://example.com',
                timestamp: new Date().toISOString(),
                ipAddress: '192.168.1.2',
                userAgent: 'TestAgent/1.0'
            };
            storage.trackClick(testClick.shortKey, testClick);
            storage.trackClick(testClick2.shortKey, testClick2);
            const analytics = storage.getAnalytics();
            expect(analytics).toHaveLength(2);
            expect(analytics[0]).toMatchObject({
                ...testClick,
                timestamp: expect.any(String) // Allowing any string for timestamp
            });
            expect(analytics[1]).toMatchObject({
                ...testClick2,
                timestamp: expect.any(String) // Allowing any string for timestamp
            });
        });
    });
});