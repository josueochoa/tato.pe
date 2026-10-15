export type CartLine = { slug: string; qty: number };
const KEY = 'tato-cart';

export function readCart(): CartLine[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function writeCart(lines: CartLine[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  document.dispatchEvent(new CustomEvent('cart:change', { detail: lines }));
}
export function addToCart(slug: string, qty = 1) {
  const lines = readCart();
  const line = lines.find((l) => l.slug === slug);
  if (line) line.qty += qty; else lines.push({ slug, qty });
  writeCart(lines);
}
export function setQty(slug: string, qty: number) {
  const lines = readCart().map((l) => (l.slug === slug ? { ...l, qty } : l)).filter((l) => l.qty > 0);
  writeCart(lines);
}
export function clearCart() { writeCart([]); }

function paintBadge() {
  const lines = readCart();
  const n = lines.reduce((a, l) => a + l.qty, 0);
  document.querySelectorAll<HTMLElement>('[data-cart-link]').forEach((el) => { el.hidden = n === 0; });
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => { el.textContent = String(n); });
}

document.addEventListener('cart:change', paintBadge);
paintBadge();

// Buttons: <button data-add="slug">; they confirm in place.
document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((btn) => {
  btn.addEventListener('click', () => {
    addToCart(btn.dataset.add!);
    const label = btn.textContent;
    btn.textContent = 'Añadido · ver carrito';
    btn.classList.add('is-added');
    btn.addEventListener('click', () => { const link = document.querySelector<HTMLAnchorElement>('[data-cart-link]'); location.href = link?.href || `${document.documentElement.dataset.root || '/'}carrito/`; }, { once: true });
    setTimeout(() => { btn.textContent = label; btn.classList.remove('is-added'); }, 4000);
  });
});
