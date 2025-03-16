import { Request, Response, NextFunction } from 'express';
import { UrlStorage } from '../utils/storage';
import { LocalStorage } from 'node-localstorage';
import { AnalyticsEntry, AnalyticsResponse } from '../interfaces/analytics.interface';

const storagePath = './storage';
const localStorage = new LocalStorage(storagePath);
const storage = new UrlStorage(localStorage);

export const getAnalytics = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { shortKey } = req.params;
        const urlEntry = storage.getUrl(shortKey);

        if (!urlEntry) {
            res.status(404).json({ error: 'URL not found' });
            return;
        }

        const analyticsEntries = storage.getAnalytics().filter(entry => entry.shortKey === shortKey);
        const totalCount = analyticsEntries.length;

        const response: AnalyticsResponse = {
            count: totalCount,
            results: analyticsEntries,
            pagination: {
                page: 1,
                limit: totalCount,
                total: totalCount
            }
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
};