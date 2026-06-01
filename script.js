// ==========================================
// 1. GLOBAL SETUP (GSAP & Lenis)
// ==========================================
// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: true,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==========================================
// 2. CUSTOM CURSOR & KINETIC TRAILING
// ==========================================
const cursor = document.querySelector('.cursor');
const cursorRing = document.createElement('div');
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorRing);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: "power2.out" });
});

gsap.ticker.add(() => {
  ringX += (mouseX - ringX) * 0.18; // Spring physics tension
  ringY += (mouseY - ringY) * 0.18;
  gsap.set(cursorRing, { x: ringX, y: ringY });
});

document.addEventListener('mousedown', () => {
  gsap.to(cursor, { scale: 0.5, duration: 0.2 });
  gsap.to(cursorRing, { scale: 0.8, duration: 0.2 });
});
document.addEventListener('mouseup', () => {
  gsap.to(cursor, { scale: 1, duration: 0.2 });
  gsap.to(cursorRing, { scale: 1, duration: 0.2 });
});

// ==========================================
// 3. MAGNETIC BUTTONS
// ==========================================
// Attracts specific buttons towards the cursor on hover
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach((elem) => {
  elem.addEventListener('mousemove', (e) => {
    const rect = elem.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const strength = elem.dataset.strength || 20;
    
    gsap.to(elem, {
      x: (x / rect.width) * strength,
      y: (y / rect.height) * strength,
      duration: 0.5,
      ease: "power2.out"
    });
    
    gsap.to(cursor, { scale: 0, duration: 0.2 });
    gsap.to(cursorRing, { scale: 1.8, borderColor: 'rgba(203, 166, 247, 0.5)', backgroundColor: 'rgba(203, 166, 247, 0.1)', duration: 0.3 });
  });

  elem.addEventListener('mouseleave', () => {
    gsap.to(elem, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    gsap.to(cursor, { scale: 1, duration: 0.2 });
    gsap.to(cursorRing, { scale: 1, borderColor: '#cba6f7', backgroundColor: 'transparent', duration: 0.3 });
  });
});

// ==========================================
// 4. LOADING SCREEN & HERO REVEAL
// ==========================================
const loaderCounter = document.getElementById('loader-percent');
let progress = 0;
document.body.style.overflow = 'hidden';

// Initial Reveal of Loader Elements
gsap.to(['.loader-counter', '.loader-label'], {
  y: 0,
  opacity: 1,
  duration: 1,
  stagger: 0.2,
  ease: "power4.out"
});

const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 2;
  if (progress > 100) progress = 100;
  
  if (loaderCounter) {
    loaderCounter.innerText = progress.toString().padStart(3, '0');
  }

  if (progress === 100) {
    clearInterval(interval);
    
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.style.overflow = 'visible';
      }
    });
    
    tl.to('.loader-wrapper', {
      y: -50,
      opacity: 0,
      duration: 0.6,
      ease: "power3.in"
    })
    .to('.loader-background', {
      scaleY: 0,
      transformOrigin: "top",
      duration: 1,
      ease: "expo.inOut"
    }, "-=0.2")
    .fromTo(".hero-title .char", 
      { y: "100%" }, 
      { y: "0%", stagger: 0.05, duration: 1.5, ease: "expo.out" },
      "-=0.5"
    )
    .to(".hero-subtitle, .scroll-indicator, .navbar", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=1");
  }
}, 40);
// ==========================================
// ABOUT STATS ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Infinity Loop (Continuous Path Drawing)
  const infinityPath = document.getElementById("infinity-path");
  if (infinityPath) {
    const length = infinityPath.getTotalLength();
    gsap.set(infinityPath, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(infinityPath, {
      strokeDashoffset: 0,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }

  // 2. Late Night Ideas Counter (0 to 100+)
  const ideasCounter = { val: 0 };
  gsap.to(ideasCounter, {
    val: 100,
    duration: 2.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-stats",
      start: "top 85%",
    },
    onUpdate: () => {
      const el = document.getElementById("stat-ideas");
      if (el) el.innerText = Math.floor(ideasCounter.val) + "+";
    }
  });

  // 3. Boring Days Carousel (Random 0 to 3 every 150ms)
  const boringEl = document.getElementById("stat-boring");
  if (boringEl) {
    boringEl.style.position = "relative";
    boringEl.style.display = "inline-flex";
    boringEl.style.overflow = "hidden";
    boringEl.style.height = "1em";
    boringEl.style.width = "1ch"; // Keep width stable
    boringEl.style.justifyContent = "center";
    boringEl.style.alignItems = "center";
    
    let currentSpan = document.createElement("div");
    currentSpan.innerText = "0";
    currentSpan.style.position = "absolute";
    currentSpan.style.height = "100%";
    currentSpan.style.width = "100%";
    currentSpan.style.display = "flex";
    currentSpan.style.alignItems = "center";
    currentSpan.style.justifyContent = "center";
    
    boringEl.innerHTML = "";
    boringEl.appendChild(currentSpan);

    function nextSpin() {
      let randomVal;
      do {
        randomVal = Math.floor(Math.random() * 4);
      } while (randomVal.toString() === currentSpan.innerText);
      
      const nextSpan = document.createElement("div");
      nextSpan.innerText = randomVal.toString();
      nextSpan.style.position = "absolute";
      nextSpan.style.height = "100%";
      nextSpan.style.width = "100%";
      nextSpan.style.display = "flex";
      nextSpan.style.alignItems = "center";
      nextSpan.style.justifyContent = "center";
      
      const dir = Math.random() > 0.5 ? 1 : -1;
      gsap.set(nextSpan, { yPercent: dir * 100 });
      boringEl.appendChild(nextSpan);
      
      // Slide takes 200ms, then a 100ms pause to cleanly read the number (300ms total)
      gsap.to(currentSpan, { yPercent: -dir * 100, duration: 0.2, ease: "power1.inOut" });
      gsap.to(nextSpan, { yPercent: 0, duration: 0.2, ease: "power1.inOut", onComplete: () => {
        if (currentSpan.parentNode) currentSpan.remove();
        currentSpan = nextSpan;
        setTimeout(nextSpin, 100);
      }});
    }
    
    setTimeout(nextSpin, 300);
  }
});


