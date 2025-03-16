import { Request, Response, NextFunction } from 'express';
import { HtmlProcessorService } from '../services/html-processor.service';
import { UrlStorage } from '../utils/storage';
import { LocalStorage } from 'node-localstorage';

const storagePath = './storage';
const localStorage = new LocalStorage(storagePath);
const storage = new UrlStorage(localStorage);
const htmlProcessor = new HtmlProcessorService(storage);

export const processHtml = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { html } = req.body;

        if (!html || typeof html !== 'string') {
            res.status(400).json({
                error: 'Invalid request body - HTML content required'
            });
            return;
        }

        // Processing HTML
        const processedHtml = htmlProcessor.processHtml(html);

        res.set('Content-Type', 'text/html');
        res.status(200).send(processedHtml);
    } catch (error) {
        next(error);
    }
};