// ============================================================
//  CHATBOT.JS — Groq AI integration (server-proxied)
// ============================================================

window.Chatbot = (function () {
  // Groq API (server-proxied)
  const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

  let _context   = { course: '', subtopic: '' };
  let _isThinking = false;

  // ---- Build system prompt (shared by server & direct paths) ----
  function buildSystemPrompt() {
    return `You are StudyBot, an expert AI tutor teaching "${_context.course}" — specifically the topic "${_context.subtopic}". ` +
      `Explain concepts in simple, clear, beginner-friendly terms. ` +
      `Use analogies when helpful. Format your responses with clear structure. ` +
      `Keep responses focused and educational. Use markdown-style formatting (bold with **, code with backticks). ` +
      `If asked something outside the current topic, gently redirect to the course material.`;
  }

  // ---- Direct Groq call (client key fallback) ----
  async function sendDirect(message, apiKey) {
    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1024
    };
    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || `API Error ${res.status}`;
        _isThinking = false;
        if (res.status === 401)
          return { error: 'invalid_key', message: msg };
        return { error: 'api_error', message: msg };
      }
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || 'Sorry, no response generated.';
      _isThinking = false;
      return { success: true, text };
    } catch (err) {
      _isThinking = false;
      return { error: 'network_error', message: err.message };
    }
  }

  // ---- Public API ----
  return {
    setContext(course, subtopic) {
      _context = { course, subtopic };
      const bar  = document.getElementById('chatContextBar');
      const span = document.getElementById('chatContextSpan');
      if (span) span.textContent = `${course} › ${subtopic}`;
      if (bar)  bar.classList.remove('hidden');
    },

    async send(userMessage) {
      if (_isThinking) return;
      _isThinking = true;

      // ---- 1. Try backend proxy (uses server .env GROQ_API_KEY) ----
      try {
        const res = await API.post('/chat', {
          message:  userMessage,
          course:   _context.course,
          subtopic: _context.subtopic
        });

        if (res.ok) {
          _isThinking = false;
          return { success: true, text: res.data.text };
        }

        // ---- 2. Server key not configured (503) → fall back to client key ----
        if (res.status === 503) {
          const clientKey = ApiKey.get();
          if (clientKey) return await sendDirect(userMessage, clientKey);
          _isThinking = false;
          return { error: 'no_key', message: res.data.error };
        }

        // ---- Other API errors ----
        _isThinking = false;
        return { error: 'api_error', message: res.data.error || 'An error occurred.' };

      } catch (_err) {
        // ---- 3. Backend unreachable → try client key ----
        const clientKey = ApiKey.get();
        if (clientKey) return await sendDirect(userMessage, clientKey);
        
        _isThinking = false;
        return { 
          error: 'network_error', 
          message: 'Cannot reach the StudyBot server. <br><br>' +
                   '<strong>How to fix:</strong><br>' +
                   '1. Ensure the Node.js backend is running (<code>node backend/server.js</code>).<br>' +
                   '2. Or, click the 🔑 icon above to enter your own Groq API key.'
        };
      }
    }
  };
})();


// ============================================================
//  LEARN.JS — Learning interface: layout, content, chatbot UI
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  if (!AuthState.requireAuth()) return;

  const courseId = getParam('course') || 'aws';
  const course = COURSES[courseId];
  if (!course) { window.location.href = 'dashboard.html'; return; }

  // Sync progress from backend
  await Progress.sync(courseId);

  const state = {
    course,
    currentSubtopicIndex: 0,
    showSubtopics: true,
    showChatbot: true,
    chatHistory: []  // { role, text, time }
  };

  // Restore last position
  const savedProgress = Progress.get(courseId);
  if (savedProgress.lastTopic) {
    const idx = course.subtopics.findIndex(s => s.id === savedProgress.lastTopic);
    if (idx >= 0) state.currentSubtopicIndex = idx;
  }

  initTopbar(state);
  renderSubtopicsList(state);
  loadContent(state);
  initChatbotUI(state);
  applyLayout(state);
  initApiModal();
  initNotes(state);
  initReadAloud();
  updateProgressBar(state);

  // Check API key on load (check backend status first)
  const health = await API.get('/health');
  const isServerKeyActive = health.ok && health.data.groqProxy === 'active';
  
  if (isServerKeyActive || ApiKey.get()) {
    document.getElementById('apiWarning')?.classList.add('hidden');
  } else {
    document.getElementById('apiWarning')?.classList.remove('hidden');
  }
});

