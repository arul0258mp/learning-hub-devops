// ============================================================
//  LANDING.JS — Landing page interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initScrollAnimations();
  initCourseCardLinks();
  if (AuthState.getUser()) {
    // Swap CTA to go to dashboard
    document.querySelectorAll('.cta-link').forEach(el => el.href = 'dashboard.html');
  }
});

// ---- Sticky Navbar ----
function initNavbar() {
  const nav = document.getElementById('landingNav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ---- Particle Canvas ----
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;

  const PARTICLE_COUNT = 60;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(W, H));

  function createParticle(w, h, reset = false) {
    return {
      x: reset ? -5 : Math.random() * w,
      y: Math.random() * h,
      vx: 0.15 + Math.random() * 0.35,
      vy: (Math.random() - 0.5) * 0.2,
      r: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2
    };
  }

  function drawConnections(p, all) {
    all.forEach(q => {
      if (p === q) return;
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0,255,136,${(1 - dist / 120) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  }

  let animId;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;
      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      if (p.x > W + 5) Object.assign(p, createParticle(W, H, true));

      drawConnections(p, particles);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,136,${alpha})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(frame);
  }
  frame();

  window.addEventListener('resize', debounce(() => {
    cancelAnimationFrame(animId);
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    frame();
  }, 200));
}

// ---- Course card CTA ----
function initCourseCardLinks() {
  document.querySelectorAll('[data-course]').forEach(card => {
    card.addEventListener('click', () => {
      const user = AuthState.getUser();
      if (!user) {
        showToast('Please log in to start learning', 'info');
        setTimeout(() => window.location.href = 'login.html', 1000);
      } else {
        window.location.href = `dashboard.html`;
      }
    });
    card.style.cursor = 'pointer';
  });
}
