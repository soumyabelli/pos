import express from 'express';
import Setting from '../models/Setting.js';
import { authMiddleware, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

async function getOrCreateSettings() {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  return settings;
}

router.get('/', authMiddleware, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const nextSettings = {
      storeName: req.body.storeName ?? settings.storeName,
      currency: req.body.currency ?? settings.currency,
      taxRate: Number(req.body.taxRate ?? settings.taxRate)
    };

    const updated = await Setting.findByIdAndUpdate(settings._id, nextSettings, { new: true });
    res.json({ message: 'Settings updated', settings: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
