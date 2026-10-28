// Hook (beats 0–6): three words stack up on the first three beats — ZVUK in ink, SVETLO in paper on a red slab, EKRANI in red —
// each with an outlined echo behind it. On beat 4 an ink circle swallows the frame, a record spins in, and on beat 5 a lightning
// bolt strikes it; a whip left lands on the logo drop.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, BEAT } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, slam, shakes, flash, whip, drawSpeedLines } from '../kit.js';
import { mkWord } from '../mk.js';

const REC_R = 400;
function recordSvg() {
  let rings = '';
  for (let r = 150; r < REC_R - 10; r += 17) rings += `<circle r="${r}" fill="none" stroke="#2a2a2a" stroke-width="${r % 34 ? 2 : 3}"/>`;
  return `<svg width="${2 * REC_R + 40}" height="${2 * REC_R + 40}" viewBox="${-REC_R - 20} ${-REC_R - 20} ${2 * REC_R + 40} ${2 * REC_R + 40}">
    <circle r="${REC_R}" fill="#1b1b1b"/>${rings}
    <path d="M-330 -130 A350 350 0 0 1 -130 -330" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="14" stroke-linecap="round"/>
    <circle r="140" fill="#ff4a1c"/><circle r="140" fill="none" stroke="#f2eee6" stroke-width="4" transform="scale(.82)"/>
    <circle r="16" fill="#111"/></svg>`;
}
const BOLT = '<svg width="420" height="640" viewBox="0 0 420 640"><path d="M330 0 L110 300 L220 300 L40 640 L390 230 L260 230 L420 0Z" fill="#ff4a1c" stroke="#f2eee6" stroke-width="8" stroke-linejoin="round"/></svg>';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  const bg = el('div', 'layer', root);
  bg.style.background = 'var(--paper)';
  const cam = el('div', 'layer', root);
  cam.style.transformOrigin = '50% 50%';

  const cols = [{ fg: 'var(--ink)' }, { fg: 'var(--paper)' }, { fg: 'var(--red)' }];
  const lines = TX.hook.map((txt, i) => {
    const echo = mkWord(cam, txt, 700, 'outline', W * 1.02);
    echo.d.style.color = 'rgba(17,17,17,.22)';
    echo.d.style.webkitTextStroke = '3px rgba(17,17,17,.22)';
    const slab = el('div', 'abs', cam);
    slab.style.background = 'var(--red)';
    slab.style.transformOrigin = '0 50%';
    const w = mkWord(cam, txt, 700, '', W * 0.94);
    w.d.style.color = cols[i].fg;
    echo.d.style.fontSize = w.d.style.fontSize;
    return { echo, slab, w };
  });
  const lh = lines.map((l) => l.w.h * 0.92);
  const total = lh.reduce((a, c) => a + c, 0) + 60;
  const top = H * 0.47 - total / 2;
  let yy = top;
  lines.forEach((l, i) => { l.y = yy; l.slabH = lh[i] + 8; yy += lh[i]; });
  const note = el('div', 'abs serif red', cam, TX.hookNote);
  note.style.fontSize = '120px';
  note.style.lineHeight = '1';
  const noteW = note.offsetWidth;

  // ink circle, record, bolt
  const CIR = 3600;
  const ink = el('div', 'abs', root);
  Object.assign(ink.style, { width: `${CIR}px`, height: `${CIR}px`, borderRadius: '50%', background: 'var(--ink)', zIndex: '5' });
  const rec = el('div', 'abs', root, recordSvg());
  rec.style.zIndex = '6';
  const bolt = el('div', 'abs', root, BOLT);
  bolt.style.zIndex = '7';
  const fl = el('div', 'flash', root);
  fl.style.zIndex = '70';
  const rule = el('div', 'abs', cam);
  Object.assign(rule.style, { width: `${W * 0.8}px`, height: '10px', background: 'var(--red)', transformOrigin: '0 50%' });
  const tick = el('div', 'abs', cam);
  Object.assign(tick.style, { width: '6px', height: `${H}px`, background: 'var(--ink)', transformOrigin: '50% 0' });
  const hits = [CUE.w1, CUE.w2, CUE.w3];

  return (t) => {
    const on = t >= S.hook[0] && t <= S.hook[1];
    set(root, { vis: on });
    if (!on) return;
    set(bg, { o: 1 });

    // frame 1 already moves: a red rule draws across the middle while an ink line sweeps down, both give way to the first word
    const rp0 = ease.outExpo(clamp((t - 0.03) / 0.4));
    const burst = P(t, CUE.w1 - 0.04, CUE.w1 + 0.1, ease.outCubic);
    set(rule, { x: W * 0.1, y: H * 0.47 - 5, sx: rp0, sy: 1 + burst * 3, o: t >= CUE.w1 + 0.1 ? 0 : 1 });
    set(tick, { x: lerp(W * 0.22, W * 0.78, ease.inOutSine(clamp(t / CUE.w1))), y: 0, sy: ease.outExpo(clamp(t / 0.25)), o: t >= CUE.w1 ? 0 : 1 });
    lines.forEach((l, i) => {
      const s = slam(t, hits[i], { from: 1.5, dur: 0.22, overshoot: 0.05 });
      const wp = ease.outExpo(clamp((t - hits[i]) / 0.3));
      const x = W / 2 - l.w.w / 2;
      set(l.slab, { x: -20, y: l.y - 4, sx: i === 1 ? wp : 0, sy: 1, o: i === 1 && t >= hits[i] ? 1 : 0 });
      l.slab.style.width = `${W + 40}px`;
      l.slab.style.height = `${l.slabH}px`;
      set(l.echo.d, { x: x + 26, y: l.y - 4 + 18, s: s.s * 1.02, o: t < hits[i] ? 0 : s.o });
      set(l.w.d, { x, y: l.y, s: s.s, skx: -8 * (1 - ease.outCubic(clamp((t - hits[i]) / 0.24))), o: t < hits[i] ? 0 : s.o });
    });
    const np = ease.outExpo(clamp((t - (CUE.w3 + 0.25)) / 0.4));
    set(note, { x: W / 2 - noteW / 2 + lerp(80, 0, np), y: top + total + 10, o: t < CUE.w3 + 0.25 ? 0 : np });

    // ink circle grows from the middle on beat 4 and holds until the whip
    const cp = ease.outExpo(clamp((t - CUE.disc) / 0.5));
    set(ink, { x: W / 2 - CIR / 2, y: H / 2 - CIR / 2, s: cp, o: t < CUE.disc ? 0 : 1 });
    const rp = ease.outBackHard(clamp((t - (CUE.disc + 0.02)) / 0.45));
    const spin = (t - CUE.disc) * 360 * 2.2 * (1 / (1 + (t - CUE.disc) * 0.5));
    set(rec, { x: W / 2 - REC_R - 20, y: H * 0.46 - REC_R - 20, s: rp * 1.3, r: spin, o: t < CUE.disc + 0.02 ? 0 : 1 });
    // the bolt strikes down onto the record on beat 5
    const bd = t - CUE.bolt;
    const bp = ease.outExpo(clamp(bd / 0.16));
    set(bolt, { x: W / 2 - 120, y: H * 0.46 - 520 + lerp(-700, 0, bp), s: 1.15, o: bd < 0 || bd > 0.55 ? 0 : 1 - ease.inQuad(clamp((bd - 0.25) / 0.3)) });

    const sh = shakes(t, [CUE.w1, CUE.w2, CUE.w3, CUE.bolt], 18, 0.3);
    const wx = whip(t, CUE.exit, CUE.drop - CUE.exit + 0.1, W * 1.3, 'out');
    set(cam, { x: sh.x + wx, y: sh.y, r: sh.r });
    if (t >= CUE.exit - 0.05 && t < CUE.drop + 0.3) drawSpeedLines(ctx.fx, t, { seed: 5, n: 60, dir: -1, alpha: 0.6 * (1 - P(t, CUE.drop, CUE.drop + 0.3)), speed: 7500, color: '255,74,28', blend: 'source-over' });
    set(fl, { o: Math.max(...hits.map((h) => flash(t, h, 0.09, 0.12)), flash(t, CUE.bolt, 0.14, 0.7), flash(t, CUE.disc, 0.1, 0.25)) });
  };
}
