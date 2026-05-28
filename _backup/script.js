/* ======================================================
   Zenith — Interactive Script (anime.js enhanced)
   Loading screen, particle canvas, scroll animations,
   magnetic buttons, tilt cards, counters, form
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading');

  // ----- Loading Screen -----
  runLoadingScreen(() => {
    document.body.classList.remove('loading');

    // After loader finishes, start site animations
    initParticleCanvas();
    initCursorGlow();
    initNavbar();
    initHeroAnimations();
    initFloatingShapes();
    initScrollAnimations();
    initMagneticButtons();
    initRippleButtons();
    initTiltCards();
    initContactForm();
    initSmoothScroll();
    initThemeEngine();
    initMobileMenu();
  });
});

/* ==============================
   MOBILE MENU TOGGLE
   ============================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('nav-menu');
  const menuLinks = document.querySelectorAll('.nav-menu .side-item');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==============================
   THEME ENGINE (Solar Eclipse)
   ============================== */
function initThemeEngine() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  // Check local storage
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'eclipse') {
    document.documentElement.setAttribute('data-theme', 'eclipse');
  }

  toggleBtn.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'eclipse') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'eclipse');
      localStorage.setItem('theme', 'eclipse');
    }
  });
}

/* ==============================
   LOADING SCREEN (anime.js)
   ============================== */
function runLoadingScreen(onComplete) {
  const loader = document.getElementById('loader');
  const progressFill = document.getElementById('loader-progress-fill');
  const percentText = document.getElementById('loader-percent');

  // Build stagger grid
  const gridEl = document.getElementById('stagger-grid');
  if (gridEl) {
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('div');
      cell.classList.add('stagger-cell');
      gridEl.appendChild(cell);
    }
  }

  // Intro timeline: reveal grid and show progress bar
  const introTl = anime.timeline({
    easing: 'easeOutExpo',
    complete: () => {
      // Start loading assets after intro animation
      loadAssets().then(() => {
        // Ensure progress shows 100%
        progressFill.style.width = '100%';
        percentText.textContent = '100%';

        // Finish timeline: hide progress, ripple out, hide loader
        const finishTl = anime.timeline({
          easing: 'easeOutExpo',
          complete: () => {
            loader.classList.add('hidden');
            loader.style.display = 'none';
            if (onComplete) onComplete();
          }
        });

        // 4. Hide progress bar
        finishTl.add({
          targets: '.loader-progress',
          opacity: [1, 0],
          duration: 400,
          easing: 'easeInQuad',
        });

        // 5. Stagger Grid Ripple Out
        finishTl.add({
          targets: '.stagger-cell',
          scale: [
            { value: 1.2, easing: 'easeOutSine', duration: 200 },
            { value: 0, easing: 'easeInOutQuad', duration: 500 }
          ],
          opacity: [1, 0],
          delay: anime.stagger(50, { grid: [10, 10], from: 'center' })
        });

        // 6. Fade out loader content
        finishTl.add({
          targets: '.loader-content',
          opacity: [1, 0],
          scale: [1, 0.9],
          duration: 400,
          easing: 'easeInExpo',
        });

        // 7. Wipe slide out
        finishTl.add({
          targets: '.loader-wipe-left',
          translateX: [0, '-100%'],
          duration: 800,
          easing: 'easeInOutExpo',
        });
        finishTl.add({
          targets: '.loader-wipe-right',
          translateX: [0, '100%'],
          duration: 800,
          easing: 'easeInOutExpo',
        }, '-=800');

        // 8. Fade out background
        finishTl.add({
          targets: '.loader-bg',
          opacity: [1, 0],
          duration: 400,
          easing: 'easeOutQuad',
        }, '-=400');
      });
    }
  });

  // 1. Stagger Grid Reveal
  introTl.add({
    targets: '.stagger-cell',
    scale: [
      { value: 0.1, easing: 'easeOutSine', duration: 400 },
      { value: 1, easing: 'easeInOutQuad', duration: 800 }
    ],
    opacity: [0, 1],
    delay: anime.stagger(100, { grid: [10, 10], from: 'center' })
  });

  // 2. Show progress bar
  introTl.add({
    targets: '.loader-progress',
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 500,
  }, '-=800');

}