// ==========================================
// 6. THREE.JS BACKGROUND
// ==========================================
// Lightweight particle network acting as a subtle background
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Particles
const geometry = new THREE.BufferGeometry();
const vertices = [];
for ( let i = 0; i < 2000; i ++ ) {
  const x = 2000 * Math.random() - 1000;
  const y = 2000 * Math.random() - 1000;
  const z = 2000 * Math.random() - 1000;
  vertices.push( x, y, z );
}
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

const material = new THREE.PointsMaterial({ 
  size: 2, 
  color: 0xffffff,
  transparent: true,
  opacity: 0.4
});
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Mouse interaction for particles
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.5;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.5;
});

function animateThree() {
  requestAnimationFrame(animateThree);
  
  camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
  camera.lookAt(scene.position);
  
  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0005;
  
  renderer.render(scene, camera);
}
animateThree();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 7. SMOOTH SCROLLING NAV
// ==========================================
// Intercepts anchor links and routes them through Lenis for smoothness
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      lenis.scrollTo(targetElement);
    }
  });
});
// Hero Title Characters Hover Interaction
const heroChars = document.querySelectorAll('.hero-title .char');

heroChars.forEach((char) => {
  // We apply cursor pointer to individual letters for clarity
  char.style.cursor = 'pointer';

  char.addEventListener('mouseenter', () => {
    gsap.to(char, {
      y: "-15%",          // Moves the letter slightly up (proportional to font-size)
      scale: 1.08,        // Slight scale up
      duration: 1,
      ease: "power4.out"
    });
  });

  char.addEventListener('mouseleave', () => {
    gsap.to(char, {
      y: "0%",
      scale: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.75)" // Springy rebound matching the rest of the site
    });
  });
});