// ============================================================
//  TOPBAR
// ============================================================
function initTopbar(state) {
  // Back button
  document.getElementById('topbarBack')?.addEventListener('click', () => window.location.href = 'dashboard.html');

  // Logo + course info
  document.getElementById('topbarCourseIcon').textContent = state.course.emoji;
  document.getElementById('topbarCourseName').textContent = state.course.title;

  // Toggles
  const subToggle  = document.getElementById('subtopicsToggle');
  const chatToggle = document.getElementById('chatbotToggle');

  subToggle?.addEventListener('change', () => {
    state.showSubtopics = subToggle.checked;
    applyLayout(state);
    updateToggleLabels(state);
  });

  chatToggle?.addEventListener('change', () => {
    state.showChatbot = chatToggle.checked;
    applyLayout(state);
    updateToggleLabels(state);
  });

  // Save progress button
  document.getElementById('saveBtn')?.addEventListener('click', () => {
    const sub = state.course.subtopics[state.currentSubtopicIndex];
    Progress.markComplete(state.course.id, sub.id);
    markSubtopicCompleted(sub.id);
    showToast('Progress saved! ✅', 'success');
  });

  // User avatar
  const user = AuthState.getUser();
  document.getElementById('topbarAvatar').textContent = getInitials(user?.name || 'U');

  updateToggleLabels(state);
}

function updateToggleLabels(state) {
  const modeNames = {
    '11': 'Full Mode',
    '10': 'Focus Mode',
    '01': 'Chat Mode',
    '00': 'Focus Mode'
  };
  const key = (state.showSubtopics ? '1' : '0') + (state.showChatbot ? '1' : '0');
  const modeBadge = document.getElementById('modeName');
  if (modeBadge) modeBadge.textContent = modeNames[key] || 'Full Mode';
}

// ============================================================
//  LAYOUT SYSTEM — 3 modes
// ============================================================
function applyLayout(state) {
  const subtopicsPanel = document.getElementById('subtopicsPanel');
  const chatbotPanel   = document.getElementById('chatbotPanel');

  // Collapsed state
  subtopicsPanel.classList.toggle('collapsed', !state.showSubtopics);
  chatbotPanel.classList.toggle('collapsed',   !state.showChatbot);

  // Update toggle group appearance
  document.getElementById('subtopicsToggleGroup')?.classList.toggle('active', state.showSubtopics);
  document.getElementById('chatbotToggleGroup')?.classList.toggle('active', state.showChatbot);

  updateToggleLabels(state);
}

