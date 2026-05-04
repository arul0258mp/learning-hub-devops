// ============================================================
//  ROUTES/CHAT.JS — Groq AI proxy
//  Keeps your API key on the server, away from the browser.
// ============================================================

const express = require('express');
const fetch   = require('node-fetch');

const { verifyToken }   = require('../middleware/auth');
const { dailyRateLimit } = require('../middleware/rateLimit');

const router      = express.Router();
const GROQ_URL    = 'https://api.groq.com/openai/v1/chat/completions';

// ============================================================
//  POST /api/chat
//  Body: { message, course, subtopic }
//  Proxies the request to Groq using the server .env key.
//  If no key is set, provides a Mock Demo response (limit 10/day).
// ============================================================
router.post('/', verifyToken, dailyRateLimit(10), async (req, res) => {
  const { message, course, subtopic } = req.body;

  if (!message || !message.trim())
    return res.status(400).json({ error: 'Message is required.' });

  const apiKey = process.env.GROQ_API_KEY;
  const model  = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const isMockMode = !apiKey || apiKey === 'your_groq_api_key_here';

  // ---- Build system prompt ----
  const courseName   = course   || 'the selected course';
  const subtopicName = subtopic || 'the current topic';

  const systemPrompt = `
    You are "StudyBot Elite", a world-class educational AI tutor. 
    Your mission is to help the student master "${courseName}", currently focusing on "${subtopicName}".

    Rules for Professional Interaction:
    1. STRUCTURE: Always use Markdown. Use # or ## for sections. Use tables for comparisons. Use code blocks for snippets.
    2. TONE: Professional, encouraging, and intellectual. Avoid slang.
    3. SOCRATIC METHOD: Instead of just giving the answer, occasionally ask a thought-provoking follow-up question to ensure understanding.
    4. ACCURACY: Be technically precise. If providing code, ensure it follows best practices.
    5. FOCUS: Stay strictly within the context of "${courseName}". If the user goes off-topic, politely pivot back to the lesson.
    6. CLARITY: Use bold text for key terms.

    Current context: The student is viewing the learning module for ${subtopicName}.
    Current server time: ${new Date().toLocaleString()}
  `.trim();


  // ---- Mock Mode Fallback ----
  if (isMockMode) {
    console.log(`[DEMO MODE] Processing message: "${message.substring(0, 40)}..."`);
    
    // Simulate a slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    const remaining = res.getHeader('X-RateLimit-Remaining');
    const mockText = `[DEMO MODE] 🤖 **Hello! I'm StudyBot (Groq Edition).**\n\n` +
      `I see you're asking about **${subtopicName}** in the context of **${courseName}**.\n\n` +
      `Since the server is currently in Demo Mode, I can't provide a real-time AI response for your specific question: _"${message}"_.\n\n` +
      `**To unlock my full Groq potential:**\n` +
      `1. Get a free API key at [console.groq.com](https://console.groq.com/keys)\n` +
      `2. Add it to the \`backend/.env\` file as \`GROQ_API_KEY\`.\n\n` +
      `*Remaining demo questions today: ${remaining}*`;
    
    return res.json({ text: mockText });
  }

  // ---- Real Groq Call (OpenAI-compatible) ----
  const payload = {
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message.trim() }
    ],
    temperature: 0.7,
    max_tokens: 1024
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const groqRes = await fetch(GROQ_URL, {
      method:  'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body:    JSON.stringify(payload),
      signal:  controller.signal
    });

    clearTimeout(timeoutId);

    if (!groqRes.ok) {
      const errBody = await groqRes.json().catch(() => ({}));
      const errMsg  = errBody?.error?.message || `Groq API error (${groqRes.status})`;
      console.error('[Groq API Error]', groqRes.status, errMsg);
      
      // Handle common Groq/OpenAI errors gracefully
      if (groqRes.status === 429) {
        return res.status(429).json({ error: 'Groq API rate limit reached. Please try again later.' });
      }
      if (groqRes.status === 401) {
        return res.status(503).json({ error: 'Server Groq API key is invalid.' });
      }

      return res.status(groqRes.status >= 500 ? 502 : 400).json({ error: errMsg });
    }

    const data = await groqRes.json();
    const text = data?.choices?.[0]?.message?.content
                 || 'I processed your request but couldn\'t generate a specific answer. Could you try rephrasing?';

    res.json({ text });

  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('❌ [Timeout] Groq API took too long to respond.');
      return res.status(504).json({ error: 'Groq AI took too long to respond. Please try again.' });
    }
    console.error('❌ [Groq Proxy Error]', err.message);
    res.status(500).json({ error: 'Failed to reach Groq AI service. Please check your server connection.' });
  }
});

module.exports = router;