/* ==============================
   PARTICLE CANVAS
   ============================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECTION_DISTANCE = 150;

  const colors = [
    'rgba(124, 58, 237, ',
    'rgba(45, 212, 191, ',
    'rgba(99, 102, 241, ',
    'rgba(168, 85, 247, ',
    'rgba(6, 182, 212, ',
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      color: color,
      alpha: Math.random() * 0.5 + 0.2,
    };
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const lineAlpha = (1 - dist / CONNECTION_DISTANCE) * 0.08;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(124, 58, 237, ' + lineAlpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', resize);
}
function loadAssets() {
  return new Promise((resolve) => {
    const images = Array.from(document.images);
    const totalAssets = images.length + 1; // include fonts
    let loaded = 0;
    const progressFill = document.getElementById('loader-progress-fill');
    const percentText = document.getElementById('loader-percent');

    const updateProgress = () => {
      const pct = Math.round((loaded / totalAssets) * 100);
      progressFill.style.width = pct + '%';
      percentText.textContent = pct + '%';
      if (loaded >= totalAssets) resolve();
    };

    // Handle images
    if (images.length === 0) {
      // No images, will rely on fonts
    }
    images.forEach((img) => {
      if (img.complete) {
        loaded++;
        updateProgress();
      } else {
        img.addEventListener('load', () => {
          loaded++;
          updateProgress();
        });
        img.addEventListener('error', () => {
          loaded++;
          updateProgress();
        });
      }
    });

    // Wait for fonts to be ready
    document.fonts.ready.then(() => {
      loaded++;
      updateProgress();
    });
  });
}
/* ==============================
   CURSOR GLOW
   ============================== */
function initCursorGlow() {
  if ('ontouchstart' in window) return;

  const glow = document.createElement('div');
  glow.classList.add('cursor-glow');
  document.body.appendChild(glow);

  let mouseX = -500, mouseY = -500;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Use anime.js for smooth spring-like cursor follow
  let glowX = -500, glowY = -500;
  function updateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
}

/* ==============================
   NAVBAR
   ============================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Fade in navbar with anime.js
  anime({
    targets: navbar,
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800,
    easing: 'easeOutExpo',
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==============================
   HERO ANIMATIONS (GSAP Cinematic)
   ============================== */
