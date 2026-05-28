// ============================================================
// PRELOADER — ANIMASI PROGRESS BAR (NO STUCK)
// ============================================================
(function() {
  const bar = document.getElementById('preloaderBar');
  const preloader = document.getElementById('preloader');
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;
    if (bar) bar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        if (preloader) preloader.classList.add('done');
      }, 350);
    }
  }, 120);

  // Failsafe: lumat preloader setelah 4 detik apapun yang terjadi
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('done')) {
      if (bar) bar.style.width = '100%';
      setTimeout(() => preloader.classList.add('done'), 200);
    }
  }, 4000);
})();


// ============================================================
// CUSTOM CURSOR
// ============================================================
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px'; }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .portfolio-card, .skill-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring && ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring && ring.classList.remove('hovering'));
});

// Hide cursor on touch devices
if ('ontouchstart' in window) {
  if (dot) dot.style.display = 'none';
  if (ring) ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}


// ============================================================
// THEME TOGGLE
// ============================================================
const themeBtn = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('sa-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
if (themeBtn) themeBtn.textContent = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const cur = html.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sa-theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
  });
}


// ============================================================
// MOBILE MENU
// ============================================================
const menuBtn = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

if (menuBtn && navbar) {
  menuBtn.addEventListener('click', () => {
    const open = navbar.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navbar.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navbar.classList.remove('open');
      menuBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}


// ============================================================
// HEADER SHRINK ON SCROLL
// ============================================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('shrink', window.scrollY > 60);
}, { passive: true });


// ============================================================
// TYPING ANIMATION
// ============================================================
const words = ['Web Developer', 'UI/UX Designer', 'Front-End Innovator', 'Digital Creator'];
let wIdx = 0, cIdx = 0, deleting = false;
const typEl = document.getElementById('typing-text');

function type() {
  if (!typEl) return;
  const word = words[wIdx];
  if (deleting) {
    typEl.textContent = word.slice(0, --cIdx);
  } else {
    typEl.textContent = word.slice(0, ++cIdx);
  }
  if (!deleting && cIdx === word.length) {
    setTimeout(() => { deleting = true; }, 2200);
  } else if (deleting && cIdx === 0) {
    deleting = false;
    wIdx = (wIdx + 1) % words.length;
  }
  setTimeout(type, deleting ? 45 : 95);
}
setTimeout(type, 900);


// ============================================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


// ============================================================
// SKILL RING ANIMATION
// ============================================================
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-ring__prog').forEach(circle => {
        const pct = parseInt(circle.getAttribute('data-pct'));
        const r = circle.r.baseVal.value;
        const circ = 2 * Math.PI * r;
        const offset = circ - (pct / 100) * circ;
        circle.style.strokeDasharray = circ;
        circle.style.strokeDashoffset = circ;
        requestAnimationFrame(() => {
          circle.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)';
          circle.style.strokeDashoffset = offset;
        });
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const skillsGrid = document.getElementById('skillsGrid');
if (skillsGrid) skillObs.observe(skillsGrid);


// ============================================================
// HERO 3D TILT
// ============================================================
const heroFrame = document.getElementById('heroFrame');
if (heroFrame) {
  heroFrame.addEventListener('mousemove', e => {
    const r = heroFrame.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroFrame.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale3d(1.02,1.02,1.02)`;
  });
  heroFrame.addEventListener('mouseleave', () => {
    heroFrame.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale3d(1,1,1)';
  });
}


// ============================================================
// PORTFOLIO FOCUS MODE
// ============================================================
const portfolioGrid = document.getElementById('portfolioGrid');
if (portfolioGrid) {
  portfolioGrid.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const isFocused = card.classList.contains('is-focus');
      portfolioGrid.querySelectorAll('.portfolio-card').forEach(c => c.classList.remove('is-focus'));
      if (isFocused) {
        portfolioGrid.classList.remove('has-focus');
      } else {
        card.classList.add('is-focus');
        portfolioGrid.classList.add('has-focus');
      }
    });
  });
}


// ============================================================
// ACTIVE NAV TRACKING
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObs.observe(s));


// ============================================================
// CONTACT FORM
// ============================================================
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('successMsg');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();
    if (name && email && msg) {
      if (successMsg) {
        successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    }
  });
}