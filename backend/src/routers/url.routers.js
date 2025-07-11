import express from 'express';
import {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlStats,
} from '../controllers/url.controllers.js';

const router = express.Router();

// ---------------- API Routes ---------------- //

// Create a new short URL
// POST /api/shorturls
router.post('/shorturls', createShortUrl);

// Get stats for a short URL
// GET /api/shorturls/:shortcode
router.get('/shorturls/:shortcode', getUrlStats);

// ---------------- Redirect Route (Root Level) ---------------- //

// Redirect user to original URL
// GET /:shortcode
router.get('/:shortcode', redirectToOriginalUrl);

export default router;
