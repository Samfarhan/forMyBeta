/**
 * For My Beta - Core Shared Engine
 * Audio synthesis, stardust particle physics, floating companion, and navigation.
 */

// 1. WEB AUDIO API SYNTHESIZER (100% Offline, Zero external sound file dependency)
class AudioSynthEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
    const now = this.ctx.currentTime;
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.12, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.65);
    });
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    const now = this.ctx.currentTime;
    notes.forEach((note, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, now + i * 0.09);
      gain.gain.setValueAtTime(0.15, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.55);
    });
  }

  playEnvelopeUnfold() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.25);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

window.soundEngine = new AudioSynthEngine();
document.addEventListener('click', () => { window.soundEngine.init(); }, { once: true });
document.addEventListener('touchstart', () => { window.soundEngine.init(); }, { once: true });

// 2. STARDUST CANVAS PARTICLE SYSTEM
function initStardustCanvas(canvasId = 'stardustCanvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.opacity = Math.random() * 0.7 + 0.2;
      this.hue = Math.random() > 0.5 ? 345 : 275; // Rose or Violet
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < 0 || this.x < 0 || this.x > width) {
        this.reset();
        this.y = height + 10;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 85%, 75%, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsla(${this.hue}, 90%, 65%, 0.8)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Interactive touch / cursor spark trail
  function addSpark(x, y) {
    for (let i = 0; i < 3; i++) {
      const p = new Particle();
      p.x = x + (Math.random() - 0.5) * 15;
      p.y = y + (Math.random() - 0.5) * 15;
      p.speedX = (Math.random() - 0.5) * 1.5;
      p.speedY = (Math.random() - 0.5) * 1.5;
      p.size = Math.random() * 2.5 + 1;
      p.opacity = 1;
      particles.push(p);
      if (particles.length > 70) particles.shift();
    }
  }

  window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.6) addSpark(e.clientX, e.clientY);
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0 && Math.random() > 0.5) {
      addSpark(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function loop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
}

// 3. FLOATING COMPANION STICKER
const MASCOT_QUOTES = [
  "Alyaa, take a deep breath... âœ¨",
  "Every memory here is kept safe ðŸ¤",
  "You made ordinary days so special ðŸŒ¸",
  "I will always wish the absolute best for you ðŸŒŸ",
  "Remember to always eat your favorite food! ðŸ¥ŸðŸ°",
  "Smile... you have the brightest smile in the world ðŸŒ™",
  "No regrets, just pure gratitude for us ðŸ¤"
];

let mascotQuoteIndex = 0;

function initCompanionMascot(containerId = 'companionMascot') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div id="mascotBubble" class="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-pink-500/30 py-1.5 px-3 rounded-2xl shadow-2xl text-[11px] font-bold text-pink-200 tracking-wide scale-0 transition-all duration-300 whitespace-nowrap pointer-events-none z-50">
      ${MASCOT_QUOTES[0]}
    </div>
    <img id="mascotImg" src="images/mascot.svg" alt="Companion Sticker" class="w-16 h-16 drop-shadow-[0_8px_20px_rgba(244,63,94,0.4)] cursor-pointer transform hover:scale-110 active:scale-95 transition-transform duration-200">
  `;

  const bubble = document.getElementById('mascotBubble');
  const img = document.getElementById('mascotImg');

  function talk() {
    window.soundEngine.playPop();
    mascotQuoteIndex = (mascotQuoteIndex + 1) % MASCOT_QUOTES.length;
    bubble.textContent = MASCOT_QUOTES[mascotQuoteIndex];
    bubble.classList.remove('scale-0');
    bubble.classList.add('scale-100');
    
    // Quick joyful bounce
    if (window.gsap) {
      gsap.to(img, { y: -10, duration: 0.15, yoyo: true, repeat: 1 });
    }

    clearTimeout(window._mascotTimer);
    window._mascotTimer = setTimeout(() => {
      bubble.classList.remove('scale-100');
      bubble.classList.add('scale-0');
    }, 3800);
  }

  container.addEventListener('click', talk);
}

// 4. BOTTOM FLOATING NAVIGATION BAR
const PAGES_CONFIG = [
  { file: 'index.html', title: 'Gateway' },
  { file: 'page1-welcome.html', title: 'The Prologue' },
  { file: 'page2-how-we-met.html', title: 'How We Met' },
  { file: 'page3-happy-days.html', title: 'Happy Days' },
  { file: 'page4-favorite-food.html', title: 'Her Favorite Food' },
  { file: 'page5-little-things.html', title: 'The Little Things' },
  { file: 'page6-memory-game.html', title: 'Memory Quest' },
  { file: 'page7-gallery.html', title: 'Polaroid Wall' },
  { file: 'page8-music-box.html', title: 'Soundtrack' },
  { file: 'page9-unopened-notes.html', title: 'Sealed Letters' },
  { file: 'page10-unsent-letter.html', title: 'The Letter' },
  { file: 'page11-wishes-for-you.html', title: '10 Wishes' },
  { file: 'page12-finale.html', title: 'The Finale' }
];

function initNavBar(currentPageIndex) {
  const navContainer = document.getElementById('floatingNavBar');
  if (!navContainer) return;

  const totalPages = PAGES_CONFIG.length - 1; // 1 to 12
  const prevPage = currentPageIndex > 1 ? PAGES_CONFIG[currentPageIndex - 1].file : 'index.html';
  const nextPage = currentPageIndex < totalPages ? PAGES_CONFIG[currentPageIndex + 1].file : 'page12-finale.html';
  const progressPercent = Math.round((currentPageIndex / totalPages) * 100);

  navContainer.innerHTML = `
    <div class="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] bg-slate-950/80 backdrop-blur-2xl border border-white/15 rounded-full py-2.5 px-4 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.8)] z-50">
      
      <!-- Prev Button -->
      <a href="${prevPage}" onclick="window.soundEngine.playPop()" class="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/15 active:scale-95 transition-all" title="Previous Page">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </a>

      <!-- Center Info & Progress -->
      <div class="flex flex-col items-center cursor-pointer" onclick="window.location.href='index.html'" title="Return to Portal">
        <div class="flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase text-pink-300">
          <span>CHAPTER ${currentPageIndex} OF ${totalPages}</span>
        </div>
        <div class="w-28 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
          <div class="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400 rounded-full" style="width: ${progressPercent}%"></div>
        </div>
      </div>

      <!-- Next Button -->
      ${currentPageIndex < totalPages ? `
        <a href="${nextPage}" onclick="window.soundEngine.playPop()" class="h-9 px-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 border border-pink-400/40 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-pink-500/25 hover:brightness-110 active:scale-95 transition-all">
          <span>Next</span>
          <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      ` : `
        <a href="index.html" onclick="window.soundEngine.playSuccess()" class="h-9 px-3.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border border-purple-400/40 flex items-center justify-center text-xs font-bold text-white shadow-lg active:scale-95 transition-all">
          <span>Home</span>
          <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </a>
      `}
    </div>
  `;
}