function initHeroAnimations() {
  const letters = document.querySelectorAll('.zenith-letter');
  const lineTop = document.getElementById('hero-line-top');
  const lineBottom = document.getElementById('hero-line-bottom');
  const subtitle = document.getElementById('hero-subtitle');
  const subtitleWords = document.querySelectorAll('.subtitle-word');
  const subtitleDots = document.querySelectorAll('.subtitle-dot');

  // Master timeline
  const tl = gsap.timeline({
    defaults: { ease: 'expo.out' }
  });

  // 1. Letters fly in from below with 3D rotation + blur
  tl.to(letters, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: 'blur(0px)',
    duration: 1.4,
    stagger: {
      each: 0.08,
      from: 'center'
    },
    ease: 'back.out(1.4)',
    onStart: () => {
      // Set initial blur via GSAP
      gsap.set(letters, { filter: 'blur(12px)' });
    }
  });

  // 2. Accent lines expand from center
  tl.to([lineTop, lineBottom], {
    opacity: 1,
    width: '220px',
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6');

  // 3. Subtitle container fades in
  tl.to(subtitle, {
    opacity: 1,
    y: 0,
    duration: 0.6,
  }, '-=0.5');

  // 4. Subtitle words stagger in
  tl.to(subtitleWords, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.12,
    ease: 'power2.out'
  }, '-=0.4');

  // 5. Subtitle dots pop in
  tl.to(subtitleDots, {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.5)'
  }, '-=0.4');

  // 6. Side nav elements
  tl.to('.side-nav', {
    opacity: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  }, '-=0.4');

  // 7. Scroll indicator
  tl.to('.scroll-indicator', {
    opacity: 1,
    y: 0,
    duration: 0.6,
  }, '-=0.3');

  // --- Continuous Animations ---

  // Gradient background position shift on each letter
  gsap.to(letters, {
    backgroundPosition: '0% 100%',
    duration: 3,
    stagger: {
      each: 0.2,
      repeat: -1,
      yoyo: true
    },
    ease: 'sine.inOut',
    delay: 2
  });

  // Gentle floating motion on the whole title
  gsap.to('#hero-title', {
    y: -6,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    delay: 2.5
  });

  // --- Interactive: Letter proximity glow on mousemove ---
  const heroSection = document.getElementById('hero');
  if (heroSection && !('ontouchstart' in window)) {
    heroSection.addEventListener('mousemove', (e) => {
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;
        const dx = e.clientX - letterCenterX;
        const dy = e.clientY - letterCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 300;
        const proximity = Math.max(0, 1 - distance / maxDist);

        // Subtle Y shift based on mouse proximity
        gsap.to(letter, {
          y: -proximity * 8,
          scale: 1 + proximity * 0.05,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      gsap.to(letters, {
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      });
    });
  }
}

/* ==============================
   FLOATING GEOMETRIC SHAPES
   (anime.js parallax float)
   ============================== */
function initFloatingShapes() {
  const shapes = document.querySelectorAll('.shape');

  // Fade shapes in with stagger
  anime({
    targets: '.shape',
    opacity: [0, 1],
    duration: 1500,
    delay: anime.stagger(200),
    easing: 'easeOutQuad',
  });

  // Give each shape a unique continuous floating animation
  shapes.forEach((shape, i) => {
    const xRange = 15 + Math.random() * 30;
    const yRange = 15 + Math.random() * 30;
    const rotRange = 30 + Math.random() * 60;
    const dur = 4000 + i * 1500;

    anime({
      targets: shape,
      translateX: [-xRange, xRange],
      translateY: [-yRange, yRange],
      rotate: [-rotRange, rotRange],
      duration: dur,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });
  });

  // Parallax on mouse move
  if (!'ontouchstart' in window) return;

  document.addEventListener('mousemove', (e) => {
    const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
    const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

    shapes.forEach((shape, i) => {
      const factor = (i + 1) * 8;
      anime({
        targets: shape,
        translateX: `+=${xPercent * factor}`,
        translateY: `+=${yPercent * factor}`,
        duration: 800,
        easing: 'easeOutQuad',
      });
    });
  });
}

/* ==============================
   SCROLL ANIMATIONS (anime.js)
   ============================== */
function initScrollAnimations() {
  const scrollElements = document.querySelectorAll('.animate-on-scroll');
  const sectionHeaders = document.querySelectorAll('.section-header');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Use anime.js for the reveal
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 900,
            easing: 'easeOutExpo',
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  scrollElements.forEach((el) => observer.observe(el));

  // Section header line reveal
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-visible');
          headerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  sectionHeaders.forEach((el) => headerObserver.observe(el));

  // Skill pills stagger animation
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target.querySelectorAll('.skill-pill'),
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.8, 1],
            delay: anime.stagger(60),
            duration: 600,
            easing: 'easeOutBack',
            complete: function(anim) {
              anim.animatables.forEach(a => {
                a.target.style.transform = '';
              });
            }
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const skillsContainer = document.querySelector('.skills-container');
  if (skillsContainer) skillObserver.observe(skillsContainer);

  // Link cards stagger animation
  const linksObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.links-grid .link-card',
            opacity: [0, 1],
            translateX: [-40, 0],
            duration: 700,
            delay: anime.stagger(100),
            easing: 'easeOutExpo',
            complete: function(anim) {
              anim.animatables.forEach(a => {
                a.target.style.transform = '';
              });
            }
          });
          linksObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const linksGrid = document.querySelector('.links-grid');
  if (linksGrid) linksObserver.observe(linksGrid);

  // Stat cards counter + pop animation
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Pop in stat cards
          anime({
            targets: '.stat-card',
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.85, 1],
            delay: anime.stagger(120),
            duration: 700,
            easing: 'easeOutBack',
            complete: function(anim) {
              anim.animatables.forEach(a => {
                a.target.style.transform = '';
              });
            }
          });

          // Animate counters
          document.querySelectorAll('.stat-number[data-count]').forEach((el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const obj = { val: 0 };
            anime({
              targets: obj,
              val: target,
              round: 1,
              duration: 2000,
              easing: 'easeOutExpo',
              update: () => {
                el.textContent = obj.val;
              },
            });
          });

          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) statObserver.observe(aboutStats);

  // Contact form slide-in
  const contactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: '.contact-form .form-group, .contact-form .form-row, .contact-form .btn-submit',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100),
            duration: 700,
            easing: 'easeOutExpo',
          });
          contactObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) contactObserver.observe(contactForm);
  initGSAPScrollText();
}

