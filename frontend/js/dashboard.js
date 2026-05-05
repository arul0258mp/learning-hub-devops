// ============================================================
//  DASHBOARD.JS — Course selection, sidebar, progress
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  if (!AuthState.requireAuth()) return;

  const user = AuthState.getUser();
  populateUserInfo(user);

  // Sync all progress from backend before rendering
  await Progress.syncAll();

  renderCourseCards();
  renderPerformanceAnalytics();
  renderActivityFeed();
  initSidebar();
  initSearch();
  initScrollAnimations();
});

// ---- User Info ----
function populateUserInfo(user) {
  const initials = getInitials(user.name);
  document.querySelectorAll('.user-name-display').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.user-initials').forEach(el => el.textContent = initials);
  document.getElementById('greetingName').textContent = getGreeting() + ', ' + user.name.split(' ')[0] + ' 👋';
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---- Render Course Cards ----
function renderCourseCards() {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;

  const courseList = Object.values(COURSES);
  grid.innerHTML = courseList.map(course => {
    const percent = Progress.getPercent(course.id, course.subtopics.length);
    const diffClass = { 'Beginner': 'diff-beginner', 'Intermediate': 'diff-intermediate', 'Advanced': 'diff-advanced' }[course.difficulty] || 'diff-beginner';
    const btnText = percent > 0 ? 'Continue' : 'Start Learning';

    return `
      <div class="course-card glass-card animate-on-scroll" data-course-id="${course.id}">
        <div class="course-card-header">
          <div class="course-icon-wrap" style="background:linear-gradient(135deg,${course.color}22,${course.color}44)">
            ${course.emoji}
          </div>
          <span class="course-difficulty ${diffClass}">${course.difficulty}</span>
        </div>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-card-footer">
          <div class="progress-info">
            <span>Progress</span>
            <span class="progress-pct">${percent}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${percent}%"></div>
          </div>
          <div class="course-meta-row">
            <span>⏱️ ${course.duration}</span>
            <span>📚 ${course.topics} topics</span>
            <button class="start-btn" data-course-id="${course.id}">${btnText} →</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach click handlers
  grid.querySelectorAll('[data-course-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      const courseId = el.closest('[data-course-id]')?.dataset.courseId || el.dataset.courseId;
      if (courseId) goToCourse(courseId);
    });
  });

  // Animate progress bars after render
  setTimeout(() => {
    grid.querySelectorAll('.progress-fill').forEach(bar => {
      bar.style.transition = 'width 1s ease';
    });
    initScrollAnimations();
  }, 100);
}

function goToCourse(courseId) {
  window.location.href = `learn.html?course=${courseId}`;
}

// ---- Activity Feed ----
function renderActivityFeed() {
  const list = document.getElementById('activityList');
  if (!list) return;

  const activities = [
    { icon: '📘', title: 'Completed: EC2 Basics', course: 'AWS Cloud', time: '2h ago' },
    { icon: '🤖', title: 'AI Chat: Pointer questions', course: 'C Programming', time: 'Yesterday' },
    { icon: '📊', title: 'Studied: Descriptive Stats', course: 'Data Analysis', time: '2 days ago' },
    { icon: '🏆', title: 'Achievement: First Course Started!', course: '', time: '3 days ago' }
  ];

  const user = AuthState.getUser();
  // Merge with any saved progress
  const courseActivities = Object.values(COURSES).flatMap(c => {
    const p = Progress.get(c.id);
    return p.completed.map(topicId => {
      const subtopic = c.subtopics.find(s => s.id === topicId);
      return subtopic ? { icon: '✅', title: `Completed: ${subtopic.title}`, course: c.title, time: 'Recently' } : null;
    }).filter(Boolean);
  });

  const allActivities = [...courseActivities.slice(0, 3), ...activities].slice(0, 6);

  list.innerHTML = allActivities.map(a => `
    <div class="activity-item animate-on-scroll">
      <span class="activity-icon">${a.icon}</span>
      <div class="activity-info">
        <strong>${a.title}</strong>
        ${a.course ? `<span>${a.course}</span>` : ''}
      </div>
      <span class="activity-time">${a.time}</span>
    </div>
  `).join('');

  initScrollAnimations();
}

// ---- Sidebar ----
function initSidebar() {
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');
  const logoutBtn = document.getElementById('logoutBtn');

  menuToggle?.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      // Mobile behavior: slide in/out
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    } else {
      // Desktop behavior: collapse/expand
      sidebar.classList.toggle('collapsed');
    }
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });

  logoutBtn?.addEventListener('click', () => {
    const modal = document.getElementById('accountModal');
    const user = AuthState.getUser();
    if (modal && user) {
      document.getElementById('accountModalTitle').textContent = user.name;
      document.getElementById('accountEmail').textContent = user.email;
      document.getElementById('accountAvatar').textContent = user.name.charAt(0).toUpperCase();
      modal.classList.remove('hidden');
    }
  });

  // Active nav item and scroll routing
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // Set active state visually
      document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Close sidebar on mobile after clicking
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      }

      // Handle navigation logic
      const label = item.textContent.trim().toLowerCase();
      
      if (label.includes('dashboard')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } 
      else if (label.includes('my courses')) {
        const target = document.getElementById('coursesHeading');
        if (target) {
          const offset = target.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      } 
      else if (label.includes('progress')) {
        const target = document.getElementById('performanceHeading');
        if (target) {
          const offset = target.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      } 
      else if (label.includes('profile') || label.includes('settings') || label.includes('account')) {
        const modal = document.getElementById('accountModal');
        const user = AuthState.getUser();
        if (modal && user) {
          document.getElementById('accountModalTitle').textContent = user.name;
          document.getElementById('accountEmail').textContent = user.email;
          document.getElementById('accountAvatar').textContent = user.name.charAt(0).toUpperCase();
          modal.classList.remove('hidden');
        }
      }
    });
  });

  // Account Modal events
  document.getElementById('accountModalClose')?.addEventListener('click', () => {
    document.getElementById('accountModal').classList.add('hidden');
  });
  document.getElementById('accountModalOverlay')?.addEventListener('click', () => {
    document.getElementById('accountModal').classList.add('hidden');
  });
  document.getElementById('accountLogoutBtn')?.addEventListener('click', () => {
    showToast('Logged out. See you soon!', 'info');
    setTimeout(() => AuthState.logout(), 800);
  });
}


// ---- Search ----
function initSearch() {
  const input = document.getElementById('dashSearch');
  if (!input) return;

  input.addEventListener('input', debounce(() => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('.course-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = q && !text.includes(q) ? 'none' : '';
    });
  }, 250));
}

// ---- Performance Analytics ----
function renderPerformanceAnalytics() {
  const statsKey = 'sb_quiz_stats';
  const stats = JSON.parse(localStorage.getItem(statsKey) || '{}');
  
  const avgEl = document.getElementById('avgScore');
  const masteryEl = document.getElementById('conceptsMastered');
  const countEl = document.getElementById('quizzesTaken');
  const barsEl = document.getElementById('masteryBars');
  const recentEl = document.getElementById('recentQuizzes');

  if (!avgEl) return;

  let totalScore = 0;
  let totalQuizzes = 0;
  let masteredCount = 0;
  let allQuizData = [];

  // Aggregate stats
  Object.keys(stats).forEach(courseId => {
    Object.keys(stats[courseId]).forEach(subtopicId => {
      const q = stats[courseId][subtopicId];
      const pct = (q.score / q.total) * 100;
      totalScore += pct;
      totalQuizzes++;
      if (pct >= 80) masteredCount++;
      
      const courseObj = COURSES[courseId];
      const subtopicObj = courseObj?.subtopics.find(s => s.id === subtopicId);
      
      allQuizData.push({
        name: subtopicObj?.title || subtopicId,
        course: courseObj?.title || courseId,
        score: Math.round(pct),
        date: new Date(q.date)
      });
    });
  });

  // Update Summary Stats
  const finalAvg = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
  
  const textEl = document.getElementById('avgScoreText');
  const circleEl = document.getElementById('avgScoreCircle');
  if (textEl) textEl.textContent = finalAvg + '%';
  if (circleEl) circleEl.setAttribute('stroke-dasharray', `${finalAvg}, 100`);

  masteryEl.textContent = masteredCount;
  countEl.textContent = totalQuizzes;

  if (totalQuizzes === 0) return;

  // Render Mastery Bars (Course level)
  let barsHTML = '';
  Object.keys(COURSES).forEach(courseId => {
    const course = COURSES[courseId];
    const courseStats = stats[courseId] || {};
    const subtopicsTaken = Object.keys(courseStats).length;
    
    let totalPct = 0;
    Object.values(courseStats).forEach(s => totalPct += (s.score / s.total) * 100);
    const avgPct = subtopicsTaken > 0 ? Math.round(totalPct / subtopicsTaken) : 0;

    barsHTML += `
      <div class="mastery-item">
        <div class="mastery-info">
          <span class="mastery-name">${course.title}</span>
          <span class="mastery-val">${avgPct}% Mastery</span>
        </div>
        <div class="mastery-track">
          <div class="mastery-fill" style="width:${avgPct}%; background:${course.color || 'var(--accent)'}"></div>
        </div>
      </div>
    `;
  });
  barsEl.innerHTML = barsHTML;

  // Render Recent Quizzes
  allQuizData.sort((a, b) => b.date - a.date);
  const recentHTML = allQuizData.slice(0, 4).map(q => `
    <div class="recent-quiz-item">
      <div class="recent-quiz-info">
        <span class="recent-quiz-name">${q.name}</span>
        <span class="recent-quiz-date">${q.course} • ${q.date.toLocaleDateString()}</span>
      </div>
      <div class="recent-quiz-score ${q.score < 60 ? 'low' : ''}">${q.score}%</div>
    </div>
  `).join('');
  recentEl.innerHTML = recentHTML || '<div class="empty-state">No recent assessments.</div>';
}

