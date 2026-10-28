// Small shared builders for the MYUPPY scenes: a giant Bebas word, an image plate, a backdrop.
import { el } from './engine.js';
import { W, H, fitFont } from './kit.js';

/** A giant word: font size in px, then shrunk to fit maxW (default 94 % of the frame). Returns { d, w, h, size }. */
export function mkWord(parent, text, size, cls = '', maxW = W * 0.94) {
  const d = el('div', `kin ${cls}`.trim(), parent, text);
  d.style.fontSize = `${size}px`;
  const w = fitFont(d, maxW);
  return { d, w, h: d.offsetHeight, size: parseFloat(d.style.fontSize) };
}

/** An <img> at an exact width (height follows); returns { d, w, h }. */
export function mkImg(parent, src, w, cls = '', style = {}) {
  const d = el('img', `abs ${cls}`.trim(), parent);
  d.src = src;
  d.style.width = `${w}px`;
  Object.assign(d.style, style);
  return d;
}

/** Ground of a scene: the brand black with a moving grid and a soft coloured glow. */
export function mkBackdrop(parent, color = 'var(--accent)', grid = true) {
  const bg = el('div', 'layer', parent);
  bg.style.background = `radial-gradient(ellipse 80% 55% at 50% 45%, color-mix(in srgb, ${color} 16%, var(--bg)) 0%, var(--bg) 72%)`;
  const g = el('div', 'layer grid', parent);
  g.style.backgroundSize = '120px 120px';
  g.style.opacity = grid ? '0.5' : '0';
  return { bg, grid: g };
}

export const ICONS = {
  phone: '<path d="M7 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 5 5a2 2 0 0 1 2-2z" fill="#f2eee6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="#f2eee6" stroke-width="2.6"/><path d="M4 7l8 6 8-6" fill="none" stroke="#f2eee6" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  cam: '<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="#f2eee6" stroke-width="2.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="#f2eee6" stroke-width="2.6"/><circle cx="17.2" cy="6.8" r="1.4" fill="#f2eee6"/>',
};
export { W, H };
