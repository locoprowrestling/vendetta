(function () {
  if (typeof window === 'undefined') return;
  if (window.__cursorLogoInitialized) return;
  window.__cursorLogoInitialized = true;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const existing = document.querySelector('[data-cursor-logo]');
  if (existing) return;

  const brandLogo = document.querySelector('.site-header__brand img');
  const defaultSrc = 'webimages/locopro-logo.png';
  const scriptEl = document.currentScript;
  const logoSrc = brandLogo ? brandLogo.src : scriptEl ? new URL(scriptEl.getAttribute('data-logo') || defaultSrc, scriptEl.src).href : defaultSrc;

  const logo = document.createElement('img');
  logo.src = logoSrc;
  logo.alt = '';
  logo.setAttribute('aria-hidden', 'true');
  logo.setAttribute('data-cursor-logo', '');

  const style = logo.style;
  style.position = 'fixed';
  style.top = '0';
  style.left = '0';
  style.width = '80px';
  style.maxWidth = '20vw';
  style.transform = 'translate(-2px, -2px)';
  style.pointerEvents = 'none';
  style.userSelect = 'none';
  style.zIndex = '1000';
  style.transition = 'transform 0.06s linear, opacity 0.1s ease-out';
  style.willChange = 'transform';
  style.opacity = '0';

  document.body.appendChild(logo);

  let frame = 0;
  let lastCoords = null;

  const update = () => {
    if (lastCoords) {
      logo.style.top = `${lastCoords.y}px`;
      logo.style.left = `${lastCoords.x}px`;
      logo.style.opacity = '1';
      frame = 0;
      lastCoords = null;
    }
  };

  const handleMove = (event) => {
    if (event.pointerType && event.pointerType === 'touch') return;
    lastCoords = { x: event.clientX, y: event.clientY };
    if (!frame) {
      frame = requestAnimationFrame(update);
    }
  };

  const moveEvent = window.PointerEvent ? 'pointermove' : 'mousemove';
  window.addEventListener(moveEvent, handleMove, { passive: true });

  const cleanup = () => {
    window.removeEventListener(moveEvent, handleMove);
    if (frame) {
      cancelAnimationFrame(frame);
    }
    window.removeEventListener('pagehide', cleanup);
    window.removeEventListener('beforeunload', cleanup);
  };

  window.addEventListener('pagehide', cleanup);
  window.addEventListener('beforeunload', cleanup);
})();
