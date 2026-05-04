# Study Bot AI Assistant — Complete README

An **AI-powered learning platform** with structured courses, an intelligent chatbot tutor, progress tracking, personal notes, read aloud, and more.

---

## 🚀 Quick Start (Local)

### Option 1 — One Click (Windows)
**Double-click `Start_StudyBot.bat`** — it installs dependencies and opens the browser automatically.

### Option 2 — Manual
```bash
cd backend
npm install
node server.js
```
Then open **http://localhost:3001** in your browser.

---

## 🌐 Hosting on Railway (Free Domain)

Deploy to get a live URL like `studybot-production.up.railway.app`:

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Study Bot AI — production ready"
git remote add origin https://github.com/YOUR_USERNAME/studybot.git
git push -u origin main
```

### Step 2 — Deploy on Railway
1. Go to **[railway.app](https://railway.app)** → Sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub Repo"**
3. Select your repository
4. Railway auto-detects the `Dockerfile`
5. Go to **"Variables"** tab and add:
   | Variable | Value |
   |---|---|
   | `GROQ_API_KEY` | Your key from console.groq.com |
   | `JWT_SECRET` | Any long random string |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | `*` |
6. Click **"Deploy"** — you get a live HTTPS URL in ~2 minutes!

### Step 3 — Get Your Domain
Go to **Settings → Domains** in Railway to:
- Use the free `*.up.railway.app` subdomain, or
- Connect your own custom domain (e.g. `studybot.yourdomain.com`)

---

## 📄 Pages

| File | URL | Description |
|------|-----|-------------|
| `index.html` | `/` | Landing page |
| `login.html` | `/login.html` | Auth (Login / Sign Up) |
| `dashboard.html` | `/dashboard.html` | Course selection + progress |
| `learn.html?course=aws` | `/learn.html?course=aws` | Full learning interface |

---

## 🤖 AI Chatbot

Uses **Groq (Llama-3.3-70b)** — fast, free, and context-aware.

The server uses the key from `backend/.env`. Users can also enter their own key via the 🔑 button.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Chatbot | Context-aware Groq AI tutor |
| 📝 Notes Panel | Per-topic personal notes (auto-saved) |
| 🔊 Read Aloud | Text-to-speech for all content |
| 📊 Progress Bar | Live topic X/N indicator in topbar |
| 📋 Copy Code | One-click copy for all code blocks |
| 🎛️ Layout Modes | Full / Focus / Chat modes |
| 💾 Progress Tracking | Server-backed progress per course |
| 🌐 3 Courses | AWS, C Programming, Data Analysis |
| 📱 Mobile Ready | Responsive on all screen sizes |

---

## ⚡ Layout Modes

| Mode | Panels |
|---|---|
| Full Mode | Topics + Content + Chat |
| Focus Mode | Content only (distraction-free) |
| Chat Mode | Content + Chat |

---

## 🎓 Courses

- **☁️ AWS Cloud Fundamentals** — EC2, S3, Lambda, IAM, VPC
- **💻 C Programming Mastery** — Data types, Pointers, Functions, Strings
- **📊 Data Analysis & EDA** — Statistics, Visualization, Missing data

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| "Cannot reach server" | Run `node backend/server.js` |
| Chatbot not responding | Check `GROQ_API_KEY` in `backend/.env` |
| Login not working | Try registering a new account |
| Notes not saving | Check browser localStorage permissions |

---

## 📂 Project Structure

```
learning-hub-devops/
├── Start_StudyBot.bat   ← One-click launcher (Windows)
├── Dockerfile           ← Docker build
├── railway.json         ← Railway deploy config
├── docker-compose.yml   ← Docker Compose
├── backend/
│   ├── server.js        ← Express server
│   ├── .env             ← API keys (never commit!)
│   ├── .env.example     ← Template
│   ├── routes/          ← auth, progress, chat
│   └── middleware/      ← JWT, rate limiter
├── css/                 ← Styles per page
├── js/                  ← Scripts per page
├── data/courses.js      ← All course content
└── *.html               ← Pages
```

---

## 🏆 Credits

Built with ❤️, Node.js, Groq AI, and pure HTML/CSS/JS. No frontend framework needed.
