/**
 * scroll-anim.js  — Step 3/4: Scroll-triggered animations
 * Uses IntersectionObserver to reveal elements as they enter
 * the viewport. Handles:
 *   - .reveal / .reveal-left / .reveal-right / .reveal-scale
 *   - .reveal-group (staggered children)
 *   - .threat-card   (index.html triple-threat)
 *   - .risk-bar-item + .risk-bar-fill  (health.html)
 *   - .flip-card     (solutions.html)
 *   - .brain-visual, .mood-chart, .molecule-wrap (wellbeing)
 *   - .stat-card, .burden-card (global.html — supplements its own IO)
 */

(function () {
  'use strict';

  /* ── SHARED OBSERVER OPTIONS ─────────────────────────────── */
  const BASE_OPTS   = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const EARLY_OPTS  = { threshold: 0.05, rootMargin: '0px 0px -20px 0px' };

  /* ── HELPER: add .visible once and unobserve ─────────────── */
  function onceVisible(el, observer) {
    el.classList.add('visible');
    observer.unobserve(el);
  }

  /* ── 1. GENERIC REVEAL ELEMENTS ──────────────────────────── */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) onceVisible(e.target, revealIO);
    });
  }, BASE_OPTS);

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-group, ' +
    '.molecule-wrap, .brain-visual, .mood-chart'
  ).forEach(el => revealIO.observe(el));

  /* ── 2. TRIPLE-THREAT CARDS (index.html) ─────────────────── */
  const threatIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) onceVisible(e.target, threatIO);
    });
  }, BASE_OPTS);

  document.querySelectorAll('.threat-card').forEach(el => threatIO.observe(el));

  /* ── 3. HEALTH RISK BARS ─────────────────────────────────── */
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const item = e.target;
      item.classList.add('visible');
      // Trigger fill width after item slides in
      setTimeout(() => {
        const fill = item.querySelector('.risk-bar-fill');
        if (fill && fill.dataset.width) {
          fill.style.width = fill.dataset.width + '%';
        }
      }, 250);
      barIO.unobserve(item);
    });
  }, BASE_OPTS);

  document.querySelectorAll('.risk-bar-item').forEach(el => barIO.observe(el));

  /* ── 4. FLIP CARDS (solutions.html) ──────────────────────── */
  const flipIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) onceVisible(e.target, flipIO);
    });
  }, BASE_OPTS);

  document.querySelectorAll('.flip-card').forEach(el => {
    flipIO.observe(el);
    // Also allow click-to-flip on mobile
    el.addEventListener('click', () => el.classList.toggle('flipped'));
  });

  /* ── 5. MOOD WAVE CHART ANIMATION (wellbeing.html) ───────── */
  const moodIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      animateMoodWave(e.target);
      moodIO.unobserve(e.target);
    });
  }, EARLY_OPTS);

  const moodChart = document.getElementById('moodWaveChart');
  if (moodChart) moodIO.observe(moodChart.closest('.mood-chart') || moodChart);

  function animateMoodWave(container) {
    const junkPath    = container.querySelector('#junkWavePath');
    const healthyPath = container.querySelector('#healthyWavePath');
    if (!junkPath && !healthyPath) return;

    function animatePath(pathEl, duration) {
      if (!pathEl) return;
      const len = pathEl.getTotalLength();
      pathEl.style.strokeDasharray  = len;
      pathEl.style.strokeDashoffset = len;
      pathEl.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4,0,0.2,1)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          pathEl.style.strokeDashoffset = '0';
        });
      });
    }
    animatePath(junkPath,    1400);
    animatePath(healthyPath, 1800);
  }

  /* ── 6. SUGAR MOLECULE BONDS (health.html) ───────────────── */
  // Molecule SVG animation is driven by CSS <animateTransform>
  // but we reveal the container via .molecule-wrap.visible (handled above)

  /* ── 7. CONTAINER CARD: apply card-3d after page loads ───── */
  // The main .container gets the tilt class so tilt.js picks it up
  document.querySelectorAll('main.container').forEach(el => {
    el.classList.add('card-3d');
  });

  /* ── 8. COUNTER ANIMATION utility (used by global.html) ──── */
  // Expose globally so global.html inline script can reuse it
  window.animateCount = function (el, target, suffix, duration) {
    duration = duration || 1400;
    const start = performance.now();
    function step(now) {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(ease * target) + (suffix || '');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

})();