// Reveal once when an element enters the viewport. Never replays, never leaves content hidden.
// Elements already in view are revealed at once by measuring, so the first screen never waits on an observer.
(() => {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!targets.length) return;
  const pending = new Set(targets);
  const show = (el: HTMLElement) => { el.classList.add('is-in'); pending.delete(el); };
  const revealVisible = () => {
    const vh = innerHeight;
    for (const el of Array.from(pending)) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) show(el);
    }
  };
  revealVisible();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target as HTMLElement);
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach((el) => io.observe(el));
  }
  let ticking = false;
  const onScroll = () => {
    if (ticking || !pending.size) return;
    ticking = true;
    requestAnimationFrame(() => { revealVisible(); ticking = false; });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  addEventListener('load', () => { revealVisible(); setTimeout(revealVisible, 1200); });
})();

// Colour by chapter: the fixed menu takes the ink of the chapter beneath it.
(() => {
  const chapters = document.querySelectorAll<HTMLElement>('[data-ink]');
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) document.documentElement.style.setProperty('--header-ink', entry.target.dataset.ink || '');
  }, { rootMargin: '0px 0px -92% 0px', threshold: 0 });
  chapters.forEach((el) => io.observe(el));
})();

// Pinned steps: a wrapper with [data-steps] holds spacer blocks [data-step="n"]; the stage shows the matching [data-slide="n"].
(() => {
  const groups = document.querySelectorAll<HTMLElement>('[data-steps]');
  if (!groups.length) return;
  groups.forEach((group) => {
    const slides = group.querySelectorAll<HTMLElement>('[data-slide]');
    const steps = Array.from(group.querySelectorAll<HTMLElement>('[data-step]'));
    const set = (n: string) => {
      if (group.dataset.active === n) return;
      slides.forEach((s) => s.classList.toggle('is-on', s.dataset.slide === n));
      group.dataset.active = n;
    };
    const pick = () => {
      const mid = innerHeight / 2;
      let current = steps[0];
      for (const s of steps) { if (s.getBoundingClientRect().top <= mid) current = s; }
      set(current?.dataset.step || '1');
    };
    pick();
    let ticking = false;
    addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { pick(); ticking = false; }); }, { passive: true });
  });
})();
