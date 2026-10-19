// /recarga: the server battery, the aporte simulator, the Yape card (copy, download, missing QR) and the suggestion box.
// Settings come from CONFIG in src/pages/recarga.astro through <script id="recarga-config">.
type Mode = 'whatsapp' | 'webhook' | 'both';
interface Config {
  currentAmount: number;
  goalAmount: number;
  secondsPerSol: number;
  submit: { mode: Mode; webhookUrl: string; whatsappNumber: string };
}
type State = 'crit' | 'mid' | 'full';

(() => {
  const root = document.querySelector<HTMLElement>('[data-recarga]');
  const raw = document.getElementById('recarga-config')?.textContent;
  if (!root || !raw) return;
  const cfg: Config = JSON.parse(raw);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const soles = (n: number) => `S/ ${Number.isInteger(n) ? n : n.toFixed(2)}`;

  /* ---------- battery ---------- */
  const bat = $('[data-bat]')!;
  const pctEl = $('[data-pct]')!;
  const amountEl = $('[data-amount]')!;
  const previewEl = $('[data-preview]')!;
  const stateEl = $('[data-state-label]')!;
  const labels: Record<State, string> = { crit: 'Estado crítico', mid: 'Cargando', full: 'Energía radiante' };
  const pct = (n: number) => Math.max(0, Math.min(100, (n / cfg.goalAmount) * 100));
  const stateOf = (p: number): State => (p < 25 ? 'crit' : p <= 65 ? 'mid' : 'full');

  let base = cfg.currentAmount; // verified amount (plus what this visitor registered)
  let extra = 0;                // the aporte being previewed
  let shown = pct(base);
  let raf = 0;

  const countTo = (target: number) => {
    cancelAnimationFrame(raf);
    if (reduce) { shown = target; pctEl.textContent = `${Math.round(target)}%`; return; }
    const from = shown, t0 = performance.now(), dur = 900;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      shown = from + (target - from) * (1 - Math.pow(1 - k, 3));
      pctEl.textContent = `${Math.round(shown)}%`;
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  const render = () => {
    const p = pct(base + extra);
    bat.style.setProperty('--level', p.toFixed(2));
    bat.style.setProperty('--base', pct(base).toFixed(2));
    bat.classList.toggle('has-preview', extra > 0);
    const s = stateOf(p);
    root.dataset.state = s;
    stateEl.textContent = extra > 0 ? `${labels[s]} · vista previa` : labels[s];
    amountEl.textContent = `${soles(base)} / ${soles(cfg.goalAmount)}`;
    previewEl.hidden = extra <= 0;
    previewEl.textContent = extra > 0 ? `+ ${soles(extra)} con tu aporte` : '';
    countTo(p);
  };

  const surge = () => {
    if (reduce) return;
    bat.classList.remove('is-surge');
    void bat.offsetWidth; // restart the animation
    bat.classList.add('is-surge');
  };
  bat.addEventListener('animationend', (e) => { if ((e as AnimationEvent).animationName.includes('bat-surge')) bat.classList.remove('is-surge'); });

  /* ---------- simulator ---------- */
  const tiers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tier]'));
  const msgEl = $('[data-msg]')!;
  const yape = $('[data-yape]')!;
  const choiceEl = $('[data-choice]')!;
  const montoInput = $<HTMLInputElement>('#bz-monto');
  let scrollTimer = 0;

  const goToQr = () => {
    const r = yape.getBoundingClientRect();
    if (r.top < 0 || r.top > innerHeight * 0.5) yape.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    yape.classList.add('is-lit');
    setTimeout(() => yape.classList.remove('is-lit'), 2600);
  };

  tiers.forEach((btn) => btn.addEventListener('click', () => {
    const amount = Number(btn.dataset.amount);
    extra = amount;
    tiers.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    render();
    surge();
    const secs = Math.round(amount * cfg.secondsPerSol);
    msgEl.textContent = `¡Con este aporte impulsas +${secs} segundos de renderizado IA y sales en los créditos del próximo video!`;
    choiceEl.hidden = false;
    choiceEl.textContent = `Elegiste ${btn.dataset.name} · ${soles(amount)}. Yapea ese monto (o el que quieras) y regístrate en el buzón.`;
    if (montoInput && !montoInput.value) montoInput.value = String(amount);
    clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(goToQr, reduce ? 300 : 1600);
  }));

  /* ---------- Yape card ---------- */
  const qrImg = $<HTMLImageElement>('[data-qr]');
  const qrDownload = $<HTMLAnchorElement>('[data-qr-download]');
  const markMissing = () => {
    yape.classList.add('is-missing');
    qrDownload?.setAttribute('aria-disabled', 'true');
    qrDownload?.removeAttribute('href');
  };
  if (qrImg) {
    if (qrImg.complete && qrImg.naturalWidth === 0) markMissing();
    qrImg.addEventListener('error', markMissing);
  }

  const copyStatus = $('[data-copy-status]');
  const copyText = async (text: string) => {
    try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through */ }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  };
  root.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const ok = await copyText(btn.dataset.copy || '');
    btn.textContent = ok ? '¡Copiado!' : 'Mantén presionado';
    btn.classList.toggle('is-done', ok);
    if (copyStatus) copyStatus.textContent = ok ? 'Copiado al portapapeles' : 'No se pudo copiar';
    setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('is-done'); }, 1800);
  }));

  /* ---------- suggestion box ---------- */
  const form = $<HTMLFormElement>('[data-buzon]');
  if (!form) { render(); return; }
  const paid = $<HTMLFieldSetElement>('[data-paid]')!;
  const idea = form.elements.namedItem('sugerencia') as HTMLTextAreaElement;
  const count = $('[data-count]')!;
  const errorEl = $('[data-error]')!;
  const sendBtn = $<HTMLButtonElement>('[data-send]')!;
  const done = $('[data-done]')!;
  const doneText = $('[data-done-text]')!;
  const doneWa = $('[data-done-wa]')!;
  const waLink = $<HTMLAnchorElement>('[data-wa-link]')!;

  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name !== 'recargo') return;
    const yes = t.value === 'si';
    paid.hidden = !yes;
    paid.disabled = !yes;
  });
  idea.addEventListener('input', () => { count.textContent = String(idea.value.length); });

  const showError = (text: string) => { errorEl.hidden = !text; errorEl.textContent = text; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');
    if (!form.checkValidity()) {
      form.reportValidity();
      showError('Revisa los campos marcados: tu @usuario, si recargaste (con tu nombre en Yape) y tu sugerencia.');
      return;
    }
    const fd = new FormData(form);
    const handle = '@' + String(fd.get('handle') || '').trim().replace(/^@+/, '').replace(/\s+/g, '');
    const recargo = fd.get('recargo') === 'si';
    const nombreYape = recargo ? String(fd.get('nombreYape') || '').trim() : '';
    const monto = recargo ? Number(fd.get('monto') || 0) : 0;
    const operacion = recargo ? String(fd.get('operacion') || '').trim() : '';
    const sugerencia = String(fd.get('sugerencia') || '').trim();
    const payload = { handle, recargo, nombreYape, monto, operacion, sugerencia, fecha: new Date().toISOString(), origen: location.href };

    const lines = [
      'Hola Tato, te dejo esto desde el Buzón de Sugerencias de tato.pe/recarga:',
      `• Usuario: ${handle}`,
      `• Recarga voluntaria: ${recargo ? 'Sí' : 'No, solo sugerencia'}`,
      ...(nombreYape ? [`• Nombre en Yape: ${nombreYape}`] : []),
      ...(recargo && monto ? [`• Monto aproximado: ${soles(monto)}`] : []),
      ...(operacion ? [`• Últimos dígitos de operación: ${operacion}`] : []),
      `• Sugerencia para el próximo tributo: ${sugerencia}`,
    ];
    const waUrl = `https://wa.me/${cfg.submit.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    const mode = cfg.submit.mode;
    const useWa = mode === 'whatsapp' || mode === 'both' || !cfg.submit.webhookUrl;

    // Open WhatsApp first, inside the tap, or the browser blocks the new window.
    if (useWa) window.open(waUrl, '_blank');

    if ((mode === 'webhook' || mode === 'both') && cfg.submit.webhookUrl) {
      sendBtn.disabled = true;
      sendBtn.textContent = 'Enviando…';
      try {
        // text/plain + no-cors: no preflight, so it works with Google Apps Script and most webhooks.
        await fetch(cfg.submit.webhookUrl, {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload),
        });
      } catch {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Enviar al buzón ⚡';
        if (!useWa) {
          showError('No se pudo enviar. Prueba otra vez o mándalo por WhatsApp.');
          waLink.href = waUrl;
          doneWa.hidden = false;
          return;
        }
      }
      sendBtn.disabled = false;
      sendBtn.textContent = 'Enviar al buzón ⚡';
    }

    // Success: the bar takes the visitor's aporte (visual only, until it's verified) and their card joins the wall.
    if (recargo && monto > 0) { base += monto; extra = 0; tiers.forEach((b) => b.setAttribute('aria-pressed', 'false')); render(); surge(); }
    if (recargo) addCard(handle, sugerencia);
    doneText.textContent = recargo
      ? `Gracias, ${handle}. Cuando verifiquemos tu recarga sales en el Muro de Productores Oficiales del próximo video.`
      : `Gracias, ${handle}. Tu idea ya está en el buzón de la comunidad.`;
    waLink.href = waUrl;
    doneWa.hidden = !useWa;
    form.hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    celebrate();
  });

  $('[data-again]')?.addEventListener('click', () => {
    form.reset();
    paid.hidden = true; paid.disabled = true;
    count.textContent = '0';
    done.hidden = true;
    form.hidden = false;
    (form.elements.namedItem('handle') as HTMLInputElement).focus();
  });

  /* ---------- wall ---------- */
  const wall = $('[data-wall]');
  const tpl = $<HTMLTemplateElement>('[data-card-tpl]');
  function addCard(handle: string, suggestion: string) {
    if (!wall || !tpl) return;
    const li = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    li.querySelector('.card__handle')!.textContent = handle;
    li.querySelector('.card__idea')!.textContent = `“${suggestion}”`;
    wall.prepend(li);
  }

  /* ---------- confetti + lightning ---------- */
  function celebrate() {
    if (reduce) return;
    const c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    Object.assign(c.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '60' });
    document.body.append(c);
    const w = innerWidth, h = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr;
    const ctx = c.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const colors = ['#00ff87', '#742384', '#c784dc', '#ffb020', '#ffffff'];
    const bits = Array.from({ length: 150 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 60, y: h * 0.6,
      vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 17 - 5,
      s: Math.random() * 6 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
      c: colors[(Math.random() * colors.length) | 0],
    }));
    const bolt = () => {
      const pts: [number, number][] = [[Math.random() * w, 0]];
      const endY = h * (0.35 + Math.random() * 0.3);
      while (pts[pts.length - 1][1] < endY) {
        const [x, y] = pts[pts.length - 1];
        pts.push([x + (Math.random() - 0.5) * 70, y + 20 + Math.random() * 40]);
      }
      return pts;
    };
    const bolts = [bolt(), bolt(), bolt()];
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, w, h);
      if (t < 520) {
        const on = Math.floor(t / 70) % 2 === 0;
        if (on) {
          ctx.fillStyle = 'rgba(0,255,135,0.07)';
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = '#eafff4'; ctx.lineWidth = 2.5; ctx.shadowColor = '#00ff87'; ctx.shadowBlur = 18;
          for (const b of bolts) { ctx.beginPath(); b.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
          ctx.shadowBlur = 0;
        }
      }
      for (const p of bits) {
        p.vy += 0.42; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
      if (t < 2600) requestAnimationFrame(frame); else c.remove();
    };
    requestAnimationFrame(frame);
  }

  render();
})();
