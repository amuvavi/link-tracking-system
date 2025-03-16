import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../middleware/error.middleware';
import { ShortenerService } from '../services/shortener.service';
import { UrlStorage } from '../utils/storage';
import { LocalStorage } from 'node-localstorage';
import { ShortenResponse } from '../interfaces/url.interface';

// Initialize dependencies
const storagePath = './storage';
const localStorage = new LocalStorage(storagePath);
const storage = new UrlStorage(localStorage);
const shortenerService = new ShortenerService(storage);

export const shortenUrl = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { url } = req.body;

        if (!url) {
            throw new HttpError(400, 'URL is required');
        }

        const shortKey = shortenerService.shortenUrl(url);
        const response: ShortenResponse = {
            originalUrl: url,
            shortUrl: `http://localhost:3000/${shortKey}`
        };
        res.status(201).json(response);
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        } else if (error instanceof Error) {
            next(new HttpError(400, error.message));
        } else {
            next(new HttpError(500, 'Internal server error'));
        }
    }
};

export const redirectUrl = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { shortKey } = req.params;
        const urlEntry = storage.getUrl(shortKey);

        if (!urlEntry) {
            throw new HttpError(404, 'URL not found');
        }

        storage.trackClick(shortKey, {
            shortKey,
            userAgent: req.headers['user-agent'] || '',
            ipAddress: req.ip,
            originalUrl: urlEntry.originalUrl,
            timestamp: new Date().toISOString()
        });

        res.redirect(urlEntry.originalUrl);
    } catch (error) {
        if (error instanceof HttpError) {
            next(error);
        } else if (error instanceof Error) {
            next(new HttpError(400, error.message));
        } else {
            next(new HttpError(500, 'Internal server error'));
        }
    }
};