// ============================================================
//  SUBTOPICS PANEL
// ============================================================
function renderSubtopicsList(state) {
  const list = document.getElementById('subtopicsList');
  if (!list) return;

  const progress = Progress.get(state.course.id);

  list.innerHTML = state.course.subtopics.map((sub, i) => {
    const isActive    = i === state.currentSubtopicIndex;
    const isCompleted = progress.completed.includes(sub.id);
    return `
      <div class="subtopic-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
           data-index="${i}" id="subtopic-${sub.id}">
        <div class="subtopic-num">${isCompleted ? '✓' : i + 1}</div>
        <div class="subtopic-text">
          <span class="subtopic-title">${sub.title}</span>
          <span class="subtopic-preview">${sub.preview}</span>
        </div>
        <span class="subtopic-check">✓</span>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.subtopic-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index);
      if (idx !== state.currentSubtopicIndex) {
        state.currentSubtopicIndex = idx;
        fadeAndLoadContent(state);
        updateSubtopicActive(state);
      }
    });
  });

  // Search filter
  document.getElementById('subtopicSearch')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    list.querySelectorAll('.subtopic-item').forEach(item => {
      const title = item.querySelector('.subtopic-title')?.textContent.toLowerCase() || '';
      item.style.display = q && !title.includes(q) ? 'none' : '';
    });
  });
}

function updateSubtopicActive(state) {
  document.querySelectorAll('.subtopic-item').forEach((item, i) => {
    item.classList.toggle('active', i === state.currentSubtopicIndex);
  });
  // Scroll active item into view
  const active = document.querySelector('.subtopic-item.active');
  active?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function markSubtopicCompleted(subId) {
  const item = document.getElementById(`subtopic-${subId}`);
  if (item) {
    item.classList.add('completed');
    item.querySelector('.subtopic-num').textContent = '✓';
  }
}

// ============================================================
//  CONTENT PANEL
// ============================================================
function fadeAndLoadContent(state) {
  const inner = document.getElementById('contentInner');
  inner.classList.add('fading');
  setTimeout(() => {
    inner.classList.remove('fading');
    loadContent(state);
    updateProgressBar(state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 160);
}

function loadContent(state) {
  const sub = state.course.subtopics[state.currentSubtopicIndex];
  const c   = sub.content;

  // Update topbar topic
  document.getElementById('topbarTopic').textContent = sub.title;

  // Breadcrumb
  document.getElementById('breadcrumbCourse').textContent = state.course.title;
  document.getElementById('breadcrumbTopic').textContent  = sub.title;

  // Header
  document.getElementById('contentCourseTag').textContent = `${state.course.emoji} ${state.course.title}`;
  document.getElementById('contentTitle').textContent     = sub.title;
  document.getElementById('readTimeDisplay').textContent  = sub.readTime;

  // Body
  let bodyHTML = `<p>${c.intro}</p>`;
  c.sections.forEach(sec => {
    bodyHTML += `<h3>${sec.title}</h3>`;
    // Convert simple markdown-ish: **bold** → <strong>
    const formatted = sec.body
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) =>
        `<pre><code>${escapeHtml(code.trim())}</code></pre>`)
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    bodyHTML += `<p>${formatted}</p>`;
  });
  document.getElementById('contentBody').innerHTML = bodyHTML;

  // Key points
  document.getElementById('keyPointsList').innerHTML = c.keyPoints.map(
    kp => `<li>${kp}</li>`
  ).join('');

  // Suggested questions
  const suggestedQ = document.getElementById('suggestedQuestions');
  suggestedQ.innerHTML = c.suggestedQuestions.map(
    q => `<button class="suggested-q">${q}</button>`
  ).join('');

  suggestedQ.querySelectorAll('.suggested-q').forEach(btn => {
    btn.addEventListener('click', () => sendSuggestedQuestion(btn.textContent, state));
  });

  // Chat hints
  const chatHints = document.getElementById('chatHints');
  chatHints.innerHTML = c.suggestedQuestions.slice(0, 2).map(
    q => `<button class="chat-hint">${q.length > 40 ? q.slice(0, 38) + '…' : q}</button>`
  ).join('');
  chatHints.querySelectorAll('.chat-hint').forEach(btn => {
    btn.addEventListener('click', () => sendSuggestedQuestion(btn.textContent.replace('…', '?'), state));
  });

  // Navigation buttons
  const prevBtn = document.getElementById('prevTopicBtn');
  const nextBtn = document.getElementById('nextTopicBtn');
  const isFirst = state.currentSubtopicIndex === 0;
  const isLast  = state.currentSubtopicIndex === state.course.subtopics.length - 1;
  prevBtn.style.display = isFirst ? 'none' : 'flex';
  nextBtn.textContent   = isLast ? '🏁 Finish Course' : 'Next Topic →';

  // Update chatbot context
  Chatbot.setContext(state.course.title, sub.title);

  // Add AI welcome message for new topic
  addWelcomeMessage(state);

  // Inject copy buttons and stop any TTS
  setTimeout(() => injectCopyCodeButtons(), 50);
  if (window.speechSynthesis?.speaking) {
    speechSynthesis.cancel();
    const btn = document.getElementById('readAloudBtn');
    if (btn) { btn.classList.remove('reading'); btn.innerHTML = '🔊 <span>Read</span>'; }
  }
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
//  CHATBOT UI
// ============================================================
function initChatbotUI(state) {
  const textarea = document.getElementById('chatInput');
  const sendBtn  = document.getElementById('chatSend');

  // Send on Enter (not Shift+Enter)
  textarea?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(state);
    }
  });

  // Auto-resize textarea
  textarea?.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  });

  sendBtn?.addEventListener('click', () => handleSend(state));

  // Ask about this topic button
  document.getElementById('askTopicBtn')?.addEventListener('click', () => {
    const sub = state.course.subtopics[state.currentSubtopicIndex];
    sendSuggestedQuestion(`Can you give me a quick summary of "${sub.title}"?`, state);
    // Make sure chatbot is visible
    if (!state.showChatbot) {
      state.showChatbot = true;
      document.getElementById('chatbotToggle').checked = true;
      applyLayout(state);
    }
  });

  // API warning click → open modal
  document.getElementById('apiWarning')?.addEventListener('click', () => {
    document.getElementById('apiModal')?.classList.add('open');
  });
}

function addWelcomeMessage(state) {
  const sub = state.course.subtopics[state.currentSubtopicIndex];
  appendMessage('ai', `📖 Now studying **${sub.title}** from _${state.course.title}_.\n\nAsk me anything about this topic — I'm here to help! 🤖`);
}

async function handleSend(state) {
  const textarea = document.getElementById('chatInput');
  const msg = textarea.value.trim();
  if (!msg) return;

  textarea.value = '';
  textarea.style.height = 'auto';

  await sendMessage(msg, state);
}

async function sendSuggestedQuestion(question, state) {
  // Ensure chatbot is visible
  if (!state.showChatbot) {
    state.showChatbot = true;
    document.getElementById('chatbotToggle').checked = true;
    applyLayout(state);
  }
  await sendMessage(question, state);
}

async function sendMessage(message, state) {
  // Show user message
  appendMessage('user', message);

  // (API warning is handled by Chatbot.send result or initial load)

  // Show typing indicator
  const typingId = showTyping();

  const result = await Chatbot.send(message);

  removeTyping(typingId);

  if (result.error) {
    if (result.status === 401) {
      appendMessage('ai', '❌ Session expired. Please refresh the page and log in again.');
      return;
    }
    if (result.error === 'no_key') {
      appendMessage('ai', '⚠️ API key not configured. Click the key icon above to add your Groq API key.');
      document.getElementById('apiWarning')?.classList.remove('hidden');
    } else if (result.error === 'invalid_key') {
      appendMessage('ai', '❌ Invalid API key. Please check your key and try again.');
      ApiKey.clear();
      document.getElementById('apiWarning')?.classList.remove('hidden');
    } else {
      appendMessage('ai', `❌ Error: ${result.data?.error || result.error || 'Something went wrong.'}`);
    }
    return;
  }

  appendMessage('ai', result.text);

  // Show follow-up hints after a short delay
  setTimeout(() => {
    const sub = state.course.subtopics[state.currentSubtopicIndex];
    const hints = sub.content.suggestedQuestions.slice(0, 2);
    
    const hintContainer = document.createElement('div');
    hintContainer.className = 'chat-followups animate-in';
    hintContainer.innerHTML = `
      <span class="followup-label">Follow-up:</span>
      ${hints.map(q => `<button class="followup-btn">${q}</button>`).join('')}
    `;
    
    const messages = document.getElementById('chatMessages');
    messages.appendChild(hintContainer);
    messages.scrollTop = messages.scrollHeight;

    hintContainer.querySelectorAll('.followup-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        hintContainer.classList.add('fading-out');
        setTimeout(() => hintContainer.remove(), 300);
        sendMessage(btn.textContent, state);
      });
    });
  }, 1000);
}

