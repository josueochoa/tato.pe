// Muted loops play only when visible and when motion is allowed; tap toggles sound on clips marked data-tap.
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const loops = document.querySelectorAll<HTMLVideoElement>('video[data-loop]');
  const sync = (v: HTMLVideoElement, visible: boolean) => {
    if (calm.matches || !visible) { v.pause(); return; }
    v.play().catch(() => {});
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) sync(e.target as HTMLVideoElement, e.isIntersecting);
    }, { threshold: 0.15 });
    loops.forEach((v) => io.observe(v));
  } else {
    loops.forEach((v) => sync(v, true));
  }
  calm.addEventListener('change', () => loops.forEach((v) => sync(v, !calm.matches)));
  document.addEventListener('visibilitychange', () => loops.forEach((v) => sync(v, !document.hidden)));

  // Tap to watch with sound (showcase frames).
  document.querySelectorAll<HTMLElement>('[data-tap]').forEach((frame) => {
    const v = frame.querySelector('video');
    if (!v) return;
    frame.addEventListener('click', () => {
      if (v.muted) { v.muted = false; v.currentTime = 0; v.play().catch(() => {}); frame.classList.add('is-sound'); }
      else { v.muted = true; frame.classList.remove('is-sound'); }
    });
  });
})();
