// ============================================================
//  SERVER.JS — Study Bot AI Assistant Backend
//  Express server: auth, progress, Groq AI proxy
// ============================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const express = require('express');
const cors    = require('cors');


const authRoutes     = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const chatRoutes     = require('./routes/chat');

const app  = express();
const PORT = process.env.PORT || 3001;

// ============================================================
//  Middleware
// ============================================================
app.use(cors({
  origin:      process.env.FRONTEND_URL || '*',
  credentials: true,
  methods:     ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================================
//  Serve frontend static files
//  When you open http://localhost:3001 it serves your HTML app
// ============================================================
app.use(express.static(path.join(__dirname, '..')));

// ============================================================
//  API Routes
// ============================================================
app.use('/api/auth',     authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat',     chatRoutes);

// ---- Health check ----
app.get('/api/health', (_req, res) => {
  const hasGroqKey = !!process.env.GROQ_API_KEY &&
                     process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    backend:   'running',
    groqProxy: hasGroqKey ? 'active' : 'inactive'
  });
});

// ---- Catch-all: serve index.html for any non-API route ----
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found.' });
  }
});

// ============================================================
//  Global Error Handler
// ============================================================
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

// ============================================================
//  Start
// ============================================================
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   🤖  Study Bot AI Assistant — Backend       ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║   🌐  Frontend : http://localhost:${PORT}        ║`);
  console.log(`║   🔌  API Base : http://localhost:${PORT}/api    ║`);
  console.log(`║   💚  Health   : http://localhost:${PORT}/api/health ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  const hasGroqKey = process.env.GROQ_API_KEY &&
                     process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
  if (hasGroqKey) {
    console.log('✅ Groq API key is configured (server-side proxy active)');
  } else {
    console.log('⚠️  Groq API key NOT set — users will need to enter their own key in the UI.');
    console.log('   Set GROQ_API_KEY in backend/.env to enable server-side proxying.');
  }
  console.log('');
});
