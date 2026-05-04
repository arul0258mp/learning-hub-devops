// ============================================================
//  AUTH.JS — Login / Sign Up logic (backend-powered)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in with a valid token, skip to dashboard
  if (AuthState.getUser() && AuthState.getToken()) {
    window.location.href = 'dashboard.html';
    return;
  }

  initTabs();
  initLoginForm();
  initSignupForm();
  initForgotPassword();
  initSocialButtons();
});

// ---- Tab Switch ----
function initTabs() {
  const loginTab   = document.getElementById('loginTab');
  const signupTab  = document.getElementById('signupTab');
  const loginForm  = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    clearErrors();
  });

  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    clearErrors();
  });
}

// ---- Login Form ----
function initLoginForm() {
  const form       = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passInput  = document.getElementById('loginPassword');
  const toggleBtn  = document.getElementById('toggleLoginPass');
  const submitBtn  = document.getElementById('loginSubmit');

  toggleBtn?.addEventListener('click', () => togglePassword(passInput, toggleBtn));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email    = emailInput.value.trim();
    const password = passInput.value;
    let valid = true;

    if (!email || !isValidEmail(email)) {
      showError('loginEmailError', 'Please enter a valid email address.');
      emailInput.classList.add('error');
      valid = false;
    }
    if (!password || password.length < 6) {
      showError('loginPassError', 'Password must be at least 6 characters.');
      passInput.classList.add('error');
      valid = false;
    }
    if (!valid) return;

    setLoading(submitBtn, true);

    // ---- Call backend ----
    const res = await API.post('/auth/login', { email, password });

    setLoading(submitBtn, false);

    if (!res.ok) {
      // Handle server-down vs credential error
      if (res.status === 0) {
        showError('loginPassError', '⚠️ Cannot reach server. Is the backend running?');
      } else {
        showError('loginPassError', res.data.error || 'Login failed. Please try again.');
      }
      passInput.classList.add('error');
      return;
    }

    // Store JWT + user info
    AuthState.setToken(res.data.token);
    AuthState.setUser(res.data.user);
    showToast('Welcome back, ' + res.data.user.name + '! 🎉', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1200);
  });
}

// ---- Signup Form ----
function initSignupForm() {
  const form         = document.getElementById('signupForm');
  const nameInput    = document.getElementById('signupName');
  const emailInput   = document.getElementById('signupEmail');
  const passInput    = document.getElementById('signupPassword');
  const confirmInput = document.getElementById('signupConfirm');
  const toggleBtn    = document.getElementById('toggleSignupPass');
  const submitBtn    = document.getElementById('signupSubmit');
  const strengthFill  = document.getElementById('strengthFill');
  const strengthLabel = document.getElementById('strengthLabel');

  toggleBtn?.addEventListener('click', () => togglePassword(passInput, toggleBtn));

  // Password strength meter
  passInput.addEventListener('input', () => {
    const strength = getPasswordStrength(passInput.value);
    const colors   = ['', '#ff4d6d', '#ffc857', '#4eccf4', '#00ff88'];
    const labels   = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    strengthFill.style.width      = (strength / 4 * 100) + '%';
    strengthFill.style.background = colors[strength];
    strengthLabel.textContent     = passInput.value ? labels[strength] : '';
    strengthLabel.style.color     = colors[strength];
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name     = nameInput.value.trim();
    const email    = emailInput.value.trim();
    const password = passInput.value;
    const confirm  = confirmInput.value;
    let valid = true;

    if (!name || name.length < 2) {
      showError('signupNameError', 'Please enter your full name.');
      nameInput.classList.add('error');
      valid = false;
    }
    if (!email || !isValidEmail(email)) {
      showError('signupEmailError', 'Please enter a valid email address.');
      emailInput.classList.add('error');
      valid = false;
    }
    if (!password || password.length < 6) {
      showError('signupPassError', 'Password must be at least 6 characters.');
      passInput.classList.add('error');
      valid = false;
    }
    if (password !== confirm) {
      showError('signupConfirmError', 'Passwords do not match.');
      confirmInput.classList.add('error');
      valid = false;
    }
    if (!valid) return;

    setLoading(submitBtn, true);

    // ---- Call backend ----
    const res = await API.post('/auth/register', { name, email, password });

    setLoading(submitBtn, false);

    if (!res.ok) {
      if (res.status === 0) {
        showError('signupEmailError', '⚠️ Cannot reach server. Is the backend running?');
      } else if (res.status === 409) {
        showError('signupEmailError', res.data.error || 'Email already exists.');
        emailInput.classList.add('error');
      } else {
        showError('signupPassError', res.data.error || 'Registration failed. Please try again.');
      }
      return;
    }

    // Store JWT + user info
    AuthState.setToken(res.data.token);
    AuthState.setUser(res.data.user);
    showToast('Account created! Welcome aboard 🚀', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1300);
  });
}

// ---- Forgot Password ----
function initForgotPassword() {
  const link     = document.getElementById('forgotLink');
  const modal    = document.getElementById('forgotModal');
  const overlay  = document.getElementById('forgotOverlay');
  const closeBtn = document.getElementById('forgotClose');
  const form     = document.getElementById('forgotForm');
  const submitBtn = document.getElementById('forgotSubmit');

  link?.addEventListener('click',    (e) => { e.preventDefault(); modal.classList.add('open'); });
  overlay?.addEventListener('click', ()  => modal.classList.remove('open'));
  closeBtn?.addEventListener('click',()  => modal.classList.remove('open'));

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email || !isValidEmail(email)) {
      showToast('Please enter a valid email.', 'error');
      return;
    }
    setLoading(submitBtn, true);
    // Simulated delay (email service not yet implemented)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(submitBtn, false);
    modal.classList.remove('open');
    showToast('Password reset link sent! Check your inbox.', 'success');
  });
}

// ---- Social Buttons (demo only) ----
function initSocialButtons() {
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => showToast('Social login coming soon!', 'info'));
  });
}

// ============================================================
//  Helpers
// ============================================================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = '⚠ ' + msg; el.classList.add('visible'); }
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
  document.querySelectorAll('.input-field.error').forEach(el => el.classList.remove('error'));
}

function togglePassword(input, btn) {
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.textContent = show ? '🙈' : '👁️';
}

function setLoading(btn, loading) {
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = '<span class="spinner"></span> Please wait…';
    btn.classList.add('btn-loading');
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || 'Submit';
    btn.classList.remove('btn-loading');
  }
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8)         score++;
  if (/[A-Z]/.test(password))       score++;
  if (/[0-9]/.test(password))       score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}
