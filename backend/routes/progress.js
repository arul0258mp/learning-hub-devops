// ============================================================
//  ROUTES/PROGRESS.JS — Course progress tracking
// ============================================================

const express = require('express');
const fs      = require('fs');
const path    = require('path');

const { verifyToken } = require('../middleware/auth');

const router        = express.Router();
const PROGRESS_FILE = path.join(__dirname, '../data/progress.json');

// ---- File DB helpers ----
function ensureDataDir() {
  const dir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readAll() {
  ensureDataDir();
  if (!fs.existsSync(PROGRESS_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); }
  catch { return {}; }
}

function writeAll(data) {
  ensureDataDir();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

// ============================================================
//  GET /api/progress
//  Returns ALL course progress for the logged-in user.
// ============================================================
router.get('/', verifyToken, (req, res) => {
  const all          = readAll();
  const userProgress = all[req.user.id] || {};
  res.json(userProgress);
});

// ============================================================
//  GET /api/progress/:courseId
//  Returns progress for a single course.
// ============================================================
router.get('/:courseId', verifyToken, (req, res) => {
  const all            = readAll();
  const userProgress   = all[req.user.id] || {};
  const courseProgress = userProgress[req.params.courseId] || { completed: [], lastTopic: null };
  res.json(courseProgress);
});

// ============================================================
//  POST /api/progress/:courseId/complete
//  Body: { topicId: string }
//  Marks a topic as completed and updates lastTopic.
// ============================================================
router.post('/:courseId/complete', verifyToken, (req, res) => {
  const { courseId } = req.params;
  const { topicId }  = req.body;

  if (!topicId)
    return res.status(400).json({ error: 'topicId is required.' });

  const all = readAll();
  if (!all[req.user.id])              all[req.user.id]            = {};
  if (!all[req.user.id][courseId])    all[req.user.id][courseId]  = { completed: [], lastTopic: null };

  const cp = all[req.user.id][courseId];
  if (!cp.completed.includes(topicId)) cp.completed.push(topicId);
  cp.lastTopic   = topicId;
  cp.updatedAt   = new Date().toISOString();

  writeAll(all);
  console.log(`📚 Progress: user=${req.user.name}, course=${courseId}, topic=${topicId}`);
  res.json(cp);
});

// ============================================================
//  DELETE /api/progress/:courseId
//  Resets all progress for a specific course.
// ============================================================
router.delete('/:courseId', verifyToken, (req, res) => {
  const { courseId } = req.params;
  const all = readAll();
  if (all[req.user.id]) delete all[req.user.id][courseId];
  writeAll(all);
  res.json({ message: `Progress for course "${courseId}" has been reset.` });
});

// ============================================================
//  DELETE /api/progress
//  Resets ALL progress for the logged-in user.
// ============================================================
router.delete('/', verifyToken, (req, res) => {
  const all = readAll();
  delete all[req.user.id];
  writeAll(all);
  res.json({ message: 'All progress has been reset.' });
});

module.exports = router;
