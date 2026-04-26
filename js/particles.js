/**
 * particles.js  — Step 4: Canvas food-emoji particle system
 * Used exclusively on analysis.html.
 * Drifting food particles at low opacity behind the tool.
 * ~60 lines, zero dependencies.
 */

(function () {
  'use strict';

  const EMOJIS = ['🥦','🍎','🥕','🫐','🌽','🥑','🍇','🥬','🍊','🥝','🫑','🍋'];
  const COUNT  = 30;

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  /* ── RESIZE ──────────────────────────────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    // reposition any out-of-bounds particles
    particles.forEach(p => {
      if (p.x > canvas.width)  p.x = Math.random() * canvas.width;
      if (p.y > canvas.height) p.y = Math.random() * canvas.height;
    });
  });

  /* ── PARTICLE FACTORY ────────────────────────────────────── */
  function makeParticle(randomY) {
    return {
      emoji : EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x     : Math.random() * canvas.width,
      y     : randomY ? Math.random() * canvas.height : canvas.height + 20,
      vx    : (Math.random() - 0.5) * 0.28,
      vy    : -(0.12 + Math.random() * 0.22),
      size  : 13 + Math.random() * 11,
      alpha : 0.055 + Math.random() * 0.08,
      rot   : Math.random() * Math.PI * 2,
      rotV  : (Math.random() - 0.5) * 0.007,
    };
  }

  /* ── INIT ────────────────────────────────────────────────── */
  function init() {
    // Spawn already-spread across screen on first load
    particles = Array.from({ length: COUNT }, () => makeParticle(true));
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  /* ── DRAW LOOP ───────────────────────────────────────────── */
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();

      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;

      // Recycle when off screen
      if (p.y < -40)                     particles[i] = makeParticle(false);
      if (p.x < -40)                     p.x = canvas.width  + 20;
      if (p.x > canvas.width  + 40)      p.x = -20;
    }

    animId = requestAnimationFrame(loop);
  }

  /* ── START ───────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── PAUSE WHEN TAB HIDDEN (battery saving) ──────────────── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(loop);
    }
  });

})();