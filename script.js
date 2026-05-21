document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // 1. BOOT LOADER
  // ============================
  const loader    = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderSub = document.getElementById('loaderSub');
  const loaderTxt = document.getElementById('loaderText');

  const bootMsgs = [
    'LOADING MODULES...',
    'RENDERING COMPONENTS...',
    'INITIALIZING ANIMATIONS...',
    'BOOTING PORTFOLIO...',
    'READY.',
  ];

  let progress = 0;
  const bootInterval = setInterval(() => {
    progress += Math.random() * 22 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(bootInterval);
      loaderSub.textContent = 'READY.';
      loaderBar.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
        runHeroCounters();
      }, 500);
    } else {
      const idx = Math.min(Math.floor(progress / 25), bootMsgs.length - 1);
      loaderSub.textContent = bootMsgs[idx];
      loaderBar.style.width = progress + '%';
    }
  }, 140);

  // ============================
  // 2. THEME TOGGLE
  // ============================
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('bru-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  themeToggle.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme');
    const next = curr === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('bru-theme', next);
  });

  // ============================
  // 3. CUSTOM CURSOR
  // ============================
  const cursorBox = document.getElementById('cursorBox');
  document.addEventListener('mousemove', e => {
    cursorBox.style.transform = `translate(${e.clientX - 14}px, ${e.clientY - 14}px)`;
  });
  document.querySelectorAll('a, button, .project-card, .tool-tag, .about-tags span').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorBox.style.background = 'var(--accent)'; cursorBox.style.color = '#fff'; });
    el.addEventListener('mouseleave', () => { cursorBox.style.background = ''; cursorBox.style.color = ''; });
  });

  // ============================
  // 4. NAVBAR SCROLL
  // ============================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 40 ? 'var(--ink)' : '';
  }, { passive: true });

  // ============================
  // 5. SCROLL PROGRESS BAR
  // ============================
  const scrollFill = document.getElementById('scrollFill');
  window.addEventListener('scroll', () => {
    const h = document.body.scrollHeight - window.innerHeight;
    scrollFill.style.width = (window.scrollY / h * 100) + '%';
  }, { passive: true });

  // ============================
  // 6. FADE-IN OBSERVER
  // ============================
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      // Skills bars
      if (entry.target.classList.contains('skills-layout')) {
        entry.target.querySelectorAll('.skills-col').forEach(col => col.classList.add('visible'));
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  const skillsLayout = document.querySelector('.skills-layout');
  if (skillsLayout) observer.observe(skillsLayout);

  // ============================
  // 7. COUNTER ANIMATION
  // ============================
  function animateCount(el, target, dur = 1200) {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function runHeroCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      animateCount(el, parseInt(el.dataset.count));
    });
  }

  // ============================
  // 8. GLITCH BUTTON
  // ============================
  const glitchBtn = document.getElementById('glitchBtn');
  let glitchActive = false;
  let glitchTimer;

  glitchBtn.addEventListener('click', () => {
    glitchActive = !glitchActive;
    glitchBtn.style.background = glitchActive ? 'var(--accent)' : '';
    glitchBtn.style.color = glitchActive ? '#fff' : '';
    if (glitchActive) startGlitch(); else stopGlitch();
  });

  function startGlitch() {
    const glitchEls = document.querySelectorAll('.glitch-text');
    function glitchLoop() {
      glitchEls.forEach(el => {
        el.classList.add('glitching');
        setTimeout(() => el.classList.remove('glitching'), 150 + Math.random() * 200);
      });
      glitchTimer = setTimeout(glitchLoop, 400 + Math.random() * 800);
    }
    glitchLoop();
  }
  function stopGlitch() {
    clearTimeout(glitchTimer);
    document.querySelectorAll('.glitch-text').forEach(el => el.classList.remove('glitching'));
  }

  // Random glitch on hero load
  setTimeout(() => {
    const h = document.querySelectorAll('.glitch-text');
    h.forEach(el => {
      el.classList.add('glitching');
      setTimeout(() => el.classList.remove('glitching'), 300);
    });
  }, 1800);

  // ============================
  // 9. COMMAND PALETTE
  // ============================
  const cmdOverlay = document.getElementById('cmdOverlay');
  const cmdInput   = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');
  const cmdTrigger = document.getElementById('cmdTrigger');

  const commands = [
    { label: 'GO TO HOME',         action: () => scrollTo('#home') },
    { label: 'VIEW MY WORK',       action: () => scrollTo('#work') },
    { label: 'ABOUT ME',           action: () => scrollTo('#about') },
    { label: 'TECH STACK',         action: () => scrollTo('#skills') },
    { label: 'CLIENT REVIEWS',     action: () => scrollTo('#testimonials') },
    { label: 'CONTACT ME',         action: () => scrollTo('#contact') },
    { label: 'TOGGLE THEME',       action: () => themeToggle.click() },
    { label: 'TOGGLE GLITCH MODE', action: () => glitchBtn.click() },
    { label: 'DOWNLOAD CV',        action: () => alert('CV_DOWNLOAD.PDF would start here.') },
    { label: 'OPEN GITHUB',        action: () => window.open('https://github.com', '_blank') },
    { label: 'OPEN LINKEDIN',      action: () => window.open('https://linkedin.com', '_blank') },
    { label: 'SEND EMAIL',         action: () => scrollTo('#contact') },
  ];

  let cmdActive = -1;

  function renderCommands(filter = '') {
    const filtered = commands.filter(c => c.label.includes(filter.toUpperCase()));
    cmdResults.innerHTML = '';
    cmdActive = -1;
    filtered.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.textContent = cmd.label;
      li.addEventListener('click', () => { closeCmd(); cmd.action(); });
      li.addEventListener('mouseenter', () => { cmdActive = i; highlight(); });
      cmdResults.appendChild(li);
    });
  }

  function highlight() {
    cmdResults.querySelectorAll('li').forEach((li, i) => li.classList.toggle('active', i === cmdActive));
  }

  function openCmd() {
    cmdOverlay.classList.add('active');
    cmdInput.value = '';
    renderCommands();
    setTimeout(() => cmdInput.focus(), 50);
  }
  function closeCmd() { cmdOverlay.classList.remove('active'); }

  function scrollTo(sel) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  cmdTrigger.addEventListener('click', openCmd);
  cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmd(); });
  cmdInput.addEventListener('input', () => renderCommands(cmdInput.value));
  cmdInput.addEventListener('keydown', e => {
    const items = cmdResults.querySelectorAll('li');
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdActive = Math.min(cmdActive + 1, items.length - 1); highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdActive = Math.max(cmdActive - 1, 0); highlight(); }
    else if (e.key === 'Enter' && cmdActive >= 0) items[cmdActive].click();
    else if (e.key === 'Escape') closeCmd();
  });
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); cmdOverlay.classList.contains('active') ? closeCmd() : openCmd(); }
    if (e.key === 'Escape') closeCmd();
  });

  // ============================
  // 10. ACTIVE NAV
  // ============================
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          const match = a.getAttribute('href') === `#${entry.target.id}`;
          a.style.color = match ? 'var(--accent)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  sections.forEach(s => navObs.observe(s));

  // ============================
  // 11. CONTACT FORM
  // ============================
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('formSubmit');

  form.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.textContent = '[ SENDING... ]';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = '[ SENT ✓ ]';
      success.classList.add('show');
      form.reset();
      setTimeout(() => {
        submitBtn.textContent = '[ SEND IT →]';
        submitBtn.disabled = false;
        success.classList.remove('show');
      }, 4000);
    }, 1400);
  });

  // ============================
  // 12. BACK TO TOP
  // ============================
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================
  // 13. PROJECT CARD TILT
  // ============================
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================
  // 14. KONAMI CODE EASTER EGG
  // ============================
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) {
        konamiIdx = 0;
        document.body.style.animation = 'none';
        document.querySelectorAll('.glitch-text').forEach(el => el.classList.add('glitching'));
        document.querySelectorAll('.project-visual').forEach(el => {
          const hue = Math.random() * 360;
          el.style.filter = `hue-rotate(${hue}deg)`;
        });
        alert('🎮 CHEAT CODE ACTIVATED\n[ DEVELOPER MODE UNLOCKED ]');
        setTimeout(() => document.querySelectorAll('.glitch-text').forEach(el => el.classList.remove('glitching')), 1000);
      }
    } else { konamiIdx = 0; }
  });

});
