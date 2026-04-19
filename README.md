# Study Bot AI Assistant

A **production-grade, AI-powered learning web application** built with pure HTML, CSS, and JavaScript. No frameworks, no build tools — just open `index.html` in your browser.

---

## 🚀 Quick Start

1. Open `c:\Users\arulp\Desktop\Learning Hub Bot\` in File Explorer
2. Double-click **`index.html`** to launch
3. Click **"Get Started"** → Sign Up → choose a course → start learning!

---

## 📄 Pages

| File | URL | Description |
|------|-----|-------------|
| `index.html` | Landing | Hero, features, courses preview, footer |
| `login.html` | Auth | Login / Sign Up with validation |
| `dashboard.html` | Dashboard | Course selection + progress tracking |
| `learn.html?course=aws` | Learning | Full AI learning interface |

---

## 🤖 AI Chatbot Setup (Gemini API)

The chatbot uses **Google Gemini 1.5 Flash** (free tier).

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a free API key
3. In the learning interface, click **"🔑 API Key"** in the top bar
4. Paste your key → Save

Your key is stored **only in your browser's localStorage** — never sent anywhere else.

---

## ⚡ Layout Modes (Learning Interface)

| Toggle State | Mode | Layout |
|---|---|---|
| Subtopics ON + Chatbot ON | **Full Mode** | 20% Topics \| 50% Content \| 30% Chat |
| Subtopics OFF + Chatbot OFF | **Focus Mode** | 100% Content (distraction-free) |
| Subtopics OFF + Chatbot ON | **Chat Mode** | 65% Content \| 35% Chat |

---

## 🎓 Courses Included

- **☁️ AWS Cloud Fundamentals** — Intro to Cloud, EC2, S3, Lambda, IAM, VPC
- **💻 C Programming Mastery** — Data types, Pointers, Arrays, Functions, Strings
- **📊 Data Analysis & EDA** — EDA process, Stats, Visualization, Missing data, Outliers

---

## 📂 File Structure

```
Learning Hub Bot/
├── index.html          ← Landing page
├── login.html          ← Authentication
├── dashboard.html      ← Course selection
├── learn.html          ← Learning interface (core)
├── css/
│   ├── design-system.css   ← Tokens, variables, utilities
│   ├── landing.css
│   ├── auth.css
│   ├── dashboard.css
│   └── learn.css
├── js/
│   ├── app.js          ← Toast, auth state, utilities
│   ├── landing.js      ← Particles, navbar
│   ├── auth.js         ← Login/signup validation
│   ├── dashboard.js    ← Course cards, sidebar
│   └── learn.js        ← Layout modes + Gemini AI
└── data/
    └── courses.js      ← All course content
```

---

## ✨ Features

- Dark cyberpunk theme with neon green accents
- Particle canvas animation on hero
- Glassmorphism cards throughout
- Form validation with inline error messages
- Password strength meter
- LocalStorage auth (no backend needed)
- Progress tracking per course
- 3 intelligent layout modes with smooth CSS transitions
- Context-aware AI chatbot (knows your course + subtopic)
- Suggested questions per topic
- Prev/Next topic navigation
- Mobile responsive (hamburger menu, mobile panels)
- Toast notification system
- Keyboard shortcuts: `C` to focus chat, `Ctrl+/` for API key modal
