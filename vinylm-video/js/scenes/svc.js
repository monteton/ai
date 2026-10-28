// Equipment (beats 12–28): four panels of four beats — ZVUK, SVETLO, EKRANI, DJ. Each is a sandwich: a wall of the same word
// behind (outline · solid · outline), the equipment drawn in code in the middle, an outline slice of the solid word in front, and
// the site's own line under it. Panels arrive on a diagonal wipe, on the beat.
import { el, set, P, ease, clamp, lerp, noise1 } from '../engine.js';
import { SVC_AT, S, BEAT, b } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, shakes, slam, flash, slashClip, drawSpeedLines } from '../kit.js';
import { mkWord } from '../mk.js';

const INK = '#111111', PAPER = '#f2eee6', RED = '#ff4a1c';
const LOOK = [
  { ground: PAPER, word: INK, echo: 'rgba(17,17,17,.20)', gear: RED, line: INK, speed: '255,74,28' },
  { ground: INK, word: PAPER, echo: 'rgba(242,238,230,.22)', gear: RED, line: PAPER, speed: '242,238,230' },
  { ground: RED, word: INK, echo: 'rgba(17,17,17,.25)', gear: PAPER, line: INK, speed: '17,17,17' },
  { ground: PAPER, word: INK, echo: 'rgba(17,17,17,.20)', gear: RED, line: INK, speed: '255,74,28' },
];
const CY = H * 0.42;

