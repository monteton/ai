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
  send: '<path d="M3 11.5L21 4l-5 17-4-7-9-2.5z" fill="#04050a"/>',
  cam: '<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="#04050a" stroke-width="2.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="#04050a" stroke-width="2.6"/><circle cx="17.2" cy="6.8" r="1.4" fill="#04050a"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="#04050a" stroke-width="2.8" stroke-linecap="round"/>',
};
export { W, H };
