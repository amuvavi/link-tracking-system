import { Router } from 'express';
import { processHtml } from '../controllers/html-processor.controller';

const router = Router();

/**
 * @route POST /process/html
 * @desc Process HTML content and replace URLs
 * @access Public
 * @body { html: string } - Raw HTML content to process
 */
router.post('/html', processHtml);

export default router;