// api/index.js — Vercel Serverless Entry Point
// Wraps the Express app for Vercel's serverless runtime

require('dotenv').config({ path: '../backend/.env' });

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes     = require('../backend/routes/auth');
const progressRoutes = require('../backend/routes/progress');
const chatRoutes     = require('../backend/routes/chat');

const app = express();

app.use(cors({ origin: '*', credentials: true, methods: ['GET','POST','DELETE','OPTIONS'] }));
app.use(express.json({ limit: '1mb' }));

// API routes
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

module.exports = app;
