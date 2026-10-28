// Lockup (beat 38 → end): the giant red M again, the dark logo slams in front of it, an outline of the M cuts across; «Vaš sledeći
// događaj POČINJE OVDE», a red button, three contacts pop; a last hit on beat 44, then the frame holds for ~2 s.
import { el, set, P, ease, clamp, lerp } from '../engine.js';
import { CUE, S, DURATION, b } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, shake, slam, flash, ring, makeSparks, drawSparks } from '../kit.js';
import { mkWord, mkImg, ICONS } from '../mk.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '6';
  const bg = el('div', 'layer', root);
  bg.style.background = '#f2eee6';
  const lock = el('div', 'layer', root);
  lock.style.transformOrigin = '50% 40%';

  const cy = H * 0.2;
  const m = mkWord(lock, 'M', 950, 'red', W * 1.0);
  const mOut = mkWord(lock, 'M', m.size, 'outline', W * 1.0);
  mOut.d.style.color = 'transparent';
  mOut.d.style.webkitTextStroke = '3px rgba(17,17,17,.3)';
  const LW = 560;
  const LH = LW * 659 / 700;
  const logo = mkImg(lock, 'assets/img/logo-dark.png', LW);
  const R = 320;
  const shock = ring(lock, R, 10, '#ff4a1c');
  const shock2 = ring(lock, R, 6, '#111');

  const tag = el('div', 'abs caps', lock, TX.tagline);
  Object.assign(tag.style, { fontSize: '30px', color: '#111', fontWeight: '800' });
  const tagW = tag.offsetWidth;
  const c1 = el('div', 'abs serif', lock, TX.cta[0]);
  Object.assign(c1.style, { fontSize: '128px', lineHeight: '1', color: '#111' });
  const c1W = c1.offsetWidth;
  const c2 = mkWord(lock, TX.cta[1], 400, 'red', W * 0.94);
  const btn = el('div', 'abs', lock, TX.ctaBtn);
  Object.assign(btn.style, { font: '800 44px/1 var(--display)', letterSpacing: '0.12em', background: '#ff4a1c', color: '#f2eee6', padding: '30px 54px 26px', whiteSpace: 'nowrap' });
  const btnW = btn.offsetWidth;
  const pills = TX.contacts.map((c) => {
    const d = el('div', 'pill', lock, `<i style="width:70px;height:70px"><svg width="36" height="36" viewBox="0 0 24 24">${ICONS[c.icon] || ''}</svg></i><span>${c.text}</span>`);
    Object.assign(d.style, { height: '92px', padding: '0 40px 0 12px', font: '800 40px/1 var(--display)', letterSpacing: '0.02em' });
    return { d, w: d.offsetWidth, h: d.offsetHeight };
  });
  const pillY = H * 0.665;
  pills.forEach((p, i) => { p.x = W / 2 - p.w / 2; p.y = pillY + i * (p.h + 22); });
  const sparks = makeSparks({ seed: 7, n: 150, t0: CUE.logo + 0.02, spread: 0.12, dir: -Math.PI / 2, cone: 1.6, v0: 450, v1: 1600,
    origin: (u) => [W / 2 - LW / 2 + LW * u, cy + LH * 0.5], color: [[255, 74, 28], [17, 17, 17], [255, 140, 90]], ember: false });
  const fl = el('div', 'flash', root);

  return (t) => {
    const on = t >= S.lockup[0] && t <= DURATION + 0.1;
    if (!on) { set(root, { vis: false }); return; }
    set(root, { vis: true, o: 1 });
    const L = t - CUE.logo;
    set(bg, { o: P(t, S.lockup[0], S.proof[1]) });
    const sm = slam(t, CUE.logo + 0.04, { from: 1.5, dur: 0.3, overshoot: 0.03 });
    const sl = slam(t, CUE.logo, { from: 2.4, dur: 0.3, overshoot: 0.06 });
    const pulse = t > CUE.final ? 1 + 0.03 * Math.exp(-(t - CUE.final) * 7) : 1;
    set(m.d, { x: W / 2 - m.w / 2, y: cy - m.h / 2 + 30, s: sm.s * pulse, o: t < CUE.logo ? 0 : sm.o });
    set(mOut.d, { x: W / 2 - mOut.w / 2, y: cy - mOut.h / 2 + 30, s: sm.s * pulse, o: t < CUE.logo + 0.08 ? 0 : sm.o });
    set(logo, { x: W / 2 - LW / 2, y: cy - LH / 2 + 10 * Math.sin(L * 2.2), s: sl.s * pulse, r: -3 * (1 - ease.outCubic(clamp(L / 0.3))), o: t < CUE.logo ? 0 : sl.o });
    const rp = clamp(L / 0.7);
    set(shock, { x: W / 2 - R - 20, y: cy - R - 20, s: 0.3 + rp * 3, o: L < 0 ? 0 : (1 - rp) * 0.7 });
    const fp = clamp((t - CUE.final) / 0.6);
    set(shock2, { x: W / 2 - R - 20, y: cy - R - 20, s: 0.4 + fp * 2.8, o: t < CUE.final ? 0 : (1 - fp) * 0.6 });
    if (L > 0 && L < 1.4) drawSparks(ctx.fx, sparks, t, 1);

    const tp = ease.outCubic(clamp((t - CUE.tagline) / 0.45));
    set(tag, { x: W / 2 - tagW / 2, y: H * 0.376 + lerp(24, 0, tp), o: tp });
    const s1 = slam(t, CUE.cta, { from: 1.4, dur: 0.24 });
    const s2 = slam(t, CUE.cta + b(0.5), { from: 1.6, dur: 0.26, overshoot: 0.06 });
    set(c1, { x: W / 2 - c1W / 2, y: H * 0.405, s: s1.s, o: t < CUE.cta ? 0 : s1.o });
    set(c2.d, { x: W / 2 - c2.w / 2, y: H * 0.405 + 118, s: s2.s, o: t < CUE.cta + b(0.5) ? 0 : s2.o });
    const bp = ease.outBackSoft(clamp((t - (CUE.cta + b(1))) / 0.35));
    set(btn, { x: W / 2 - btnW / 2, y: H * 0.56 + lerp(40, 0, bp), s: lerp(0.8, 1, bp), o: clamp((t - CUE.cta - b(1)) / 0.08) });
    pills.forEach((p, i) => {
      const d = t - [CUE.c1, CUE.c2, CUE.c3][i];
      const pp = ease.outBackSoft(clamp(d / 0.35));
      set(p.d, { x: p.x, y: p.y + lerp(50, 0, pp), s: lerp(0.85, 1, pp), o: clamp(d / 0.08) });
    });
    const sh = shake(t, CUE.logo, 24, 0.5, 40);
    const sh2 = shake(t, CUE.final, 14, 0.4, 41);
    set(lock, { x: sh.x + sh2.x, y: sh.y + sh2.y, s: 1 + 0.02 * P(t, CUE.cta, DURATION, ease.inOutSine), o: 1 });
    set(fl, { o: Math.max(flash(t, CUE.logo, 0.12, 0.5), flash(t, CUE.final, 0.1, 0.3)) });
  };
}
