import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';

const router = Router();

/**
 * @route GET /analytics/:shortKey
 * @desc Get analytics data for a specific short URL
 * @access Public
 */
router.get('/:shortKey', getAnalytics);

export default router;