/**
 * THE PERMANENT VAULT â€” CORE ARCHIVE ENGINE
 * Modules: AudioController, ParticleSystem, VaultController, ConstellationSystem, LanternExperience, MemoryBurstSystem
 */

// ==========================================
// 1. AUDIOCONTROLLER (Web Audio Synthesis)
// ==========================================
class AudioController {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.droneGain = null;
    this.vinylNode = null;
    this.audioToggleBtn = document.getElementById('archiveAudioToggle');
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

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.startAmbientSound();
      if (this.audioToggleBtn) {
        this.audioToggleBtn.innerHTML = `<span>AUDIO: ON</span><span class="text-rose-vault">[||||]</span>`;
        this.audioToggleBtn.classList.add('border-rose-400/40');
      }
    } else {
      this.stopAmbientSound();
      if (this.audioToggleBtn) {
        this.audioToggleBtn.innerHTML = `<span>AUDIO: MUTED</span><span class="text-slate-500">[....]</span>`;
        this.audioToggleBtn.classList.remove('border-rose-400/40');
      }
    }
  }

  startAmbientSound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Atmospheric Warm Drone (Subtle 55Hz & 110Hz harmonics)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const droneFilter = this.ctx.createBiquadFilter();
    this.droneGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110.2, now);

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(220, now);

    this.droneGain.gain.setValueAtTime(0.001, now);
    this.droneGain.gain.exponentialRampToValueAtTime(0.04, now + 3);

    osc1.connect(droneFilter);
    osc2.connect(droneFilter);
    droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    this.osc1 = osc1;
    this.osc2 = osc2;

    // Subtle Vinyl Crackle Texture
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() > 0.9985 ? (Math.random() * 2 - 1) * 0.15 : (Math.random() * 2 - 1) * 0.003;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'bandpass';
    vinylFilter.frequency.value = 1000;
    vinylFilter.Q.value = 1.2;

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.012, now);

    whiteNoise.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.ctx.destination);
    whiteNoise.start(now);
    this.vinylNode = whiteNoise;
  }

  stopAmbientSound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.droneGain) {
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
      setTimeout(() => {
        if (this.osc1) this.osc1.stop();
        if (this.osc2) this.osc2.stop();
      }, 1050);
    }
    if (this.vinylGain) {
      this.vinylGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
      setTimeout(() => {
        if (this.vinylNode) this.vinylNode.stop();
      }, 1050);
    }
  }

  // Tactile Glass Tap (physical micro-interaction)
  playGlassTap() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Subtle Digital Shimmer
  playShimmer() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [587.33, 880, 1174.66].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.03, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.75);
    });
  }

  // Cassette click
  playCassetteClick() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