function initGSAPScrollText() {
  const targets = document.querySelectorAll('.hero-subtitle-minimal, .hero-side-links');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'});
      } else {
        gsap.to(entry.target, {opacity: 0, y: -20, duration: 0.8, ease: 'power3.in'});
      }
    });
  }, {threshold: 0.1});

  targets.forEach(t => observer.observe(t));
}


/* ==============================
   MAGNETIC BUTTONS (anime.js)
   ============================== */
function initMagneticButtons() {
  if ('ontouchstart' in window) return;

  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      anime({
        targets: btn,
        translateX: x * 0.3,
        translateY: y * 0.3,
        duration: 300,
        easing: 'easeOutQuad',
      });
    });

    btn.addEventListener('mouseleave', () => {
      anime({
        targets: btn,
        translateX: 0,
        translateY: 0,
        duration: 600,
        easing: 'easeOutElastic(1, 0.4)',
      });
    });
  });
}

/* ==============================
   RIPPLE BUTTONS
   ============================== */
function initRippleButtons() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);

      anime({
        targets: ripple,
        scale: [0, 4],
        opacity: [0.3, 0],
        duration: 600,
        easing: 'easeOutExpo',
        complete: () => ripple.remove(),
      });
    });
  });
}

/* ==============================
   TILT CARDS (anime.js)
   ============================== */
function initTiltCards() {
  if ('ontouchstart' in window) return;

  const cards = document.querySelectorAll('.stat-card, .link-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const yPercent = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      anime({
        targets: card,
        rotateY: xPercent * 8,
        rotateX: -yPercent * 8,
        duration: 200,
        easing: 'easeOutQuad',
      });
    });

    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        rotateY: 0,
        rotateX: 0,
        duration: 600,
        easing: 'easeOutElastic(1, 0.5)',
      });
    });
  });
}

/* ==============================
   CONTACT FORM (anime.js)
   ============================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formContainer = form.parentElement;

    // Animate form out
    anime({
      targets: form,
      opacity: [1, 0],
      translateY: [0, -20],
      scale: [1, 0.95],
      duration: 400,
      easing: 'easeInExpo',
      complete: () => {
        form.style.display = 'none';

        const success = document.createElement('div');
        success.classList.add('form-success');
        success.innerHTML = `
          <div class="form-success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3>Message Sent!</h3>
          <p>Thanks for reaching out. I'll get back to you soon.</p>
        `;
        formContainer.appendChild(success);

        // Animate success in with anime.js
        anime.timeline({ easing: 'easeOutExpo' })
          .add({
            targets: '.form-success',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
          })
          .add({
            targets: '.form-success-icon',
            scale: [0, 1],
            rotate: ['-180deg', '0deg'],
            duration: 800,
            easing: 'easeOutElastic(1, 0.5)',
          }, '-=500')
          .add({
            targets: '.form-success-icon svg polyline',
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 500,
            easing: 'easeInOutQuart',
          }, '-=300')
          .add({
            targets: '.form-success h3',
            opacity: [0, 1],
            translateY: [15, 0],
            duration: 500,
          }, '-=300')
          .add({
            targets: '.form-success p',
            opacity: [0, 1],
            translateY: [15, 0],
            duration: 500,
          }, '-=300');
      },
    });
  });
}

/* ==============================
   SMOOTH SCROLL
   ============================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Smooth scroll with anime.js
      const targetY = targetEl.getBoundingClientRect().top + window.scrollY;

      anime({
        targets: { scrollY: window.scrollY },
        scrollY: targetY,
        duration: 1200,
        easing: 'easeInOutExpo',
        update: (anim) => {
          window.scrollTo(0, anim.animations[0].currentValue);
        },
      });
    });
  });
}
