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

// Custom Cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out"
  });
});

document.addEventListener('mousedown', () => {
  gsap.to(cursor, { scale: 0.5, duration: 0.2 });
});
document.addEventListener('mouseup', () => {
  gsap.to(cursor, { scale: 1, duration: 0.2 });
});

// Magnetic Buttons
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
    
    gsap.to(cursor, { scale: 1.5, duration: 0.2 });
  });

  elem.addEventListener('mouseleave', () => {
    gsap.to(elem, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    gsap.to(cursor, { scale: 1, duration: 0.2 });
  });
});

// Loading Animation
const loaderProgress = document.getElementById('loader-progress-fill');
const loaderPercent = document.getElementById('loader-percent');
let progress = 0;

// Prevent scrolling while loading
document.body.style.overflow = 'hidden';

const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 10) + 1;
  if (progress > 100) progress = 100;
  
  loaderProgress.style.width = `${progress}%`;
  loaderPercent.innerText = `${progress}%`;

  if (progress === 100) {
    clearInterval(interval);
    
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
      }
    });
    
    tl.to(".loader-content", {
      opacity: 0,
      y: -20,
      duration: 0.5,
      delay: 0.2
    })
    .to(".loader", {
      yPercent: -100,
      duration: 1,
      ease: "power4.inOut"
    })
    .fromTo(".hero-title .char", 
      { y: "100%" }, 
      { y: "0%", stagger: 0.05, duration: 2, ease: "elastic.out(1.1,0.75)" },
      "-=0.5"
    )
    .to(".hero-subtitle, .scroll-indicator, .navbar", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "elastic.out(1,1)"
    }, "-=0.5");
  }
}, 30);

// Scroll Animations
const sections = document.querySelectorAll('.section');
sections.forEach((sec) => {
  gsap.from(sec.querySelectorAll('.section-num, .section-title, .glass-card'), {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "elastic.out(0.80,0.75)",
    scrollTrigger: {
      trigger: sec,
      start: "top 30%",
    }
  });
});

// Three.js Background Canvas (Lightweight Particles)
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

// Smooth anchor scrolling integrated with Lenis
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
