// ============================================================
//  ROUTES/AUTH.JS — Register, Login, Logout, Me
// ============================================================

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const fs       = require('fs');
const path     = require('path');

const { verifyToken } = require('../middleware/auth');

const router     = express.Router();
const USERS_FILE = path.join(__dirname, '../data/users.json');

// ---- File DB helpers ----
function ensureDataDir() {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readUsers() {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); }
  catch { return []; }
}

function writeUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'default_studybot_secret_key',
    { expiresIn: '7d' }
  );
}

// ============================================================
//  POST /api/auth/register
// ============================================================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  if (name.trim().length < 2)
    return res.status(400).json({ error: 'Name must be at least 2 characters.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const users = readUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: 'An account with this email already exists.' });

  // Hash password & save
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id:           generateId(),
    name:         name.trim(),
    email:        email.toLowerCase().trim(),
    passwordHash,
    createdAt:    new Date().toISOString()
  };
  users.push(user);
  writeUsers(users);

  const token = signToken(user);
  console.log(`✅ New user registered: ${user.name} <${user.email}>`);

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// ============================================================
//  POST /api/auth/login
// ============================================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  const users = readUsers();
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  // Constant-time comparison to prevent timing attacks
  const dummyHash = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234';
  const hashToCheck = user ? user.passwordHash : dummyHash;
  const valid = await bcrypt.compare(password, hashToCheck);

  if (!user || !valid)
    return res.status(401).json({ error: 'Invalid email or password.' });

  const token = signToken(user);
  console.log(`🔑 User logged in: ${user.name} <${user.email}>`);

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// ============================================================
//  GET /api/auth/me — returns logged-in user info
// ============================================================
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// ============================================================
//  POST /api/auth/logout — client-side JWT logout (stateless)
// ============================================================
router.post('/logout', (req, res) => {
  // JWTs are stateless; the client simply discards the token.
  // Extend this with a token blacklist (Redis) for production.
  res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
