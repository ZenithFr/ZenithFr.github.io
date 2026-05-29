// Initialize Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI DOM References
const scoreVal = document.getElementById('score-val');
const highscoreVal = document.getElementById('highscore-val');
const startOverlay = document.getElementById('start-overlay');
const gameoverOverlay = document.getElementById('gameover-overlay');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScore = document.getElementById('final-score');

// NEW: Username & Leaderboard DOM References
const usernameInput = document.getElementById('username-input');
const leaderboardList = document.getElementById('leaderboard-list');
let currentUsername = '';

// Global Game States
let gameState = 'MENU'; // 'MENU' | 'PLAYING' | 'GAMEOVER'
let score = 0;
let highscore = localStorage.getItem('zenith_highscore') || 0;
highscoreVal.innerText = String(highscore).padStart(5, '0');

let gameSpeed = 6;
let timeElapsed = 0;
let nextObstacleTimer = 0;
let obstacles = [];
let particles = [];
let screenshake = 0;

// Update Custom Cursor Tracking
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
});

// Dynamic Physics Settings
const PHYSICS = {
  gravity: 0.7,
  groundY: 280,
  maxSpeed: 15,
};

// Populate Leaderboard on Script Startup
loadLeaderboard();

// Leaderboard Synchronization (Handles Server leaderdino.txt + LocalStorage Fallback)
async function loadLeaderboard() {
  let scores = [];
  try {
    const response = await fetch('save_score.php');
    if (response.ok) {
      scores = await response.json();
    } else {
      throw new Error();
    }
  } catch (err) {
    // FALLBACK: Read from browser localStorage if server doesn't exist
    scores = JSON.parse(localStorage.getItem('zenith_scores')) || [];
  }

  // Sort and display the top 5 scores
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5);

  leaderboardList.innerHTML = '';
  if (scores.length === 0) {
    leaderboardList.innerHTML = '<div class="leaderboard-row empty">No registered systems in memory</div>';
  } else {
    scores.forEach((entry, idx) => {
      leaderboardList.innerHTML += `
        <div class="leaderboard-row">
          <span class="rank">#${idx + 1}</span>
          <span class="name">${entry.name}</span>
          <span class="score">${entry.score}</span>
        </div>
      `;
    });
  }
}

async function saveScore(name, finalScore) {
  // Always write score locally in localStorage
  let localScores = JSON.parse(localStorage.getItem('zenith_scores')) || [];
  localScores.push({ name: name, score: finalScore });
  localStorage.setItem('zenith_scores', JSON.stringify(localScores));

  // Try writing to server-side leaderdino.txt file via save_score.php
  try {
    await fetch('save_score.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, score: finalScore })
    });
  } catch (err) {
    console.log("No backend server detected. Score saved securely in browser storage.");
  }
}

// Player (The Zenith Runner Geometric Dino)
class Player {
  constructor() {
    this.x = 80;
    this.y = PHYSICS.groundY;
    this.width = 44;
    this.height = 44;
    this.velocityY = 0;
    this.isJumping = false;
    this.isDucking = false;
    
    // Animation properties
    this.scaleX = 1;
    this.scaleY = 1;
  }

  jump() {
    if (!this.isJumping && !this.isDucking) {
      this.velocityY = -12.5;
      this.isJumping = true;
      // Squash & stretch: stretch vertically when jumping
      this.scaleY = 1.35;
      this.scaleX = 0.75;
      createParticleExplosion(this.x + this.width / 2, PHYSICS.groundY, '#86868b', 10);
    }
  }

