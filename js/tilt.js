/**
 * tilt.js  — Step 3: 3D Card Tilt System
 * Tracks mouse over .card-3d elements and applies
 * a gentle perspective rotateX/Y + subtle glow shift.
 * Pure vanilla JS, ~50 lines, zero dependencies.
 */

(function () {
  'use strict';

  const MAX_TILT   = 6;    // degrees max rotation
  const MAX_GLARE  = 0.12; // opacity of glare overlay
  const EASE_BACK  = 0.08; // lerp factor for return-to-zero

  function init() {
    document.querySelectorAll('.card-3d').forEach(el => {
      // Inject glare overlay
      if (!el.querySelector('.tilt-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        glare.style.cssText = `
          position:absolute; inset:0; border-radius:inherit;
          pointer-events:none; z-index:10; opacity:0;
          background: radial-gradient(circle at 50% 50%,
            rgba(125,220,154,0.18) 0%, transparent 60%);
          transition: opacity 0.3s ease;
        `;
        // ensure parent has position
        const pos = getComputedStyle(el).position;
        if (pos === 'static') el.style.position = 'relative';
        el.appendChild(glare);
      }
    });

    document.querySelectorAll('.card-3d').forEach(attachTilt);
  }

  function attachTilt(el) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;
    let isHovered = false;

    const glare = el.querySelector('.tilt-glare');

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);

      el.style.transform = `
        perspective(1000px)
        rotateX(${currentX}deg)
        rotateY(${currentY}deg)
        scale3d(${isHovered ? 1.018 : 1}, ${isHovered ? 1.018 : 1}, 1)
      `;

      if (glare) {
        // Glare follows cursor position
        const gx = 50 + targetY * 3;
        const gy = 50 - targetX * 3;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%,
          rgba(125,220,154,0.16) 0%, transparent 55%)`;
        glare.style.opacity = isHovered
          ? Math.abs(targetX) / MAX_TILT * MAX_GLARE + Math.abs(targetY) / MAX_TILT * MAX_GLARE
          : 0;
      }

      // Keep animating while hovered or still returning
      if (isHovered || Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
        rafId = requestAnimationFrame(animate);
      } else {
        // Snap fully to zero
        currentX = 0; currentY = 0;
        el.style.transform = '';
        rafId = null;
      }
    }

    el.addEventListener('mousemove', function (e) {
      const rect  = el.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);  // -1 to 1
      const dy    = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

      targetY =  dx * MAX_TILT;   // left-right tilt
      targetX = -dy * MAX_TILT;   // up-down tilt (inverted)

      isHovered = true;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    el.addEventListener('mouseleave', function () {
      targetX = 0; targetY = 0;
      isHovered = false;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    // Touch: disable tilt on mobile (performance)
    el.addEventListener('touchstart', function () {
      targetX = 0; targetY = 0;
      isHovered = false;
      el.style.transform = '';
    }, { passive: true });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();