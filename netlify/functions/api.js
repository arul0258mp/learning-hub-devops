// netlify/functions/api.js — Netlify Serverless Function
// Wraps the entire Express app for Netlify Functions

const serverless = require('serverless-http');
const express    = require('express');
const cors       = require('cors');
const path       = require('path');

// Load .env if present
try { require('dotenv').config({ path: path.join(__dirname, '../../backend/.env') }); } catch {}

const authRoutes     = require('../../backend/routes/auth');
const progressRoutes = require('../../backend/routes/progress');
const chatRoutes     = require('../../backend/routes/chat');

const app = express();

app.use(cors({ origin: '*', credentials: true, methods: ['GET','POST','DELETE','OPTIONS'] }));
app.use(express.json({ limit: '1mb' }));

// Mount under /.netlify/functions/api prefix
app.use('/api/auth',     authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat',     chatRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    backend:   'running',
    groqProxy: !!process.env.GROQ_API_KEY ? 'active' : 'inactive'
  });
});

module.exports.handler = serverless(app);
