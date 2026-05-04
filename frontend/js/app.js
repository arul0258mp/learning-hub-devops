// ============================================================
//  APP.JS — Global utilities: API client, toast, auth, progress
// ============================================================

// ============================================================
//  Toast Notification System
// ============================================================
(function () {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);

  window.showToast = function (message, type = 'info', duration = 3500) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-dismiss" aria-label="Dismiss">✕</button>
    `;
    container.appendChild(toast);

    const dismiss = () => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-dismiss').addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  };
})();

// ============================================================
//  API Client — talks to the Node.js backend
// ============================================================
window.API = {
  // If running from file:// or a local dev server (Live Server, Vite, etc.), point to the local backend port.
  // Otherwise, use the relative path for Docker or production deployment.
  BASE: (() => {
    const proto    = window.location.protocol;
    const hostname = window.location.hostname;
    const port     = window.location.port;

    // Netlify deployment — functions live at /.netlify/functions/api
    if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
      return '/.netlify/functions/api/api';
    }

    // Vercel deployment — routes go to /api/
    if (hostname.includes('vercel.app') || hostname.includes('.vercel.')) {
      return '/api';
    }

    // Railway / Render / custom domain (production)
    if (proto === 'https:') {
      return '/api';
    }

    // Local dev file:// or Live Server ports → point to local backend
    if (proto === 'file:' || ['5500','5501','5173','3000'].includes(port)) {
      return 'http://localhost:3001/api';
    }

    // Already on port 3001 (our own backend)
    return '/api';
  })(),

  getHeaders() {
    const token = localStorage.getItem('sb_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  async request(method, endpoint, body = null) {
    try {
      const opts = { method, headers: this.getHeaders() };
      if (body) opts.body = JSON.stringify(body);
      const res  = await fetch(this.BASE + endpoint, opts);
      const data = await res.json().catch(() => ({}));
      
      // Auto-logout if token is invalid or expired
      if (res.status === 401 && !endpoint.includes('/auth/login')) {
        console.warn('Session invalid or expired. Logging out.');
        AuthState.logout();
        return { ok: false, status: 401, data: { error: 'Session expired. Please log in again.' } };
      }

      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      console.warn('API request failed:', err.message);
      return { ok: false, status: 0, data: { error: 'Cannot reach server. Is the backend running?' } };
    }
  },

  get(endpoint)           { return this.request('GET',    endpoint); },
  post(endpoint, body)    { return this.request('POST',   endpoint, body); },
  delete(endpoint)        { return this.request('DELETE', endpoint); },

  async ping() {
    try {
      const res = await fetch(this.BASE + '/health');
      return res.ok;
    } catch {
      return false;
    }
  }
};

// ============================================================
//  Auth State — JWT token + user object in localStorage
// ============================================================
window.AuthState = {
  _user: null,

  getUser() {
    if (this._user) return this._user;
    try {
      const stored = localStorage.getItem('sb_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  },

  setUser(user) {
    this._user = user;
    localStorage.setItem('sb_user', JSON.stringify(user));
  },

  setToken(token) {
    localStorage.setItem('sb_token', token);
  },

  getToken() {
    return localStorage.getItem('sb_token');
  },

  logout() {
    this._user = null;
    localStorage.removeItem('sb_user');
    localStorage.removeItem('sb_token');
    // Notify server (fire-and-forget — JWT is stateless so this is optional)
    API.post('/auth/logout').catch(() => {});
    window.location.href = 'login.html';
  },

  requireAuth() {
    if (!this.getUser() || !this.getToken()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

// ============================================================
//  API Key Management (client-side fallback key)
// ============================================================
window.ApiKey = {
  get()    { return localStorage.getItem('sb_groq_key') || ''; },
  set(key) { localStorage.setItem('sb_groq_key', key); },
  clear()  { localStorage.removeItem('sb_groq_key'); }
};

// ============================================================
//  Progress Tracking
//  Uses backend API with optimistic localStorage cache.
//  Calling code can use get() synchronously (reads cache)
//  and markComplete() which syncs to server automatically.
// ============================================================
window.Progress = {
  _cache: {},

  _localKey(courseId) { return `sb_progress_${courseId}`; },

  /** Read from in-memory cache → localStorage fallback */
  get(courseId) {
    if (this._cache[courseId]) return this._cache[courseId];
    try {
      const raw = localStorage.getItem(this._localKey(courseId));
      const p   = raw ? JSON.parse(raw) : { completed: [], lastTopic: null };
      this._cache[courseId] = p;
      return p;
    } catch {
      return { completed: [], lastTopic: null };
    }
  },

  /** Fetch from server and update cache + localStorage */
  async sync(courseId) {
    const res = await API.get(`/progress/${courseId}`);
    if (res.ok) {
      this._cache[courseId] = res.data;
      localStorage.setItem(this._localKey(courseId), JSON.stringify(res.data));
      return res.data;
    }
    return this.get(courseId); // fallback to cache
  },

  /** Fetch all courses' progress from server */
  async syncAll() {
    const res = await API.get('/progress');
    if (res.ok) {
      Object.entries(res.data).forEach(([courseId, progress]) => {
        this._cache[courseId] = progress;
        localStorage.setItem(this._localKey(courseId), JSON.stringify(progress));
      });
      return res.data;
    }
    return {};
  },

  /** Mark a topic complete — optimistic update + server sync */
  async markComplete(courseId, topicId) {
    // Optimistic update
    const p = this.get(courseId);
    if (!p.completed.includes(topicId)) p.completed.push(topicId);
    p.lastTopic = topicId;
    this._cache[courseId] = p;
    localStorage.setItem(this._localKey(courseId), JSON.stringify(p));

    // Server sync
    const res = await API.post(`/progress/${courseId}/complete`, { topicId });
    if (res.ok) {
      this._cache[courseId] = res.data;
      localStorage.setItem(this._localKey(courseId), JSON.stringify(res.data));
    } else {
      console.warn('Progress sync failed:', res.data.error);
    }
  },

  getPercent(courseId, totalTopics) {
    const p = this.get(courseId);
    return totalTopics > 0 ? Math.round((p.completed.length / totalTopics) * 100) : 0;
  }
};

// ============================================================
//  Scroll Animations
// ============================================================
window.initScrollAnimations = function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
};

// ============================================================
//  Navigation helpers
// ============================================================
window.navigateTo = function (page, params = {}) {
  const url = new URL(page, window.location.origin + window.location.pathname);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  window.location.href = url.toString();
};

window.getParam = function (name) {
  return new URLSearchParams(window.location.search).get(name);
};

// ============================================================
//  Utility helpers
// ============================================================
window.formatTime = function (date) {
  return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(date || new Date());
};

window.debounce = function (fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
};

window.getInitials = function (name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};