// ==========================================
// TERMINAL TYPING ANIMATION
// ==========================================
const terminalSequences = [
  { type: 'command', text: 'neofetch', delay: 800 },
  { type: 'output', text: `<span class="text-accent"><b>zenith@zenesis</b></span>
<span class="text-muted">--------------</span>
<span class="text-info">OS</span>: Arch Linux x86_64
<span class="text-info">Host</span>: Zenesis Custom Build
<span class="text-info">Kernel</span>: 6.6.10-arch1-1
<span class="text-info">Uptime</span>: 42 days, 13 hours
<span class="text-info">Packages</span>: 1337 (pacman)
<span class="text-info">Shell</span>: zsh 5.9
<span class="text-info">WM</span>: Hyprland
<span class="text-info">Terminal</span>: kitty
<span class="text-info">CPU</span>: AMD Ryzen 9 7950X (32) @ 5.700GHz
<span class="text-info">GPU</span>: NVIDIA GeForce RTX 4090
<span class="text-info">Memory</span>: 16384MiB / 64318MiB`, delay: 1500 },
  { type: 'command', text: 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"', delay: 1000 },
  { type: 'output', text: `<span class="text-muted">NAMES               STATUS              PORTS</span>
zenith-dns-pihole   Up 12 days          53/udp, 80/tcp
hermes-tasks-brain  Up 4 days (healthy)  8000/tcp -> 80
antigravity-coder   Up 18 hours         9000/tcp -> 9000
docker-proxy-nginx  Up 12 days          80/tcp -> 80, 443/tcp`, delay: 1500 },
  { type: 'command', text: 'echo "Ready to build the future."', delay: 1000 },
  { type: 'output', text: `<span class="text-success">Ready to build the future.</span>`, delay: 4000 }
];

function startTerminalAnimation() {
  const terminalBody = document.getElementById('terminal-body');
  if (!terminalBody) return;
  
  if (window.terminalIsRunning) return;
  window.terminalIsRunning = true;
  
  terminalBody.innerHTML = '';
  let seqIndex = 0;
  
  function runSequence() {
    if (!window.terminalAnimated) return;
    
    if (seqIndex >= terminalSequences.length) {
      setTimeout(() => {
        if (!window.terminalAnimated) return;
        terminalBody.innerHTML = '';
        seqIndex = 0;
        runSequence();
      }, 3000);
      return;
    }
    
    const seq = terminalSequences[seqIndex];
    
    if (seq.type === 'command') {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = `<span class="prompt">zenith@zenesis:~$ </span><span class="command-text"></span><span class="cursor-blink">|</span>`;
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      
      const cmdTextSpan = line.querySelector('.command-text');
      const cursorSpan = line.querySelector('.cursor-blink');
      
      let charIndex = 0;
      const cmdText = seq.text;
      
      function typeChar() {
        if (!window.terminalAnimated) return;
        if (charIndex < cmdText.length) {
          cmdTextSpan.textContent += cmdText[charIndex];
          charIndex++;
          terminalBody.scrollTop = terminalBody.scrollHeight;
          setTimeout(typeChar, Math.random() * 40 + 15);
        } else {
          cursorSpan.remove();
          seqIndex++;
          setTimeout(runSequence, seq.delay);
        }
      }
      
      setTimeout(typeChar, 300);
    } else if (seq.type === 'output') {
      const line = document.createElement('div');
      line.className = 'terminal-output';
      line.innerHTML = seq.text;
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      
      seqIndex++;
      setTimeout(runSequence, seq.delay);
    }
  }
  
  runSequence();
}

ScrollTrigger.create({
  trigger: "#lab",
  start: "top 80%",
  onEnter: () => {
    if (!window.terminalAnimated) {
      window.terminalAnimated = true;
      startTerminalAnimation();
    }
  }
});

// ==========================================
// ADVANCED TEXT REVEAL (Synapser Studio Style)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Wait slightly to ensure fonts are loaded so SplitType calculates widths correctly
  setTimeout(() => {
    // Basic element fade-ins (cards, numbers) - excluding link cards for a custom animation
    const sections = document.querySelectorAll('.section');
    sections.forEach((sec) => {
      gsap.from(sec.querySelectorAll('.section-num, .glass-card:not(.about-text):not(.lab-info):not(.link-card)'), {
        scrollTrigger: {
          trigger: sec,
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    });

    // Unique Blur-In Animation for "My Links" Cards
    const linkCards = document.querySelectorAll('.link-card');
    if (linkCards.length > 0) {
      gsap.fromTo(linkCards, 
        { 
          opacity: 0, 
          y: 60, 
          filter: "blur(20px)" 
        },
        {
          scrollTrigger: {
            trigger: "#links",
            start: "top 40%",
          },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out"
        }
      );
    }

    // Advanced Text Reveal for typography
    const revealElements = document.querySelectorAll('.section-title, .about-text p, .lab-info p, .contact-box p');
    
    revealElements.forEach((el) => {
      // Split text into lines, words, and chars
      const split = new SplitType(el, { types: 'lines, words, chars' });
      
      // Wrap each line in a hidden overflow container to create the "reveal from bottom" mask
      split.lines.forEach(line => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'block'; // Ensure block formatting context
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });

      // Animate the characters up and rotate slightly for a cinematic, premium feel
      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        y: '100%',
        rotationZ: 3,
        opacity: 0,
        duration: 0.9,
        stagger: 0.015,
        ease: 'power4.out'
      });
    });
  }, 100);
});