// ---- the equipment, drawn in code -------------------------------------------------------------------------------------------
function artSpeakers(parent) {
  const root = el('div', 'layer', parent);
  const cabs = [];
  for (let i = 0; i < 6; i++) {
    const d = el('div', 'abs', root, `<svg width="420" height="170" viewBox="0 0 420 170"><rect x="4" y="4" width="412" height="162" rx="18" fill="#111" stroke="#f2eee6" stroke-width="4"/>
      <circle cx="115" cy="85" r="58" fill="#1f1f1f" stroke="#ff4a1c" stroke-width="5"/><circle cx="115" cy="85" r="30" fill="#ff4a1c"/><circle cx="115" cy="85" r="9" fill="#111"/>
      <circle cx="305" cy="85" r="58" fill="#1f1f1f" stroke="#ff4a1c" stroke-width="5"/><circle cx="305" cy="85" r="30" fill="#ff4a1c"/><circle cx="305" cy="85" r="9" fill="#111"/></svg>`);
    d.style.transformOrigin = '50% 50%';
    cabs.push(d);
  }
  const waves = [0, 1, 2, 3].map(() => el('div', 'abs', root, `<svg width="900" height="900" viewBox="-450 -450 900 900"><path d="M-250 -300 A390 390 0 0 1 -250 300" fill="none" stroke="#ff4a1c" stroke-width="12" stroke-linecap="round" transform="scale(-1,1)"/></svg>`));
  return { root, update(t, dt, look) {
    const kick = Math.exp(-(((t % BEAT) + BEAT) % BEAT) * 7);
    cabs.forEach((d, i) => {
      const fan = (i - 2.5) * 3.2;
      const ent = ease.outBack(clamp((dt - 0.08 * i) / 0.4));
      set(d, { x: W / 2 - 210 + 170 + (i - 2.5) * 14 + lerp(-W, 0, ent), y: CY - 560 + i * 178, r: fan, s: 1 + 0.025 * kick, o: dt < 0.08 * i ? 0 : 1 });
    });
    waves.forEach((w, i) => {
      const ph = (((dt * 1.6 + i * 0.25) % 1) + 1) % 1;
      set(w, { x: W / 2 - 420 + 360 + 170, y: CY - 450, s: 0.3 + ph * 1.5, o: dt < 0.5 ? 0 : (1 - ph) * 0.85 });
    });
  } };
}
function artLights(parent) {
  const root = el('div', 'layer', parent);
  const truss = el('div', 'abs', root, `<svg width="1200" height="70" viewBox="0 0 1200 70"><rect x="0" y="14" width="1200" height="42" fill="none" stroke="#f2eee6" stroke-width="6"/>${Array.from({ length: 24 }, (_, i) => `<path d="M${i * 50} 14 L${i * 50 + 25} 56 L${i * 50 + 50} 14" fill="none" stroke="#f2eee6" stroke-width="4"/>`).join('')}</svg>`);
  const heads = [0, 1, 2, 3].map((i) => {
    const beam = el('div', 'abs', root, `<svg width="760" height="1500" viewBox="-380 0 760 1500"><defs><linearGradient id="bm${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${i % 2 ? '#ff4a1c' : '#f2eee6'}" stop-opacity=".9"/><stop offset="1" stop-color="${i % 2 ? '#ff4a1c' : '#f2eee6'}" stop-opacity="0"/></linearGradient></defs><polygon points="-14,0 14,0 330,1500 -330,1500" fill="url(#bm${i})"/></svg>`);
    beam.style.transformOrigin = '380px 0';
    const body = el('div', 'abs', root, `<svg width="150" height="170" viewBox="0 0 150 170"><rect x="30" y="0" width="90" height="26" fill="#f2eee6"/><path d="M10 40 H140 V120 Q75 170 10 120Z" fill="#1b1b1b" stroke="#f2eee6" stroke-width="5"/><circle cx="75" cy="120" r="24" fill="#ff4a1c"/><circle cx="75" cy="120" r="10" fill="#fff"/></svg>`);
    body.style.transformOrigin = '75px 0';
    return { beam, body };
  });
  return { root, update(t, dt) {
    const tp = ease.outExpo(clamp(dt / 0.5));
    set(truss, { x: (W - 1200) / 2, y: CY - 520 - lerp(200, 0, tp), o: 1 });
    heads.forEach((h, i) => {
      const x = W / 2 + (i - 1.5) * 260;
      const sweep = Math.sin(t * 1.8 + i * 1.3) * 28 + (i % 2 ? 12 : -12);
      set(h.beam, { x: x - 380, y: CY - 470 - lerp(200, 0, tp), r: sweep, o: clamp((dt - 0.15) / 0.3) * (0.75 + 0.25 * Math.sin(t * 9 + i)) });
      set(h.body, { x: x - 75, y: CY - 500 - lerp(200, 0, tp), r: sweep * 0.8, o: tp });
    });
  } };
}
function artLed(parent) {
  const root = el('div', 'layer', parent);
  const COLS = 8, ROWS = 10, C = 84, G = 8;
  const frame = el('div', 'abs', root);
  Object.assign(frame.style, { width: `${COLS * (C + G) + 30}px`, height: `${ROWS * (C + G) + 30}px`, background: '#111', border: '5px solid #f2eee6', borderRadius: '10px' });
  const cells = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const d = el('div', 'abs', frame);
    Object.assign(d.style, { width: `${C}px`, height: `${C}px`, left: `${15 + c * (C + G)}px`, top: `${15 + r * (C + G)}px`, borderRadius: '8px' });
    cells.push({ d, c, r });
  }
  const PAL = ['#111', '#1d1d1d', '#ff4a1c', '#f2eee6', '#ff4a1c'];
  return { root, update(t, dt) {
    const ar = ease.outExpo(clamp(dt / 0.55));
    set(frame, { x: (W - (COLS * (C + G) + 30)) / 2, y: CY - (ROWS * (C + G) + 30) / 2 + lerp(300, 0, ar), s: lerp(0.8, 1, ar), o: clamp(dt / 0.05) });
    cells.forEach((q) => {
      const v = Math.sin(q.c * 0.9 + q.r * 0.55 - t * 4) + Math.sin(q.r * 0.7 - t * 2.3 + q.c * 0.2);
      const k = clamp(Math.floor((v + 2) / 4 * PAL.length), 0, PAL.length - 1);
      q.d.style.background = PAL[k];
    });
  } };
}
function artDisc(parent) {
  const root = el('div', 'layer', parent);
  const R = 470;
  let rings = '';
  for (let r = 175; r < R - 10; r += 18) rings += `<circle r="${r}" fill="none" stroke="#333" stroke-width="${r % 36 ? 2 : 3}"/>`;
  const disc = el('div', 'abs', root, `<svg width="${2 * R + 40}" height="${2 * R + 40}" viewBox="${-R - 20} ${-R - 20} ${2 * R + 40} ${2 * R + 40}"><circle r="${R}" fill="#111"/>${rings}<path d="M-380 -150 A410 410 0 0 1 -150 -380" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="16" stroke-linecap="round"/><circle r="165" fill="#ff4a1c"/><text y="40" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="120" fill="#f2eee6">M</text><circle r="14" fill="#f2eee6"/></svg>`);
  const arm = el('div', 'abs', root, `<svg width="300" height="760" viewBox="0 0 300 760"><circle cx="230" cy="50" r="46" fill="#f2eee6" stroke="#111" stroke-width="6"/><path d="M230 50 L230 520 L90 700" fill="none" stroke="#111" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><rect x="48" y="680" width="80" height="50" rx="10" fill="#ff4a1c" stroke="#111" stroke-width="6" transform="rotate(-36 88 705)"/></svg>`);
  arm.style.transformOrigin = '230px 50px';
  return { root, update(t, dt) {
    const ar = ease.outBackHard(clamp(dt / 0.55));
    set(disc, { x: W / 2 - R - 20, y: CY - R - 20, s: ar, r: dt * 200, o: dt < 0 ? 0 : 1 });
    set(arm, { x: W * 0.62, y: CY - 520, r: lerp(-38, 0, ease.outCubic(clamp((dt - 0.35) / 0.5))), o: clamp((dt - 0.25) / 0.1) });
  } };
}
const ART = { speakers: artSpeakers, lights: artLights, led: artLed, disc: artDisc };

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '3';
  const ends = SVC_AT.map((t) => t + b(4));

  const panels = TX.svc.map((sv, i) => {
    const look = LOOK[i];
    const g = el('div', 'layer', root);
    g.style.zIndex = String(i + 1);
    g.style.background = look.ground;

    // for the LED panel the wall goes BEHIND the word (the layers swap: screen, then the word in front of it)
    const artFirst = sv.art === 'led';
    const artEarly = artFirst ? ART[sv.art](g) : null;
    // 1. the wall of words, behind: outline · solid · outline
    const mid = mkWord(g, sv.word, 900, '', W * (sv.word.length < 3 ? 0.78 : 0.96));
    mid.d.style.color = look.word;
    const up = mkWord(g, sv.word, mid.size, 'outline', W * 1.2);
    up.d.style.webkitTextStroke = `3px ${look.echo}`; up.d.style.color = 'transparent'; up.d.style.fontSize = mid.d.style.fontSize;
    const dn = mkWord(g, sv.word, mid.size, 'outline', W * 1.2);
    dn.d.style.webkitTextStroke = `3px ${look.echo}`; dn.d.style.color = 'transparent'; dn.d.style.fontSize = mid.d.style.fontSize;
    // 2. the equipment
    const art = artEarly || ART[sv.art](g);
    // 3. an outline slice of the solid word, in front of the equipment
    const front = mkWord(g, sv.word, mid.size, 'outline', W * 1.2);
    front.d.style.fontSize = mid.d.style.fontSize;
    front.d.style.color = 'transparent';
    front.d.style.webkitTextStroke = `4px ${look.word}`;
    front.d.style.clipPath = 'inset(55% 0 0 0)';
    if (artFirst) front.d.style.display = 'none';
    // 4. the site's line
    const gear = el('div', 'abs caps', g, sv.gear);
    Object.assign(gear.style, { fontSize: '40px', color: look.gear, fontWeight: '800', letterSpacing: '0.16em' });
    const line = el('div', 'abs serif', g, sv.line);
    Object.assign(line.style, { fontSize: '88px', lineHeight: '1', color: look.line, width: `${W - 160}px`, whiteSpace: 'normal' });
    const lineH = line.offsetHeight;
    const rule = el('div', 'abs', g);
    Object.assign(rule.style, { width: '200px', height: '10px', background: look.gear, transformOrigin: '0 50%' });
    const fl = el('div', 'flash', g);
    return { g, mid, up, dn, art, front, gear, line, rule, fl, look, dir: i % 2 ? -1 : 1 };
  });

  return (t) => {
    const on = t >= S.svc[0] && t <= S.svc[1];
    if (!on) { set(root, { vis: false }); return; }
    const sh = shakes(t, SVC_AT, 16, 0.32);
    set(root, { vis: true, x: sh.x, y: sh.y, r: sh.r });
    panels.forEach((p, i) => {
      const T = SVC_AT[i];
      const start = T - 0.12;
      const visible = t >= start && t <= (i < panels.length - 1 ? ends[i] + 0.4 : S.svc[1]);
      set(p.g, { vis: visible });
      if (!visible) return;
      p.g.style.clipPath = i === 0 && t > T + 0.4 ? 'none' : slashClip(P(t, start, start + 0.34, ease.outExpo), 18);
      const dt = t - T;
      const sl = slam(t, T, { from: 1.4, dur: 0.26, overshoot: 0.05 });
      const lh = p.mid.h * 0.92;
      const drift = (dt - 0.4) * 22 * p.dir;
      const y0 = CY - p.mid.h / 2;
      set(p.up.d, { x: W / 2 - p.up.w / 2 - drift, y: y0 - lh, s: sl.s, o: dt < 0.05 ? 0 : sl.o });
      set(p.mid.d, { x: W / 2 - p.mid.w / 2 + drift, y: y0, s: sl.s, o: dt < 0 ? 0 : sl.o });
      set(p.dn.d, { x: W / 2 - p.dn.w / 2 - drift, y: y0 + lh, s: sl.s, o: dt < 0.05 ? 0 : sl.o });
      if (p.front.d.style.display !== 'none') set(p.front.d, { x: W / 2 - p.front.w / 2 + drift * 1.8, y: y0, s: sl.s, o: dt < 0.06 ? 0 : sl.o });
      p.art.update(t, dt, p.look);
      const cp = ease.outExpo(clamp((dt - 0.5) / 0.4));
      const yTop = H * 0.745;
      set(p.rule, { x: 80, y: yTop - 28, sx: cp, o: dt < 0.5 ? 0 : 1 });
      set(p.gear, { x: 80, y: yTop + lerp(30, 0, cp), o: clamp((dt - 0.5) / 0.1) });
      set(p.line, { x: 80, y: yTop + 62 + lerp(30, 0, cp), o: clamp((dt - 0.6) / 0.1) });
      set(p.fl, { o: flash(t, T, 0.12, 0.3) });
      if (dt > -0.1 && dt < 0.3) drawSpeedLines(ctx.fx, t, { seed: 60 + i, n: 36, dir: -p.dir, alpha: 0.45 * (1 - clamp(dt / 0.3)), speed: 7000, color: p.look.speed, blend: 'source-over' });
    });
  };
}