  duck() {
    if (this.isJumping) {
      // 1. CANCEL JUMP (Fast Fall / Dash Down)
      this.velocityY = 15; // Rapid downward speed
      this.scaleY = 1.4;   // Stretch vertically to show velocity
      this.scaleX = 0.7;   // Compress horizontally
      
      // Emit aesthetic vertical wind trail particles pointing up
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(
          this.x + this.width / 2 + (Math.random() - 0.5) * 16,
          this.y,
          (Math.random() - 0.5) * 2,
          -3 - Math.random() * 4, // Shoot upwards as we fly down
          Math.random() * 2 + 1,
          'rgba(255, 255, 255, 0.4)'
        ));
      }
    } else {
      // 2. NORMAL GROUND DUCK
      this.isDucking = true;
      this.height = 24;
      this.scaleY = 0.6;
      this.scaleX = 1.3;
    }
  }

  stopDuck() {
    if (this.isDucking) {
      this.isDucking = false;
      this.height = 44;
      this.scaleY = 1.2; // slight spring up
      this.scaleX = 0.9;
    }
  }

  update() {
    // Gravitational Pull
    this.y += this.velocityY;
    
    if (this.y < PHYSICS.groundY - (this.isDucking ? 24 : 44)) {
      this.velocityY += PHYSICS.gravity;
    } else {
      this.velocityY = 0;
      
      if (this.isJumping) {
        this.isJumping = false;
        
        // If they keep holding down/shift as they land, transition smoothly into a slide
        if (keys['ArrowDown'] || keys['ShiftLeft'] || keys['ShiftRight']) {
          this.isDucking = true;
          this.height = 24;
          this.scaleY = 0.45; // Hard squash for fast fall impact
          this.scaleX = 1.55;
          screenshake = 8;    // Stronger screen impact shake
          createParticleExplosion(this.x + this.width / 2, PHYSICS.groundY, '#ffffff', 14); // Larger impact burst
        } else {
          // Standard jump landing
          this.scaleY = 0.7;
          this.scaleX = 1.3;
          screenshake = 5;
          createParticleExplosion(this.x + this.width / 2, PHYSICS.groundY, '#f5f5f7', 8);
        }
      }
      
      // Keep aligned to the ground based on slide height state
      this.y = PHYSICS.groundY - (this.isDucking ? 24 : 44);
    }

    // Ease visual scaling back to default values
    this.scaleX += (1 - this.scaleX) * 0.15;
    this.scaleY += (1 - this.scaleY) * 0.15;

    // Generate dust trail if on the ground
    if (!this.isJumping && Math.random() < 0.25) {
      particles.push(new Particle(
        this.x, 
        PHYSICS.groundY - (this.isDucking ? 10 : 5), 
        -gameSpeed * 0.5, 
        (Math.random() - 0.5) * 2, 
        Math.random() * 3 + 1, 
        'rgba(134, 134, 139, 0.3)'
      ));
    }
  }

  draw() {
    ctx.save();
    
    // FIXED: Translates using the dynamic bottom of the player (this.y + this.height)
    ctx.translate(this.x + this.width / 2, this.y + this.height);
    ctx.scale(this.scaleX, this.scaleY);

    // Apply glowing stroke styling matching the site design
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';

    ctx.beginPath();
    
    // Abstract Minimalist Geometric "Dino" SVG-style wireframe
    if (this.isDucking) {
      // Sleek sliding prism structure
      ctx.moveTo(-25, 0);
      ctx.lineTo(-20, -24);
      ctx.lineTo(15, -24);
      ctx.lineTo(25, -12);
      ctx.lineTo(15, 0);
    } else {
      // High-tech geometric dinosaur outline
      ctx.moveTo(-18, 0); // Tail bottom
      ctx.lineTo(-24, -20); // Tail top
      ctx.lineTo(-12, -26); // Hip
      ctx.lineTo(-12, -44); // Neck back
      ctx.lineTo(10, -44); // Head top
      ctx.lineTo(16, -38); // Nose
      ctx.lineTo(6, -32); // Jaw
      ctx.lineTo(0, -22); // Shoulder
      ctx.lineTo(8, -14); // Arm
      ctx.lineTo(0, -8); // Belly
      ctx.lineTo(12, 0); // Front leg
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

// Particle System Classes
class Particle {
  constructor(x, y, vx, vy, size, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.alpha = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.03;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createParticleExplosion(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    particles.push(new Particle(
      x, 
      y, 
      Math.cos(angle) * speed, 
      Math.sin(angle) * speed, 
      Math.random() * 4 + 1.5, 
      color
    ));
  }
}

// Obstacles Classes
class Obstacle {
  constructor() {
    this.x = canvas.width + 50;
    
    // 3 Obstacle configurations: Small Spike, Large Crystal Monolith, Aerial Drone Block
    const type = Math.floor(Math.random() * 3);
    
    if (type === 0) {
      // Sleek Spike Cluster
      this.width = 30;
      this.height = 36;
      this.y = PHYSICS.groundY - this.height;
      this.drawType = 'spike';
    } else if (type === 1) {
      // Monolith wall
      this.width = 38;
      this.height = 54;
      this.y = PHYSICS.groundY - this.height;
      this.drawType = 'monolith';
    } else {
      // Floating Drone / Flying Gate
      this.width = 34;
      this.height = 24;
      this.y = PHYSICS.groundY - 74; // Requires ducking or well-timed jump
      this.drawType = 'drone';
    }
  }

  update() {
    this.x -= gameSpeed;
  }

  draw() {
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#f5f5f7';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';

    ctx.beginPath();
    if (this.drawType === 'spike') {
      ctx.moveTo(this.x, this.y + this.height);
      ctx.lineTo(this.x + this.width / 2, this.y);
      ctx.lineTo(this.x + this.width, this.y + this.height);
    } else if (this.drawType === 'monolith') {
      ctx.rect(this.x, this.y, this.width, this.height);
    } else if (this.drawType === 'drone') {
      // Floating sharp crystal outline
      ctx.moveTo(this.x + this.width / 2, this.y);
      ctx.lineTo(this.x + this.width, this.y + this.height / 2);
      ctx.lineTo(this.x + this.width / 2, this.y + this.height);
      ctx.lineTo(this.x, this.y + this.height / 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

// Instantiate Global Player
let player = new Player();

// Core Input Handlers
const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (gameState !== 'PLAYING') return;

  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    player.jump();
  }
  if (e.code === 'ArrowDown' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    e.preventDefault();
    player.duck();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
  if (gameState !== 'PLAYING') return;

  if (e.code === 'ArrowDown' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    player.stopDuck();
  }
});

// Mobile/Touch Support Integration
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (gameState !== 'PLAYING') return;
  
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  
  // Left half of screen controls ducks, right half jumps
  if (touchX < window.innerWidth / 2) {
    player.duck();
  } else {
    player.jump();
  }
});

canvas.addEventListener('touchend', () => {
  if (gameState === 'PLAYING') {
    player.stopDuck();
  }
});

// Grid Flow Decorative Background
function drawGrid() {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;

  // Running speed responsive horizontal grids
  const gridSpace = 40;
  const offset = (timeElapsed * gameSpeed) % gridSpace;

  for (let x = -offset; x < canvas.width; x += gridSpace) {
    ctx.beginPath();
    ctx.moveTo(x, PHYSICS.groundY);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw Ground Plane
function drawGround() {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, PHYSICS.groundY);
  ctx.lineTo(canvas.width, PHYSICS.groundY);
  ctx.stroke();
  ctx.restore();
}

// Game Flow System Core Functions
function resetGame() {
  score = 0;
  gameSpeed = 6;
  timeElapsed = 0;
  obstacles = [];
  particles = [];
  player = new Player();
  nextObstacleTimer = 0;
  screenshake = 0;
  scoreVal.innerText = '00000';
}

function startGame() {
  const enteredName = usernameInput.value.trim().toUpperCase();
  
  if (!enteredName) {
    // Highlight missing username input field
    usernameInput.style.borderColor = '#ff3333';
    usernameInput.placeholder = 'NAME REQUIRED';
    setTimeout(() => {
      usernameInput.style.borderColor = '';
      usernameInput.placeholder = 'ENTER HANDLE';
    }, 1000);
    return;
  }

  currentUsername = enteredName;
  resetGame();
  gameState = 'PLAYING';
  startOverlay.classList.add('hidden');
  gameoverOverlay.classList.add('hidden');
}

function triggerGameOver() {
  gameState = 'GAMEOVER';
  finalScore.innerText = Math.floor(score);
  
  // Save run records & update leaderboard rankings
  saveScore(currentUsername, Math.floor(score)).then(() => {
    loadLeaderboard();
  });

  if (score > highscore) {
    highscore = Math.floor(score);
    localStorage.setItem('zenith_highscore', highscore);
    highscoreVal.innerText = String(highscore).padStart(5, '0');
  }

  // Large decorative crash particles
  createParticleExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ffffff', 24);
  screenshake = 15;
  gameoverOverlay.classList.remove('hidden');
}

// Collision Detection Box Intersection
function checkCollision(rect1, rect2) {
  // Give slightly forgiving hitboxes (5px inner offset) to improve modern player experience
  const buffer = 5;
  return (
    rect1.x + buffer < rect2.x + rect2.width &&
    rect1.x + rect1.width - buffer > rect2.x &&
    rect1.y + buffer < rect2.y + rect2.height &&
    rect1.y + rect1.height - buffer > rect2.y
  );
}

// Main Frame loop (Runs at monitor's native FPS refresh rate)
function gameLoop() {
  // Clear display and implement visual screenshake viewport translations
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.save();
  if (screenshake > 0) {
    const dx = (Math.random() - 0.5) * screenshake;
    const dy = (Math.random() - 0.5) * screenshake;
    ctx.translate(dx, dy);
    screenshake *= 0.9; // dampening multiplier
  }

  drawGrid();
  drawGround();

  if (gameState === 'PLAYING') {
    timeElapsed++;
    score += 0.15;
    scoreVal.innerText = String(Math.floor(score)).padStart(5, '0');

    // Gradual difficulty speed curve scaling over time
    if (timeElapsed % 500 === 0 && gameSpeed < PHYSICS.maxSpeed) {
      gameSpeed += 0.5;
    }

    // Spawn New Obstacles with dynamic randomness
    nextObstacleTimer--;
    if (nextObstacleTimer <= 0) {
      obstacles.push(new Obstacle());
      nextObstacleTimer = Math.random() * 50 + (120 - gameSpeed * 5);
    }

    // Process Player Dynamics
    player.update();
  }

  // Draw Player
  if (gameState !== 'GAMEOVER') {
    player.draw();
  }

  // Process Obstacles physics and draw routines
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    
    if (gameState === 'PLAYING') {
      obstacle.update();
      
      // Perform collision intersections
      if (checkCollision(player, obstacle)) {
        triggerGameOver();
      }
    }
    
    obstacle.draw();

    // Splice elements exiting standard width margins
    if (obstacle.x < -100) {
      obstacles.splice(i, 1);
    }
  }

  // Draw & Update Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  ctx.restore();
  requestAnimationFrame(gameLoop);
}

// Click Triggers for Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Run System Frame loop
gameLoop();