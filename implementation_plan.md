# Study Bot AI Assistant — Implementation Plan

A production-grade, multi-page AI learning web application using pure HTML, CSS, and JavaScript (no framework dependencies). The app will be deployable by simply opening `index.html` in a browser.

---

## Architecture Overview

Single-repository, multi-page web app with shared CSS design system and modular JS.

```
Learning Hub Bot/
├── index.html              ← Landing page
├── login.html              ← Login / Sign Up
├── dashboard.html          ← Course selection
├── learn.html              ← Learning interface (CORE)
├── css/
│   ├── design-system.css   ← Tokens, variables, resets
│   ├── landing.css         ← Landing page styles
│   ├── auth.css            ← Login/signup styles
│   ├── dashboard.css       ← Dashboard styles
│   └── learn.css           ← Learning interface styles
├── js/
│   ├── app.js              ← Global utilities (toast, auth state, dark mode)
│   ├── landing.js          ← Landing page interactions
│   ├── auth.js             ← Login / signup validation + localStorage
│   ├── dashboard.js        ← Course card logic + navigation
│   ├── learn.js            ← Layout modes, subtopic switching, content
│   └── chatbot.js          ← AI chatbot (Gemini API integration)
├── data/
│   └── courses.js          ← Static course content (AWS, C, Data Analysis)
└── assets/
    └── favicon.svg
```

---

## Design System

- **Color palette**: `#0a0a0f` background, `#00ff88` neon green accent, `#1a1a2e` cards
- **Fonts**: Inter (body) + Poppins (headings) from Google Fonts
- **Glassmorphism**: `backdrop-filter: blur(16px)`, semi-transparent backgrounds
- **Animations**: CSS keyframes + JS-driven class transitions
- **Border radius**: 12px–16px cards, 8px inputs, 50px pills

---

## Page Breakdown

### Page 1 — Landing (`index.html`)
- Animated hero with gradient text + floating particles
- Features grid (4 cards with icons)
- About section with mockup imagery
- Footer with links
- Sticky neon navbar with scroll effect

### Page 2 — Auth (`login.html`)
- Centered glassmorphism card
- Tab switcher (Login / Sign Up)
- Form validation with inline error messages
- Toast on success → redirect to dashboard
- localStorage auth state

### Page 3 — Dashboard (`dashboard.html`)
- Sidebar (Profile, My Courses, Settings, Logout)
- 3 course cards (AWS, C Programming, Data Analysis) with gradient icons
- Progress rings (mock, localStorage-backed)
- Top navbar with profile avatar

### Page 4 — Learning Interface (`learn.html`)
- **3-mode layout system** (Full / Focus / Chat) driven by 2 toggle switches
- Left subtopics panel (chat-sidebar style, scrollable)
- Center content area (fade transitions on topic switch)
- Right chatbot panel (ChatGPT-style bubbles)
- AI integration via Google Gemini API (key entered by user, stored in localStorage)
- Suggested questions, "Ask about this topic" shortcut
- Back button, saving progress to localStorage

---

## Proposed Files

### [NEW] `index.html`
### [NEW] `login.html`
### [NEW] `dashboard.html`
### [NEW] `learn.html`
### [NEW] `css/design-system.css`
### [NEW] `css/landing.css`
### [NEW] `css/auth.css`
### [NEW] `css/dashboard.css`
### [NEW] `css/learn.css`
### [NEW] `js/app.js`
### [NEW] `js/landing.js`
### [NEW] `js/auth.js`
### [NEW] `js/dashboard.js`
### [NEW] `js/learn.js`
### [NEW] `js/chatbot.js`
### [NEW] `data/courses.js`

---

## AI Integration

- Uses **Google Gemini API** (`gemini-1.5-flash`, free tier)
- User provides API key on first use → stored in `localStorage`
- System prompt dynamically injected: `"You are an expert tutor teaching [course] — specifically [subtopic]. Explain in simple, beginner-friendly terms."`
- Graceful fallback if no key provided (shows setup instructions)

---

## Open Questions

> [!IMPORTANT]
> **API Key**: The chatbot requires a Gemini API key. The UI will prompt the user to enter it on the learning page. Should I use OpenAI instead, or keep it as Gemini (free tier)?

> [!NOTE]
> The app uses `localStorage` for auth/progress — no backend needed. If you want a real backend (Node.js), let me know and I'll extend accordingly.

---

## Verification Plan

### Automated
- Open each HTML page in browser and verify layout renders correctly
- Test toggle switches in all 3 modes
- Test login/signup form validation
- Test course navigation to learning page

### Manual
- Verify API chatbot responds with context-aware answers
- Check mobile responsiveness at 375px, 768px, 1280px
- Confirm smooth transitions between layout modes