// ==========================================
// 10. HERMES SKILLS MARKETPLACE DYNAMIC GENERATOR
// ==========================================
// Renders the skill cards and handles JSZip compression & download
const marketplaceGrid = document.getElementById('skills-grid');
if (marketplaceGrid) {
  const skills = [
    { id: 'ares-persona', icon: 'fa-solid fa-brain', files: ['SKILL.md', 'references/audit-log.md'] },
    { id: 'audit-approval-bypass', icon: 'fa-solid fa-shield-halved', files: ['SKILL.md', 'references/audit-guide.md'] },
    { id: 'audit-mcp', icon: 'fa-solid fa-shield', files: ['SKILL.md', 'references/audit-checklist.md'] },
    { id: 'coinmaxxing', icon: 'fa-solid fa-coins', files: ['SKILL.md'] },
    { id: 'docker-management', icon: 'fa-brands fa-docker', files: ['SKILL.md'] },
    { id: 'duckduckgo-search', icon: 'fa-solid fa-magnifying-glass', files: ['SKILL.md', 'scripts/duckduckgo.sh'] },
    { id: 'hermes-agent', icon: 'fa-solid fa-robot', files: ['SKILL.md', 'references/fallback-providers.md', 'references/optimization-guide.md'] },
    { id: 'hermes-gateway-deploy', icon: 'fa-solid fa-bolt', files: ['SKILL.md'] },
    { id: 'hermes-local-auxiliary', icon: 'fa-solid fa-microchip', files: ['SKILL.md', 'references/freellmapi-integration.md', 'references/hermes-aux-config.md', 'references/model-switching-workflow.md', 'references/server-config.md'] },
    { id: 'hermes-skin-authoring', icon: 'fa-solid fa-terminal', files: ['SKILL.md'] },
    { id: 'lonepirate', icon: 'fa-solid fa-skull-crossbones', files: ['SKILL.md'] }
  ];

  skills.forEach(skill => {
    const title = skill.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    const card = document.createElement('div');
    card.className = 'skill-card magnetic';
    card.setAttribute('data-strength', '5');
    card.innerHTML = `
      <div class="skill-header">
        <div class="skill-icon">
          <i class="${skill.icon} fa-fw fa-xl"></i>
        </div>
        <div class="skill-info">
          <h3>${title}</h3>
          <p>pkg: ${skill.id}</p>
        </div>
      </div>
      <div class="skill-actions">
        <button class="btn-download" onclick="downloadSkillAsZip(this, '${skill.id}')">
          <i class="fa-solid fa-download"></i> Download Zip
        </button>
      </div>
    `;
    marketplaceGrid.appendChild(card);
    
    // 3D Isometric Tilt Matrix
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      gsap.to(card, {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

  window.downloadSkillAsZip = function(btn, skillKey) {
    if (btn.classList.contains('downloading')) return;
    
    const skill = skills.find(s => s.id === skillKey);
    if (!skill) return;
    const files = skill.files;
    const card = btn.closest('.skill-card');

    // Structural dissolve micro-animation on card
    gsap.to(card.querySelectorAll('.skill-info, .skill-icon'), {
      opacity: 0.3,
      filter: 'blur(4px)',
      y: 10,
      duration: 0.4,
      ease: 'power2.in'
    });

    const originalHtml = btn.innerHTML;
    btn.classList.add('downloading');
    btn.innerHTML = \`<div class="dl-progress-bar"></div><span class="dl-text">Compiling 0%</span>\`;
    const progressBar = btn.querySelector('.dl-progress-bar');
    const progressText = btn.querySelector('.dl-text');

    // Offload heavy JSZip computation to a dedicated Web Worker file
    // This avoids opaque Blob URL security restrictions in some browsers
    const worker = new Worker('worker.js');

    worker.onmessage = function(e) {
      if (e.data.type === 'progress') {
        const percent = Math.floor(e.data.percent);
        gsap.to(progressBar, { width: \`\${percent}%\`, duration: 0.1 });
        progressText.innerText = \`Compiling \${percent}%\`;
      } else if (e.data.type === 'done') {
        window.saveAs(e.data.content, \`\${skillKey}.zip\`);
        cleanup(true);
      } else if (e.data.type === 'error') {
        console.error('Download failed:', e.data.error);
        alert('Failed to compile files.');
        cleanup(false);
      }
    };

    function cleanup(success) {
      worker.terminate();
      btn.innerHTML = success ? '<i class="fa-solid fa-check"></i> Complete' : originalHtml;
      
      gsap.to(card.querySelectorAll('.skill-info, .skill-icon'), {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
      
      setTimeout(() => {
        btn.classList.remove('downloading');
        btn.innerHTML = originalHtml;
      }, 2000);
    }

    // Safely calculate the absolute base URL based on the current page's origin to avoid Blob URL CORS mapping issues
    const baseUrl = new URL('../assets/lab/hermes-skills/', window.location.href).href;
    worker.postMessage({ skillKey, files, baseUrl });
  };
}
