// Hook (beats 0–8): «СМЕЛЫЕ ИДЕИ» slam on beats 1–2 and then sink behind the frame as a ghost outline; «В ЦИФРОВУЮ ФОРМУ»
// lands in front of them on beats 4–5 with a neon laser sweep; a whip pan exits left into the logo drop.
import { el, set, P, ease, clamp, lerp, svgEl } from '../engine.js';
import { CUE, S, BEAT, FPS } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, U, slam, shakes, flash, whip, scramble, drawSpeedLines } from '../kit.js';
import { mkWord, mkBackdrop } from '../mk.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  const { bg, grid } = mkBackdrop(root);
  const cam = el('div', 'layer', root);
  cam.style.transformOrigin = '50% 50%';

  // far layer: a neon ring that keeps growing behind everything
  const R = 430;
  const ring = el('div', 'abs', cam, `<svg width="${2 * R + 40}" height="${2 * R + 40}" viewBox="${-R - 20} ${-R - 20} ${2 * R + 40} ${2 * R + 40}"><circle r="${R}" fill="none" stroke="#6ff3ff" stroke-width="4"/></svg>`);

  // layer 2: the first pair — huge, filled, then it recedes into an outline ghost
  const a = mkWord(cam, TX.hook[0], 400, 'violet');
  const bw = mkWord(cam, TX.hook[1], 640, 'accent glow');
  // layer 3: the second pair, in front of the ghost
  const c = mkWord(cam, TX.hook2[0], 330, '');
  const d = mkWord(cam, TX.hook2[1], 640, 'chrome');
  [a, bw, c, d].forEach((w) => { w.d.style.transformOrigin = '50% 62%'; });

  const stack1 = a.h * 0.92 + bw.h * 0.9;
  const top1 = H / 2 - stack1 / 2 - 20;
  const stack2 = c.h * 0.92 + d.h * 0.9;
  const top2 = H / 2 - stack2 / 2 - 20;

  // front: a laser line, the small caption, the corner marks
  const laser = el('div', 'abs', cam);
  Object.assign(laser.style, { width: '10px', height: `${H}px`, background: 'linear-gradient(90deg, transparent, #fff 50%, transparent)', boxShadow: '0 0 40px 12px rgba(111,243,255,.75)' });
  const top = el('div', 'abs caps', cam, TX.top);
  top.style.color = 'var(--accent)';
  const topW = top.offsetWidth;
  const rule = el('div', 'abs', cam);
  Object.assign(rule.style, { width: `${W * 0.76}px`, height: '3px', background: 'var(--accent)', boxShadow: '0 0 18px var(--accent)', transformOrigin: '0 50%' });
  const fl = el('div', 'flash', root);

  const hits = [CUE.w1, CUE.w2, CUE.w3, CUE.w4];

  return (t, f) => {
    const on = t >= S.hook[0] && t <= S.hook[1];
    set(root, { vis: on });
    if (!on) return;
    const since = t >= CUE.w1 ? (t - CUE.w1) % BEAT : 9;
    set(grid, { x: -((t * 60) % 120), y: -((t * 40) % 120), o: 0.5 });
    set(bg, { o: 1 });

    // ring: grows through the whole hook, pulses on every beat
    const rp = P(t, 0, CUE.exit, ease.outCubic);
    set(ring, { x: W / 2 - R - 20, y: H / 2 - R - 20, s: 0.35 + rp * 1.35 + 0.04 * Math.exp(-since * 6), o: t < CUE.line ? 0 : 0.5 * (1 - 0.6 * rp) });

    // pair 1: slams on 1 and 2, recedes on the 4th beat
    const rec = ease.outCubic(clamp((t - CUE.w3) / 0.45));
    const s1 = slam(t, CUE.w1, { from: 1.8, dur: 0.24 });
    const s2 = slam(t, CUE.w2, { from: 1.8, dur: 0.24 });
    const ghost = 1 + 0.45 * rec;
    a.d.classList.toggle('outline', t >= CUE.w3);
    bw.d.classList.toggle('outline', t >= CUE.w3);
    set(a.d, { x: W / 2 - a.w / 2, y: top1 + lerp(0, -140, rec), s: s1.s * ghost, skx: -10 * (1 - ease.outCubic(clamp((t - CUE.w1) / 0.24))), o: t < CUE.w1 ? 0 : s1.o * lerp(1, 0.22, rec), blur: rec * 5 });
    set(bw.d, { x: W / 2 - bw.w / 2, y: top1 + a.h * 0.92 + lerp(0, 150, rec), s: s2.s * ghost, skx: -10 * (1 - ease.outCubic(clamp((t - CUE.w2) / 0.24))), o: t < CUE.w2 ? 0 : s2.o * lerp(1, 0.22, rec), blur: rec * 5 });

    // pair 2: lands in front — sharp, full colour
    const s3 = slam(t, CUE.w3, { from: 1.9, dur: 0.22 });
    const s4 = slam(t, CUE.w4, { from: 2.1, dur: 0.24, overshoot: 0.08 });
    c.d.style.color = 'transparent';
    c.d.style.webkitTextStroke = '4px #eef2f8';
    set(c.d, { x: W / 2 - c.w / 2, y: top2, s: s3.s, o: t < CUE.w3 ? 0 : s3.o });
    set(d.d, { x: W / 2 - d.w / 2, y: top2 + c.h * 0.92, s: s4.s, o: t < CUE.w4 ? 0 : s4.o });

    // laser sweeps across in front of everything right on beat 4
    const lp = P(t, CUE.w3 - 0.02, CUE.w3 + 0.28, ease.outExpo);
    set(laser, { x: lerp(-60, W + 60, lp), y: 0, o: t < CUE.w3 - 0.02 || t > CUE.w3 + 0.3 ? 0 : 1 - lp * 0.6 });

    // caption: decodes in, rule draws under it
    const cp = clamp((f / FPS - CUE.line) / 0.55);
    top.textContent = scramble(TX.top, cp, f / FPS, 3);
    set(top, { x: W / 2 - topW / 2, y: 150, o: t < CUE.line ? 0 : 1 });
    set(rule, { x: W * 0.12, y: 214, sx: P(t, CUE.line, CUE.line + 0.5, ease.outExpo), o: t < CUE.line ? 0 : 1 });

    // camera: shakes on every hit, a slow push, whip exit left on the drop
    const sh = shakes(t, hits, 18, 0.35);
    const push = 1 + 0.05 * P(t, CUE.w4, CUE.exit, ease.inOutSine);
    const wx = whip(t, CUE.exit, CUE.drop - CUE.exit + 0.1, W * 1.3, 'out');
    set(cam, { x: sh.x + wx, y: sh.y, r: sh.r, s: push });

    if (t >= CUE.exit - 0.05 && t < CUE.drop + 0.35) {
      drawSpeedLines(ctx.fx, t, { seed: 11, n: 70, dir: -1, alpha: 0.6 * (1 - P(t, CUE.drop, CUE.drop + 0.35)), speed: 7500, color: '170,235,255' });
    }
    set(fl, { o: Math.max(...hits.map((h) => flash(t, h, 0.1, 0.16))) });
  };
}
