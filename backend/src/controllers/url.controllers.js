import { Url } from '../models/url.models.js';
import { nanoid } from 'nanoid';
import geoip from 'geoip-lite';

const HOST = process.env.HOST || 'http://localhost';
const PORT = process.env.PORT || 5000;
const BASE_URL = `${HOST}:${PORT}`;


export const createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Original URL is required.' });
    }

    let finalShortcode = shortcode || nanoid(6);

    const existing = await Url.findOne({ shortCode: finalShortcode });
    if (existing) {
      return res.status(409).json({ error: 'Shortcode already exists.' });
    }


    const now = new Date();
    const expiresAt = new Date(now.getTime() + validity * 60000);

    const newUrl = new Url({
      originalUrl: url,
      shortCode: finalShortcode,
      createdAt: now,
      expiresAt,
      clicks: [],
    });

    await newUrl.save();

    return res.status(201).json({
      shortLink: `${BASE_URL}/${finalShortcode}`,
      expiry: expiresAt.toISOString(),
    });

  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const record = await Url.findOne({ shortCode: shortcode });

    if (!record) {
      return res.status(404).json({ error: 'Shortcode not found.' });
    }

    if (new Date() > record.expiresAt) {
      return res.status(410).json({ error: 'Short URL has expired.' });
    }

  
    const referrer = req.get('Referer') || 'Direct';
    const ip = req.ip;
    const geo = geoip.lookup(ip)?.country || 'Unknown';

    record.clicks.push({
      timestamp: new Date(),
      referrer,
      geo,
    });

    await record.save();

    return res.redirect(record.originalUrl);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getUrlStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const record = await Url.findOne({ shortCode: shortcode });

    if (!record) {
      return res.status(404).json({ error: 'Shortcode not found.' });
    }

    const stats = {
      originalUrl: record.originalUrl,
      createdAt: record.createdAt.toISOString(),
      expiresAt: record.expiresAt.toISOString(),
      totalClicks: record.clicks.length,
      clickDetails: record.clicks.map(click => ({
        timestamp: click.timestamp,
        referrer: click.referrer,
        geo: click.geo,
      })),
    };

    return res.status(200).json(stats);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
