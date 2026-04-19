// ============================================================
//  ROUTES/CHAT.JS — Gemini AI proxy
//  Keeps your API key on the server, away from the browser.
// ============================================================

const express = require('express');
const fetch   = require('node-fetch');

const { verifyToken } = require('../middleware/auth');

const router      = express.Router();
const GEMINI_URL  = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// ============================================================
//  POST /api/chat
//  Body: { message, course, subtopic }
//  Proxies the request to Gemini using the server .env key.
//  Returns: { text }
// ============================================================
router.post('/', verifyToken, async (req, res) => {
  const { message, course, subtopic } = req.body;

  if (!message || !message.trim())
    return res.status(400).json({ error: 'Message is required.' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    // 503 tells the frontend to fall back to the user's client-side key
    return res.status(503).json({
      error: 'Server Gemini API key not configured. Set GEMINI_API_KEY in backend/.env, or enter your key in the UI.'
    });
  }

  // ---- Build system prompt ----
  const courseName   = course   || 'the selected course';
  const subtopicName = subtopic || 'the current topic';

  const systemPrompt =
    `You are StudyBot, an expert AI tutor teaching "${courseName}" — specifically the topic "${subtopicName}". ` +
    `Explain concepts in simple, clear, beginner-friendly language. Use analogies when helpful. ` +
    `Format responses with clear structure. Use markdown-style formatting: **bold**, \`code\`, bullet points. ` +
    `Keep responses focused and educational. ` +
    `If asked something outside the current topic, gently redirect to the course material.`;

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents:           [{ role: 'user', parts: [{ text: message.trim() }] }],
    generationConfig:   { temperature: 0.7, maxOutputTokens: 1024 }
  };

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      timeout: 30000   // 30 s timeout
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.json().catch(() => ({}));
      const errMsg  = errBody?.error?.message || `Gemini API error (${geminiRes.status})`;
      console.error('Gemini error:', errMsg);
      return res.status(geminiRes.status >= 500 ? 502 : geminiRes.status).json({ error: errMsg });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
                 || 'Sorry, I could not generate a response.';

    res.json({ text });

  } catch (err) {
    console.error('Chat proxy error:', err.message);
    res.status(500).json({ error: 'Failed to reach Gemini API. Check server network connection.' });
  }
});

module.exports = router;
