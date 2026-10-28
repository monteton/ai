// Polako RAW (beats 29–37): the product window flies in at an angle BETWEEN two giant words — POLAKO above and behind it,
// RAW below and behind it — with the emblem and the feature chips in front. The screen changes on the beats; the exit
// is a zoom straight into the window.
import { el, set, P, ease, clamp, lerp, wobble } from '../engine.js';
import { CUE, S, b } from '../timeline.mjs';
import { TX } from '../i18n.js';
import { W, H, shakes, slam, flash, whip, scramble, drawSpeedLines, makeSparks, drawSparks } from '../kit.js';
import { mkWord, mkImg, mkBackdrop } from '../mk.js';

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  root.style.zIndex = '4';
  const { bg, grid } = mkBackdrop(root, 'var(--accent)');
  const cam = el('div', 'layer', root);
  cam.style.overflow = 'visible';
  // perspective lives on the parent of the window only; the words stay flat, so the window's tilt never reorders the layers
  const world = el('div', 'layer', cam);
  world.style.overflow = 'visible';
  world.style.perspective = '1700px';
  world.style.perspectiveOrigin = '50% 46%';

  const CYw = H * 0.46;
  // behind: the two words
  const w1 = mkWord(world, 'POLAKO', 640, 'accent outline', W * 0.98);
  w1.d.style.webkitTextStroke = '4px #6ff3ff';
  const w2 = mkWord(world, 'RAW', 880, 'accent glow', W * 0.98);

  // the window (an app screenshot, 2000×1250): rounded, glowing, tilted in 3D
  const WW = 1060, WH = WW * 1250 / 2000;
  const win = el('div', 'abs', world);
  Object.assign(win.style, { width: `${WW}px`, height: `${WH}px`, borderRadius: '22px', overflow: 'hidden', background: '#05070c',
    boxShadow: '0 0 0 2px rgba(111,243,255,.7), 0 0 90px rgba(111,243,255,.4), 0 60px 140px rgba(0,0,0,.7)' });
  const shots = ['raw-sky-budva', 'raw-grading-bay', 'raw-mixer-marina'].map((n) => {
    const im = mkImg(win, `assets/img/${n}.jpg`, WW);
    return im;
  });
  const shotAt = [0, CUE.chip2 - 0.02, CUE.chip4 - 0.02];

  // front: tag, emblem, chips, the line
  const tag = el('div', 'abs caps', cam, TX.polakoTag);
  Object.assign(tag.style, { fontSize: '40px', color: '#04050a', background: 'var(--accent)', padding: '12px 26px 8px', letterSpacing: '0.2em' });
  const tagW = tag.offsetWidth;
  const emb = mkImg(cam, 'assets/img/polako-emblem.png', 210);
  emb.style.filter = 'drop-shadow(0 12px 30px rgba(0,0,0,.6))';
  const chips = TX.polakoChips.map((txt) => { const d = el('div', 'chip', cam, txt); d.style.fontSize = '46px'; return { d, w: d.offsetWidth, h: d.offsetHeight }; });
  const chipPos = [[W * 0.04, H * 0.265, -5], [W * 0.5, H * 0.335, 4], [W * 0.05, H * 0.655, -4], [W * 0.36, H * 0.715, 3]];
  const chipAt = [CUE.chip1, CUE.chip2, CUE.chip3, CUE.chip4];
  const line = el('div', 'abs', cam, TX.polakoLine);
  Object.assign(line.style, { width: `${W - 160}px`, font: '400 88px/0.98 var(--display)', textTransform: 'uppercase', color: '#eef2f8' });
  const lineBar = el('div', 'abs', cam);
  Object.assign(lineBar.style, { width: '240px', height: '10px', background: 'var(--accent)', boxShadow: '0 0 24px var(--accent)', transformOrigin: '0 50%' });
  const sparks = makeSparks({ seed: 21, n: 120, t0: CUE.polako + 0.2, spread: 0.15, dir: -Math.PI / 2, cone: 1.8, v0: 400, v1: 1400,
    origin: (u) => [W * 0.1 + W * 0.8 * u, CYw + WH / 2], color: [[111, 243, 255], [255, 255, 255]], ember: false });
  const fl = el('div', 'flash', root);

  return (t, f) => {
    const on = t >= S.polako[0] && t <= S.polako[1];
    if (!on) { set(root, { vis: false }); return; }
    const sh = shakes(t, [CUE.polako, CUE.chip1, CUE.chip2, CUE.chip3, CUE.chip4], 14, 0.3);
    set(root, { vis: true, o: 1 });
    const d0 = t - CUE.polako;
    set(bg, { o: P(t, S.polako[0], S.svc[1]) });
    set(grid, { x: -((t * 60) % 120), y: -((t * 40) % 120), o: 0.5 * P(t, S.polako[0], S.svc[1]) });

    // words: slam from the sides, then drift apart slowly (parallax against the window)
    const sa = slam(t, CUE.polako + 0.05, { from: 1.5, dur: 0.3, overshoot: 0.04 });
    const sb = slam(t, CUE.polako + 0.14, { from: 1.6, dur: 0.3, overshoot: 0.04 });
    const dr = Math.max(0, d0) * 20;
    set(w1.d, { x: W / 2 - w1.w / 2 - dr, y: H * 0.26 - w1.h / 2, s: sa.s, o: d0 < 0.05 ? 0 : sa.o });
    set(w2.d, { x: W / 2 - w2.w / 2 + dr, y: H * 0.62 - w2.h / 2, s: sb.s, o: d0 < 0.14 ? 0 : sb.o });

    // the window: whips in from the right, settles into a tilt, then turns slowly; the exit is a zoom into it
    const ar = ease.outExpo(clamp(d0 / 0.6));
    const turn = Math.sin((t - CUE.polako) * 0.9);
    const zoom = P(t, CUE.polakoExit, S.polako[1], ease.inQuart);
    shots.forEach((im, k) => set(im, { x: 0, y: 0, vis: t >= shotAt[k] && (k === shots.length - 1 || t < shotAt[k + 1]), o: 1 }));
    set(win, {
      x: W / 2 - WW / 2 + lerp(W * 1.1, 0, ar) - zoom * 40, y: CYw - WH / 2,
      rx: lerp(0, 9, ar) + turn * 3, ry: lerp(-50, -17, ar) + turn * 6, r: lerp(10, 0, ar) - 2 * zoom,
      s: (1 + 0.07 * P(d0, 0, 3, ease.outCubic)) * (1 + zoom * 5.5), o: d0 < 0 ? 0 : 1,
    });

    // front elements
    set(tag, { x: W / 2 - tagW / 2, y: H * 0.115, o: t < CUE.polako + 0.2 ? 0 : 1, s: 1 + 0.1 * Math.exp(-(t - CUE.polako - 0.2) * 9) });
    const ep = ease.outBackHard(clamp((t - (CUE.polako + 0.45)) / 0.4));
    set(emb, { x: W * 0.77, y: H * 0.15 + lerp(80, 0, ep), s: ep, r: 14 * wobble(t - (CUE.polako + 0.45), 3, 0.3) * 4 + (t - CUE.polako) * 14, o: clamp((t - CUE.polako - 0.45) / 0.05) });
    chips.forEach((c, i) => {
      const dd = t - chipAt[i];
      const pp = ease.outBackHard(clamp(dd / 0.3));
      set(c.d, { x: chipPos[i][0], y: chipPos[i][1] + lerp(70, 0, pp) + 8 * Math.sin(t * 2.2 + i * 1.7), s: lerp(0.4, 1, pp), r: chipPos[i][2], o: clamp(dd / 0.05) * (1 - zoom) });
    });
    const lp = ease.outExpo(clamp((t - (CUE.polako + 0.8)) / 0.5));
    set(lineBar, { x: 80, y: H * 0.8 - 26, sx: lp, o: t < CUE.polako + 0.8 ? 0 : 1 - zoom });
    set(line, { x: 80, y: H * 0.8 + lerp(36, 0, lp), o: clamp((t - CUE.polako - 0.8) / 0.1) * (1 - zoom) });

    if (d0 > 0.15 && d0 < 1.6) drawSparks(ctx.fx, sparks, t, 1);
    if (t > CUE.polako - 0.1 && t < CUE.polako + 0.35) drawSpeedLines(ctx.fx, t, { seed: 71, n: 50, dir: -1, alpha: 0.5 * (1 - clamp(d0 / 0.35)), speed: 8000, color: '170,235,255' });
    const fz = Math.max(flash(t, CUE.polako, 0.14, 0.4), flash(t, CUE.chip2, 0.1, 0.25), flash(t, CUE.chip4, 0.1, 0.25), P(t, CUE.polakoExit + 0.4, S.polako[1], ease.inCubic) * 0.9);
    set(fl, { o: fz });
    set(cam, { x: sh.x, y: sh.y, r: sh.r });
  };
}