function appendMessage(role, text) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;

  const user = AuthState.getUser();
  const initials = role === 'user' ? getInitials(user?.name || 'U') : '🤖';
  const time = formatTime(new Date());

  // Format AI message: **bold**, `code`, newlines
  const formattedText = role === 'ai'
    ? text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
    : escapeHtml(text).replace(/\n/g, '<br>');

  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${role}`;
  msgEl.innerHTML = `
    <div class="msg-avatar">${initials}</div>
    <div class="msg-content">
      <div class="msg-bubble">${formattedText}</div>
      <span class="msg-time">${time}</span>
    </div>
  `;
  messages.appendChild(msgEl);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();
  const el = document.createElement('div');
  el.className = 'chat-msg ai typing-indicator';
  el.id = id;
  el.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-content">
      <div class="msg-bubble">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}

// ============================================================
//  API KEY MODAL
// ============================================================
function initApiModal() {
  const modal    = document.getElementById('apiModal');
  const overlay  = document.getElementById('apiModalOverlay');
  const closeBtn = document.getElementById('apiModalClose');
  const form     = document.getElementById('apiKeyForm');
  const input    = document.getElementById('apiKeyInput');

  // Pre-fill if exists
  input.value = ApiKey.get();

  overlay?.addEventListener('click', () => modal.classList.remove('open'));
  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const key = input.value.trim();
    if (!key) { showToast('Please enter a valid API key.', 'error'); return; }
    ApiKey.set(key);
    modal.classList.remove('open');
    document.getElementById('apiWarning')?.classList.add('hidden');
    showToast('API key saved! You can now chat with StudyBot (Groq) 🤖', 'success');
  });

  // Settings button in topbar
  document.getElementById('settingsBtn')?.addEventListener('click', () => {
    input.value = ApiKey.get();
    modal.classList.add('open');
  });
}

// ============================================================
//  NAVIGATION (Prev / Next Topic)
// ============================================================
document.addEventListener('click', (e) => {
  // These need to be delegated as they are rendered after DOMContentLoaded
  if (e.target.id === 'nextTopicBtn' || e.target.closest('#nextTopicBtn')) {
    const stateEl = document.getElementById('learnPage');
    if (!stateEl) return;
    // We use a global state ref — re-read from DOM since we don't have closure here
    const event = new CustomEvent('nextTopic');
    document.dispatchEvent(event);
  }
  if (e.target.id === 'prevTopicBtn' || e.target.closest('#prevTopicBtn')) {
    const event = new CustomEvent('prevTopic');
    document.dispatchEvent(event);
  }
});

// Attach navigation events after state is set up (called from main DOMContentLoaded)
// We put this logic inside the DOMContentLoaded via the global state trick above
document.addEventListener('DOMContentLoaded', () => {
  // Re-run after first load with state
});

// Patch: expose navigation to global scope via a simpler approach
window._learnNavigate = null;

// Override in main init
const _origDOMContentLoaded = document.addEventListener.bind(document);
// Nav is handled by the closure below (see re-init pattern)

// Better pattern: use a module-level state wrapper
(function setupLearnNav() {
  let _state = null;

  document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main init to set _state
    setTimeout(() => {
      const nextBtn = document.getElementById('nextTopicBtn');
      const prevBtn = document.getElementById('prevTopicBtn');

      // Re-attach after content renders via event delegation
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('#nextTopicBtn, #prevTopicBtn');
        if (!btn) return;

        // Find current state via DOM
        const courseId = getParam('course') || 'aws';
        const course = COURSES[courseId];
        if (!course) return;

        // Get current index from active subtopic
        const activeItem = document.querySelector('.subtopic-item.active');
        const currentIdx = activeItem ? parseInt(activeItem.dataset.index) : 0;

        const newIdx = btn.id === 'nextTopicBtn'
          ? Math.min(currentIdx + 1, course.subtopics.length - 1)
          : Math.max(currentIdx - 1, 0);

        if (newIdx === currentIdx && btn.id === 'nextTopicBtn') {
          showToast('🏁 You\'ve completed all topics in this course!', 'success');
          setTimeout(() => window.location.href = 'dashboard.html', 2000);
          return;
        }

        // Build a minimal state object and navigate
        const navState = {
          course,
          currentSubtopicIndex: newIdx,
          showSubtopics: !document.getElementById('subtopicsPanel').classList.contains('collapsed'),
          showChatbot:   !document.getElementById('chatbotPanel').classList.contains('collapsed')
        };

        navState.currentSubtopicIndex = newIdx;
        document.querySelectorAll('.subtopic-item').forEach((item, i) => {
          item.classList.toggle('active', i === newIdx);
        });

        const inner = document.getElementById('contentInner');
        inner.classList.add('fading');
        setTimeout(() => {
          inner.classList.remove('fading');
          loadContent(navState);
          document.querySelector('.subtopic-item.active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 160);
      });
    }, 200);
  });
})();

// ============================================================
//  PROGRESS BAR (topbar)
// ============================================================
function updateProgressBar(state) {
  const total   = state.course.subtopics.length;
  const current = state.currentSubtopicIndex + 1;
  const pct     = Math.round((current / total) * 100);

  const label = document.getElementById('progressLabel');
  const fill  = document.getElementById('progressTrackFill');
  if (label) label.textContent = `${current} / ${total}`;
  if (fill)  fill.style.width  = pct + '%';
}

// ============================================================
//  NOTES PANEL
// ============================================================
function initNotes(state) {
  const panel   = document.getElementById('notesPanel');
  const overlay = document.getElementById('notesOverlay');
  const textarea= document.getElementById('notesTextarea');
  const closeBtn= document.getElementById('notesClose');
  const clearBtn= document.getElementById('notesClearBtn');
  const openBtn = document.getElementById('notesBtn');
  const savedInd= document.getElementById('notesSavedIndicator');
  const topicLbl= document.getElementById('notesTopic');

  function noteKey() {
    const sub = state.course.subtopics[state.currentSubtopicIndex];
    return `sb_notes_${state.course.id}_${sub.id}`;
  }

  function openNotes() {
    const sub = state.course.subtopics[state.currentSubtopicIndex];
    if (topicLbl) topicLbl.textContent = sub.title;
    if (textarea)  textarea.value = localStorage.getItem(noteKey()) || '';
    panel?.classList.remove('hidden');
    overlay?.classList.remove('hidden');
    textarea?.focus();
  }

  function closeNotes() {
    panel?.classList.add('hidden');
    overlay?.classList.add('hidden');
  }

  openBtn?.addEventListener('click', openNotes);
  closeBtn?.addEventListener('click', closeNotes);
  overlay?.addEventListener('click', closeNotes);

  // Auto-save on typing
  let saveTimer;
  textarea?.addEventListener('input', () => {
    clearTimeout(saveTimer);
    if (savedInd) savedInd.classList.remove('visible');
    saveTimer = setTimeout(() => {
      localStorage.setItem(noteKey(), textarea.value);
      if (savedInd) {
        savedInd.classList.add('visible');
        setTimeout(() => savedInd.classList.remove('visible'), 2000);
      }
    }, 600);
  });

  clearBtn?.addEventListener('click', () => {
    if (textarea) textarea.value = '';
    localStorage.removeItem(noteKey());
    showToast('Notes cleared', 'info', 2000);
  });
}

// ============================================================
//  COPY CODE BUTTONS (injected after content renders)
// ============================================================
function injectCopyCodeButtons() {
  document.querySelectorAll('.content-body pre').forEach(pre => {
    if (pre.closest('.code-block-wrapper')) return; // already wrapped
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.className = 'copy-code-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code');
    wrapper.appendChild(btn);

    btn.addEventListener('click', () => {
      const code = pre.querySelector('code')?.textContent || pre.textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

// ============================================================
//  READ ALOUD (Text-to-Speech)
// ============================================================
let _ttsUtterance = null;

function initReadAloud() {
  const btn = document.getElementById('readAloudBtn');
  if (!btn || !window.speechSynthesis) {
    btn?.remove();
    return;
  }

  btn.addEventListener('click', () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      btn.classList.remove('reading');
      btn.innerHTML = '🔊 <span>Read</span>';
      return;
    }

    const contentBody = document.getElementById('contentBody');
    if (!contentBody) return;

    const text = contentBody.innerText.replace(/\s+/g, ' ').trim();
    if (!text) return;

    _ttsUtterance = new SpeechSynthesisUtterance(text);
    _ttsUtterance.rate  = 0.95;
    _ttsUtterance.pitch = 1;
    _ttsUtterance.lang  = 'en-US';

    _ttsUtterance.onend = () => {
      btn.classList.remove('reading');
      btn.innerHTML = '🔊 <span>Read</span>';
    };

    speechSynthesis.speak(_ttsUtterance);
    btn.classList.add('reading');
    btn.innerHTML = '⏹ <span>Stop</span>';
  });
}
