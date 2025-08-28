// stt-route.js
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// ----- Simple rate limit -----
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, slow down.' },
});
router.use(limiter);

// ----- Multer storage -----
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp3',
      'audio/mp4', 'audio/m4a', 'video/mp4'
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported audio type.'));
  },
});

// ----- Helper -----
const safeUnlink = (p) => fs.promises.unlink(p).catch(() => {});

// ----- Route -----
router.post('/stt', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Missing audio file (field name: audio).' });

  const filePath = req.file.path;
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    await safeUnlink(filePath);
    return res.status(500).json({ error: 'Missing GROQ_API_KEY in server env.' });
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('model', 'whisper-large-v3-turbo');
  form.append('response_format', 'json');
  form.append('temperature', '0');

  const controller = new AbortController();
  const timeoutMs = 60_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        ...form.getHeaders(),
      },
      body: form,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`STT provider error: ${resp.status} ${txt}`);
    }

    const data = await resp.json();
    console.log("🟢 STT RAW RESPONSE ===>", data);

    await safeUnlink(filePath);

    // Fallback parsing
    const transcript =
      data?.text?.trim() ||
      data?.results?.[0]?.alternatives?.[0]?.transcript?.trim() ||
      (Array.isArray(data?.segments) ? data.segments.map(s => s.text).join(" ") : "") ||
      "";

    res.json({ transcript, raw: data });
  } catch (err) {
    clearTimeout(timeout);
    await safeUnlink(filePath);
    console.error('STT error:', err?.message || err);
    if (err.name === 'AbortError') return res.status(504).json({ error: 'STT provider timed out.' });
    return res.status(502).json({ error: 'Failed to transcribe audio.', details: err.message });
  }
});

export default router;