// ==========================================
// 2. PARTICLESYSTEM (Moonlight Dust & Touch)
// ==========================================
class ParticleSystem {
  constructor(canvasId = 'cosmicCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 55;
    this.pointer = { x: -1000, y: -1000, active: false };

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Touch and mouse listeners for physical particle repulsion
    window.addEventListener('mousemove', (e) => {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.active = true;
    });
    window.addEventListener('mouseleave', () => { this.pointer.active = false; });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.pointer.x = e.touches[0].clientX;
        this.pointer.y = e.touches[0].clientY;
        this.pointer.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.pointer.x = e.touches[0].clientX;
        this.pointer.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      setTimeout(() => { this.pointer.active = false; }, 400);
    });

    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        originX: Math.random() * this.width,
        originY: Math.random() * this.height,
        size: Math.random() * 1.6 + 0.4,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: -Math.random() * 0.25 - 0.05,
        alpha: Math.random() * 0.45 + 0.15,
        color: Math.random() > 0.7 ? '#D9A0A8' : '#F5F0F2'
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.y < 0) p.y = this.height + 5;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      // Soft repulsion from touch/cursor (dust in moonlight beam)
      if (this.pointer.active) {
        const dx = p.x - this.pointer.x;
        const dy = p.y - this.pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 75;
        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 2.2;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// 3. CONSTELLATIONSYSTEM (Page 02 Star Map)
// ==========================================
class ConstellationSystem {
  constructor(canvasId = 'constellationCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [
      { id: 1, name: "THE FIRST HELLO", date: "02.14 // 18:42", x: 0.18, y: 0.35, desc: "A sentence that looked harmless at the time. Neither of us knew what we were beginning." },
      { id: 2, name: "THE FIRST LATE NIGHT", date: "03.02 // 02:17", x: 0.42, y: 0.22, desc: "Looking at the clock and not caring about tomorrow. Realizing your voice was instantly calming." },
      { id: 3, name: "THE DAY EVERYTHING FELT EASY", date: "05.19 // 15:30", x: 0.65, y: 0.38, desc: "Sitting in quiet comfort. No pretending, no guard up. Just pure peace." },
      { id: 4, name: "THE STUPID ARGUMENT", date: "08.11 // 23:05", x: 0.35, y: 0.62, desc: "Disagreeing over something utterly ridiculous, followed by laughing at ourselves an hour later." },
      { id: 5, name: "THE PHOTO WE NEVER DELETED", date: "10.04 // 19:15", x: 0.72, y: 0.68, desc: "A blurry candid taken when you weren't looking. You hated it, but it was my favorite." },
      { id: 6, name: "THE LAST ONE", date: "12.30 // 21:00", x: 0.88, y: 0.82, desc: "The quiet realization that seasons change. An isolated star held in timeless peace.", isolated: true }
    ];

    this.activeStar = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.bindEvents();
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width;
    this.height = this.canvas.height = rect.height;
  }

  bindEvents() {
    const handlePick = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      for (let s of this.stars) {
        const sx = s.x * this.width;
        const sy = s.y * this.height;
        const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
        if (dist < 26) {
          this.selectStar(s);
          return;
        }
      }
    };

    this.canvas.addEventListener('click', (e) => handlePick(e.clientX, e.clientY));
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) handlePick(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  }

  selectStar(star) {
    this.activeStar = star;
    window.vaultAudio.playGlassTap();

    const titleEl = document.getElementById('starCardTitle');
    const dateEl = document.getElementById('starCardDate');
    const descEl = document.getElementById('starCardDesc');
    const cardEl = document.getElementById('constellationCard');

    if (titleEl) titleEl.textContent = star.name;
    if (dateEl) dateEl.textContent = star.date;
    if (descEl) descEl.textContent = star.desc;

    if (cardEl) {
      cardEl.classList.remove('opacity-0', 'pointer-events-none');
      cardEl.classList.add('opacity-100');
      gsap.fromTo(cardEl, { y: 15, scale: 0.96 }, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Connecting Constellation Lines
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 6]);

    for (let i = 0; i < this.stars.length - 2; i++) {
      const s1 = this.stars[i];
      const s2 = this.stars[i + 1];
      this.ctx.moveTo(s1.x * this.width, s1.y * this.height);
      this.ctx.lineTo(s2.x * this.width, s2.y * this.height);
    }
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Isolated line to the last star with subtle glow
    const sBeforeLast = this.stars[4];
    const sLast = this.stars[5];
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(217, 160, 168, 0.2)';
    this.ctx.setLineDash([2, 8]);
    this.ctx.moveTo(sBeforeLast.x * this.width, sBeforeLast.y * this.height);
    this.ctx.lineTo(sLast.x * this.width, sLast.y * this.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw Stars
    const time = Date.now() * 0.002;
    for (let s of this.stars) {
      const sx = s.x * this.width;
      const sy = s.y * this.height;
      const isSelected = this.activeStar && this.activeStar.id === s.id;
      const pulse = Math.sin(time + s.id) * 1.5;

      // Glow Halo
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, isSelected ? 18 : (s.isolated ? 14 : 10), 0, Math.PI * 2);
      this.ctx.fillStyle = s.isolated ? 'rgba(255, 214, 176, 0.12)' : 'rgba(217, 160, 168, 0.1)';
      this.ctx.fill();

      // Core Star Point
      this.ctx.beginPath();
      this.ctx.arc(sx, sy, (s.isolated ? 4 : 3) + (isSelected ? 2 : 0) + pulse * 0.3, 0, Math.PI * 2);
      this.ctx.fillStyle = s.isolated ? '#FFD6B0' : (isSelected ? '#FFFFFF' : '#D9A0A8');
      this.ctx.shadowBlur = isSelected ? 12 : 6;
      this.ctx.shadowColor = s.isolated ? '#FFD6B0' : '#D9A0A8';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Tiny Star Label
      this.ctx.font = '8px "Plus Jakarta Sans", sans-serif';
      this.ctx.fillStyle = s.isolated ? '#FFD6B0' : 'rgba(245, 240, 242, 0.6)';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(s.name, sx, sy + 18);
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// 4. LANTERNEXPERIENCE (Page 10 Climax)
// ==========================================
class LanternExperience {
  constructor() {
    this.lantern = document.getElementById('celestialLantern');
    this.statusText = document.getElementById('lanternStatusText');
    this.holdProgress = 0;
    this.isHolding = false;
    this.released = false;
    this.timer = null;

    if (!this.lantern) return;

    const startHold = (e) => {
      if (this.released) return;
      e.preventDefault();
      this.isHolding = true;
      window.vaultAudio.playGlassTap();
      this.timer = setInterval(() => {
        if (this.holdProgress < 100) {
          this.holdProgress += 2.5;
          this.updateLanternVisual();
          if (this.holdProgress >= 100) {
            clearInterval(this.timer);
            this.release();
          }
        }
      }, 50);
    };

    const cancelHold = () => {
      if (this.released) return;
      this.isHolding = false;
      clearInterval(this.timer);
      this.holdProgress = 0;
      this.updateLanternVisual();
    };

    this.lantern.addEventListener('mousedown', startHold);
    this.lantern.addEventListener('mouseup', cancelHold);
    this.lantern.addEventListener('mouseleave', cancelHold);

    this.lantern.addEventListener('touchstart', startHold, { passive: false });
    this.lantern.addEventListener('touchend', cancelHold);
    this.lantern.addEventListener('touchcancel', cancelHold);
  }

  updateLanternVisual() {
    const scale = 1 + (this.holdProgress / 100) * 0.15;
    const glow = this.holdProgress * 0.6;
    gsap.to(this.lantern, {
      scale: scale,
      boxShadow: `0 0 ${20 + glow}px rgba(255, 214, 176, ${0.2 + this.holdProgress * 0.006})`,
      duration: 0.1
    });

    if (this.statusText) {
      if (this.holdProgress > 10 && this.holdProgress < 100) {
        this.statusText.textContent = `GATHERING UNTOLD WORDS (${Math.round(this.holdProgress)}%)...`;
      } else if (this.holdProgress === 0 && !this.released) {
        this.statusText.textContent = "TOUCH AND HOLD TO RELEASE";
      }
    }
  }

  release() {
    this.released = true;
    window.vaultAudio.playShimmer();
    if (this.statusText) this.statusText.textContent = "RELEASING INTO THE NIGHT...";

    // Ascension animation
    gsap.to(this.lantern, {
      y: -window.innerHeight - 150,
      scale: 0.25,
      opacity: 0.1,
      duration: 4.2,
      ease: 'power1.inOut',
      onComplete: () => {
        this.lantern.style.display = 'none';
        const msgBlock = document.getElementById('lanternEpilogue');
        if (msgBlock) {
          msgBlock.classList.remove('opacity-0');
          gsap.fromTo(msgBlock, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' });
        }
      }
    });

    // Particle embers
    for (let i = 0; i < 28; i++) {
      const ember = document.createElement('div');
      ember.className = 'fixed w-1.5 h-1.5 rounded-full bg-amber-200 pointer-events-none z-40';
      ember.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 60) + 'px';
      ember.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 60) + 'px';
      document.body.appendChild(ember);

      gsap.to(ember, {
        y: -window.innerHeight - Math.random() * 200,
        x: (Math.random() - 0.5) * 160,
        opacity: 0,
        scale: 0,
        duration: 3 + Math.random() * 2,
        ease: 'power1.out',
        onComplete: () => ember.remove()
      });
    }
  }
}

// ==========================================
// 5. MEMORYBURSTSYSTEM (Page 09 Shards)
// ==========================================
class MemoryBurstSystem {
  constructor() {
    this.container = document.getElementById('memoryBurstContainer');
    this.boxBtn = document.getElementById('openBoxBtn');
    this.freezeQuote = document.getElementById('burstFreezeQuote');
    this.touchedCount = 0;
    this.totalToTouch = 5;
    this.fragments = [
      "â€œDon't forget to eat.â€", "02:17 AM", "The corner cafÃ©", "Your sleepy laugh",
      "November 14", "â€œText me when you're homeâ€", "That inside joke", "The warm tea",
      "Stolen fries", "11:11", "Coordinates: 28.61Â° N", "The playlist on loop"
    ];

    if (this.boxBtn) {
      this.boxBtn.addEventListener('click', () => this.burst());
    }
  }

  burst() {
    window.vaultAudio.playShimmer();
    this.boxBtn.classList.add('opacity-0', 'pointer-events-none');

    this.fragments.forEach((frag, idx) => {
      const shard = document.createElement('div');
      shard.className = 'absolute px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 backdrop-blur-md cursor-pointer transition-all duration-300';
      shard.textContent = frag;
      shard.style.left = '50%';
      shard.style.top = '50%';
      shard.style.transform = 'translate(-50%, -50%)';
      this.container.appendChild(shard);

      const angle = (idx / this.fragments.length) * Math.PI * 2;
      const radius = 90 + Math.random() * 65;
      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(angle) * radius;

      gsap.to(shard, {
        x: targetX,
        y: targetY,
        opacity: 0.85,
        duration: 1.2 + Math.random() * 0.8,
        ease: 'power2.out'
      });

      // Hover and tap dissipation
      shard.addEventListener('click', () => {
        window.vaultAudio.playGlassTap();
        this.touchedCount++;
        gsap.to(shard, {
          scale: 1.2,
          color: '#FFD6B0',
          borderColor: '#FFD6B0',
          opacity: 1,
          duration: 0.2,
          onComplete: () => {
            gsap.to(shard, {
              opacity: 0,
              scale: 0.5,
              duration: 0.6,
              onComplete: () => shard.remove()
            });
          }
        });

        if (this.touchedCount >= this.totalToTouch) {
          this.triggerFreeze();
        }
      });
    });
  }

  triggerFreeze() {
    if (this.freezeQuote) {
      this.freezeQuote.classList.remove('opacity-0');
      gsap.fromTo(this.freezeQuote, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' });
    }
  }
}

// ==========================================
// 6. VAULTCONTROLLER (Main Coordinator)
// ==========================================
class VaultController {
  constructor() {
    this.currentChapter = 1;
    this.totalChapters = 12;
    this.isUnlocked = false;
    this.isSealed = false;

    this.scenes = document.querySelectorAll('.vault-scene');
    this.hud = document.getElementById('archiveHud');
    this.chapterNumberDisplay = document.getElementById('hudChapterNumber');
    this.prevBtn = document.getElementById('hudPrevBtn');
    this.nextBtn = document.getElementById('hudNextBtn');

    this.bindNavigation();
    this.bindPasscode();
    this.bindPermanentSeal();
    this.bindAudioRecordingPage();
  }

  bindNavigation() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        if (this.currentChapter > 1) {
          window.vaultAudio.playGlassTap();
          this.goToChapter(this.currentChapter - 1);
        }
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        if (this.currentChapter < this.totalChapters) {
          window.vaultAudio.playGlassTap();
          this.goToChapter(this.currentChapter + 1);
        }
      });
    }

    // Swipe navigation between chapters
    let touchStartX = 0;
    let touchEndX = 0;
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) touchStartX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 75 && this.isUnlocked && !this.isSealed) {
          if (diff < 0 && this.currentChapter < this.totalChapters) {
            window.vaultAudio.playGlassTap();
            this.goToChapter(this.currentChapter + 1);
          } else if (diff > 0 && this.currentChapter > 1) {
            window.vaultAudio.playGlassTap();
            this.goToChapter(this.currentChapter - 1);
          }
        }
      }
    }, { passive: true });
  }

  bindPasscode() {
    const input = document.getElementById('vaultPasscodeInput');
    const submitBtn = document.getElementById('vaultUnlockBtn');
    const bypassBtn = document.getElementById('vaultBypassBtn');
    const errorMsg = document.getElementById('passcodeErrorMsg');
    const bloom = document.getElementById('bloomOverlay');

    const verify = () => {
      const val = input.value.trim();
      if (!val) {
        // Subtle shudder
        const card = document.getElementById('passcodeCard');
        if (card) {
          card.classList.add('shudder-animation');
          setTimeout(() => card.classList.remove('shudder-animation'), 500);
        }
        if (errorMsg) {
          errorMsg.textContent = "That memory doesn't open this door.";
          errorMsg.classList.remove('opacity-0');
        }
        return;
      }

      // Unlock with warm bloom
      this.unlockSequence();
    };

    if (submitBtn) submitBtn.addEventListener('click', verify);
    if (bypassBtn) bypassBtn.addEventListener('click', () => this.unlockSequence());
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verify();
      });
    }
  }

  unlockSequence() {
    this.isUnlocked = true;
    window.vaultAudio.playShimmer();
    const bloom = document.getElementById('bloomOverlay');
    const card = document.getElementById('passcodeCard');

    if (bloom) {
      bloom.style.animation = 'lightBloom 1.4s ease-in-out forwards';
    }

    gsap.to(card, {
      opacity: 0,
      scale: 0.94,
      filter: 'blur(10px)',
      duration: 1.0,
      ease: 'power2.inOut',
      onComplete: () => {
        this.goToChapter(2);
      }
    });
  }

  goToChapter(index) {
    if (index < 1 || index > this.totalChapters) return;
    const prevScene = document.getElementById(`scene-${this.currentChapter}`);
    const nextScene = document.getElementById(`scene-${index}`);

    if (prevScene) {
      gsap.to(prevScene, {
        opacity: 0,
        scale: 0.96,
        filter: 'blur(8px)',
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          prevScene.classList.remove('active');
          prevScene.style.filter = 'none';
        }
      });
    }

    if (nextScene) {
      nextScene.classList.add('active');
      gsap.fromTo(nextScene, 
        { opacity: 0, scale: 0.98, filter: 'blur(8px)' }, 
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, delay: 0.2, ease: 'power2.out' }
      );
    }

    this.currentChapter = index;

    // Update HUD
    if (this.chapterNumberDisplay) {
      this.chapterNumberDisplay.textContent = `${String(index).padStart(2, '0')} / 12`;
    }

    if (this.hud) {
      if (index === 1 || this.isSealed) {
        this.hud.classList.add('opacity-0', 'pointer-events-none');
      } else {
        this.hud.classList.remove('opacity-0', 'pointer-events-none');
      }
    }
  }

  bindAudioRecordingPage() {
    const playBtn = document.getElementById('cassettePlayBtn');
    const transcriptLines = document.querySelectorAll('.transcript-phrase');
    let isPlaying = false;
    let timer = null;

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        window.vaultAudio.playCassetteClick();
        isPlaying = !isPlaying;

        if (isPlaying) {
          playBtn.textContent = "PAUSE TAPE";
          // Highlight phrases progressively
          let phraseIdx = 0;
          timer = setInterval(() => {
            if (phraseIdx < transcriptLines.length) {
              transcriptLines.forEach(l => l.classList.remove('text-rose-vault', 'font-semibold'));
              transcriptLines[phraseIdx].classList.add('text-rose-vault', 'font-semibold');
              phraseIdx++;
            } else {
              clearInterval(timer);
              const endNotice = document.getElementById('recordingEndNotice');
              if (endNotice) endNotice.classList.remove('opacity-0');
            }
          }, 2400);
        } else {
          playBtn.textContent = "PLAY TAPE";
          clearInterval(timer);
        }
      });
    }
  }

  bindPermanentSeal() {
    const sealBtn = document.getElementById('permanentSealBtn');
    if (!sealBtn) return;

    sealBtn.addEventListener('click', () => {
      this.isSealed = true;
      window.vaultAudio.playGlassTap();
      window.vaultAudio.stopAmbientSound();

      // Extinguish all UI into pure black
      gsap.to(['#archiveHud', '.vault-viewport', '#cosmicCanvas', '.vignette-overlay'], {
        opacity: 0,
        filter: 'blur(20px)',
        duration: 2.8,
        ease: 'power3.inOut',
        onComplete: () => {
          document.body.style.cursor = 'none';
          document.body.innerHTML = `
            <div id="finalSilence" style="position:fixed;inset:0;background:#020106;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8E8993;font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:0.3em;font-size:10px;text-transform:uppercase;opacity:0;transition:opacity 2.5s ease;">
              <p style="color:#F5F0F2;margin-bottom:8px;">PERMANENTLY SEALED.</p>
              <p style="color:#8E8993;font-size:9px;letter-spacing:0.4em;">goodbye.</p>
            </div>
          `;
          setTimeout(() => {
            const el = document.getElementById('finalSilence');
            if (el) el.style.opacity = '1';
          }, 1200);
        }
      });
    });
  }
}

// Initializer
window.addEventListener('DOMContentLoaded', () => {
  window.vaultAudio = new AudioController();
  window.vaultParticles = new ParticleSystem('cosmicCanvas');
  window.vaultConstellation = new ConstellationSystem('constellationCanvas');
  window.vaultLantern = new LanternExperience();
  window.vaultBurst = new MemoryBurstSystem();
  window.vaultCtrl = new VaultController();

  const toggleBtn = document.getElementById('archiveAudioToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => window.vaultAudio.toggle());
  }
});