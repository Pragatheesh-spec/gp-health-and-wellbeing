/**
 * nav-upgrade.js
 * Step 2 — Global Nav Enhancements
 *   1. Injects #scrollProgress bar into <nav>
 *   2. Updates bar width on scroll
 *   3. Marks the current page link as .active
 *   4. Hides nav slightly on fast scroll-down, shows on scroll-up (optional UX touch)
 */

(function () {
  'use strict';

  /* ── 1. INJECT SCROLL PROGRESS BAR ───────────────────────── */
  const nav = document.querySelector('nav');
  if (nav && !document.getElementById('scrollProgress')) {
    const bar = document.createElement('div');
    bar.id = 'scrollProgress';
    nav.appendChild(bar);
  }

  /* ── 2. UPDATE PROGRESS ON SCROLL ────────────────────────── */
  function updateProgress() {
    const h   = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    const bar = document.getElementById('scrollProgress');
    if (bar) bar.style.width = Math.min(pct, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress(); // set on load (useful for short pages)

  /* ── 3. MARK CURRENT PAGE LINK AS ACTIVE ─────────────────── */
  function markActiveLink() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentFile || (currentFile === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  markActiveLink();

  /* ── 4. HIDE-ON-SCROLL-DOWN / SHOW-ON-SCROLL-UP ──────────── */
  let lastY      = 0;
  let ticking    = false;
  const THRESHOLD = 80; // px scrolled before we hide nav

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        const currentY = window.scrollY;
        if (nav) {
          if (currentY > lastY && currentY > THRESHOLD) {
            // Scrolling down — slide nav up out of view
            nav.style.transform = 'translateY(-100%)';
            nav.style.transition = 'transform 0.3s ease';
          } else {
            // Scrolling up — bring nav back
            nav.style.transform = 'translateY(0)';
          }
        }
        lastY   = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

})();