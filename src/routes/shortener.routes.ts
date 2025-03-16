import { Router } from 'express';
import { shortenUrl, redirectUrl } from '../controllers/shortener.controller';

const router = Router();

router.post('/shorten', shortenUrl);
router.get('/:shortKey', redirectUrl);

export default router;