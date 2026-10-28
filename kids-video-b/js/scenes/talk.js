// The talking head, framed like a designed page. Four layers, bottom to top: the video · typography BEHIND her (it tucks under her hair) ·
// the cutout of her (a matte per frame) · the layer in front (captions, the schedule board, the call to action).
// Everything on screen is tied to a word she says (js/words.mjs): the graphic starts a hair before its word, so they land together.
import { el, set, P, ease, clamp, lerp, keys } from '../engine.js';
import { CUE, S, FPS, CLIP, DURATION } from '../timeline.mjs';
import { WORDS } from '../words.mjs';
import { W, H } from '../kit.js';

const INK = '#ffffff', MARK = '#ffd84d', MUT = 'rgba(255,255,255,.58)', HAIR = 'rgba(255,255,255,.30)', DK = '#0e1222';
const FRAMES = Math.round(CLIP * 30); // 561 source frames
const W_ = (i) => ({ t: WORDS[i][0], s: WORDS[i][1], e: WORDS[i][2] });

// ---- helpers --------------------------------------------------------------------------------------------------------------------------------------
/** A text element sized to an exact width (px) by scaling its font. */
function fitExact(d, w) {
  d.style.fontSize = '100px';
  const k = w / d.offsetWidth;
  d.style.fontSize = `${100 * k}px`;
  return { fs: 100 * k, w: d.offsetWidth, h: d.offsetHeight };
}
const rise = (t, t0, dur = 0.42) => 1 - ease.outExpo(clamp((t - t0) / dur)); // 1 → 0
const appear = (t, t0, dur = 0.1) => clamp((t - t0) / dur);
/** A clip box: children rise out of its bottom edge. */
function maskBox(parent, w, h) {
  const m = el('div', 'abs', parent);
  Object.assign(m.style, { width: `${w}px`, height: `${h}px`, overflow: 'hidden' });
  return m;
}

export async function build(ctx) {
  const root = el('div', 'scene', ctx.stage);
  const cam = { x: 540, y: 760 };

  // ---- layer 1: the video; 2: behind; 3: the cutout; 4: in front -------------------------------------------------------------------------------
  const vid = el('img', 'abs', root);
  Object.assign(vid.style, { width: `${W}px`, height: `${H}px` });
  vid.style.filter = 'brightness(.5) contrast(1.12) saturate(.55)';
  const grade = el('div', 'layer', root);
  grade.style.background = 'linear-gradient(180deg, rgba(8,12,30,.62) 0%, rgba(10,16,40,.34) 38%, rgba(10,16,40,.30) 62%, rgba(8,12,30,.62) 100%)';
  const behind = el('div', 'layer free', root);
  const person = el('img', 'abs', root);
  Object.assign(person.style, { width: `${W}px`, height: `${H}px` });
  const front = el('div', 'layer free', root);

  vid.src = 'assets/footage/talk/00001.jpg'; person.src = 'assets/footage/talk-cut/00001.webp';
  const fileOf = (f) => Math.max(1, Math.min(FRAMES, Math.floor(f * 30 / FPS) + 1));
  const pad = (n) => String(n).padStart(5, '0');
  let shown = 1;
  const show = async (k) => {
    if (k === shown) return;
    shown = k;
    vid.src = `assets/footage/talk/${pad(k)}.jpg`;
    person.src = `assets/footage/talk-cut/${pad(k)}.webp`;
    await Promise.all([vid.decode().catch(() => {}), person.decode().catch(() => {})]);
  };

  // ---- camera: a slow push with a deliberate reframe at the big moments -------------------------------------------------------------------------
  const zoomKeys = [[0, 1.0], [1.1, 1.02], [2.0, 1.02], [3.0, 1.075], [5.1, 1.08], [5.9, 1.03], [13.4, 1.045], [13.7, 1.085], [14.8, 1.09], [16.9, 1.1], [DURATION, 1.115]];
  const zoomAt = (t) => keys(t, zoomKeys.map(([a, z]) => [a, z, ease.inOutCubic]));

  // ---- behind: the kicker «ИДЁТ НАБОР», the group name, «Жду всех», the question mark -----------------------------------------------------------------
  // kicker (1.2 → 2.1): a hairline, a small caps label, the word НАБОР in marker
  const kick = el('div', 'abs', behind);
  const kLine = el('div', 'abs', kick);
  Object.assign(kLine.style, { width: '120px', height: '3px', background: INK, transformOrigin: '0 50%' });
  const kMark = el('div', 'abs mark', kick);
  const kTxt = el('div', 'abs cap', kick, 'Идёт набор');
  kTxt.style.fontSize = '30px'; kTxt.style.fontWeight = '800'; kTxt.style.color = INK;
  const kW = kTxt.offsetWidth;
  Object.assign(kMark.style, { width: `${kW + 36}px`, height: '52px', transformOrigin: '0 50%' });

  // the group name lockup: ПУТЬ К / одарённому (serif italic on marker) / РЕБЁНКУ
  const lock = el('div', 'abs', behind);
  const mkLine = (cls, text, w) => {
    const box = el('div', 'abs', lock);
    const d = el('div', `abs ${cls}`, box, text);
    const m = fitExact(d, w);
    Object.assign(box.style, { width: `${m.w + 40}px`, height: `${m.h + 8}px`, overflow: 'hidden' });
    return { box, d, ...m };
  };
  const L1 = mkLine('sans', 'Путь к', 470);
  const L2txt = mkLine('serif', 'одарённому', 640);
  L2txt.d.style.color = '#ffffff';
  const L3 = mkLine('sans', 'Ребёнку', 560);
  // marker bar behind L2
  const L2bar = el('div', 'abs mark', lock);
  L2bar.style.transformOrigin = '0 50%';
  lock.insertBefore(L2bar, L2txt.box);
  const tag = el('div', 'abs cap', lock, 'Группа');
  tag.style.fontSize = '26px'; tag.style.fontWeight = '800'; tag.style.color = MUT;

  // «Жду всех»
  const wait = el('div', 'abs', behind);
  const waitBox = (() => { const box = maskBox(wait, 900, 230); const d = el('div', 'abs serif', box, 'Жду всех'); d.style.fontSize = '210px'; d.style.color = INK; return { box, d, w: d.offsetWidth }; })();
  const waitBar = el('div', 'abs mark', wait);
  Object.assign(waitBar.style, { width: '330px', height: '22px', transformOrigin: '0 50%' });

  // «?»
  const qm = el('div', 'abs serif', behind, '?');
  qm.style.fontSize = '620px'; qm.style.color = INK; qm.style.lineHeight = '0.8';
  const qmW = qm.offsetWidth;
  const chip = (text) => { const box = maskBox(behind, 620, 120); const bar = el('div', 'abs mark', box); bar.style.transformOrigin = '0 50%'; const d = el('div', 'abs sans', box, text); d.style.fontSize = '78px'; d.style.fontWeight = '800'; d.style.color = INK; const w = d.offsetWidth; Object.assign(bar.style, { width: `${w + 40}px`, height: '96px', left: '-14px', top: '8px' }); d.style.left = '6px'; d.style.top = '12px'; return { box, bar, d, w }; };
  const chipQ = chip('Вопросы');
  const chipI = chip('Интерес');

  // «с пяти до семи» → 17:00 — 19:00, set big in the top zone
  const timeG = el('div', 'abs', behind);
  const tCap = el('div', 'abs cap', timeG, 'Время'); tCap.style.fontSize = '26px'; tCap.style.fontWeight = '800'; tCap.style.color = MUT;
  const mkT = (text) => { const bar = el('div', 'abs mark', timeG); bar.style.transformOrigin = '0 50%'; const box = el('div', 'abs', timeG); const d = el('div', 'abs num', box, text); d.style.fontSize = '134px'; d.style.color = INK; const w = d.offsetWidth; const h = d.offsetHeight; Object.assign(box.style, { width: `${w}px`, height: `${h}px`, overflow: 'hidden' }); return { box, bar, d, w, h }; };
  const tA = mkT('17:00');
  const tB = mkT('19:00');
  const tDash = el('div', 'abs', timeG); Object.assign(tDash.style, { width: '64px', height: '10px', background: INK, transformOrigin: '0 50%' });
  const tGap = 28;
  // the marker sits behind 19:00: a bar slightly taller than the digits, wider than the box so the box does not clip it

  // ---- front: captions ------------------------------------------------------------------------------------------------------------------------------
  const CHUNKS = [[0, 3], [4, 5], [6, 7], [8, 11], [12, 14], [15, 18], [19, 21], [22, 25], [26, 29], [30, 31], [32, 35], [36, 38]];
  const SHOW_BOARD = [CUE.board - 0.1, CUE.boardOut]; // captions step aside while the schedule board builds
  const capBase = el('div', 'abs', front);
  const caps = CHUNKS.map(([a, z]) => {
    const t0 = WORDS[a][1] - 0.06;
    let t1 = WORDS[z][2] + 0.2;
    const box = el('div', 'abs', capBase);
    Object.assign(box.style, { width: '900px', textAlign: 'center', whiteSpace: 'normal', font: '800 58px/1.22 var(--display)', color: INK, letterSpacing: '-0.01em', textShadow: '0 2px 16px rgba(0,0,0,.5)' });
    const hl = el('div', 'abs mark', box);
    const spans = [];
    for (let i = a; i <= z; i++) {
      const quote = i === 8 ? '«' : '';
      const close = i === 11 ? '»' : '';
      const s = el('span', '', box, quote + WORDS[i][0] + close);
      s.style.position = 'relative';
      spans.push(s);
      if (i < z) box.appendChild(document.createTextNode(' '));
    }
    const rects = spans.map((s) => ({ x: s.offsetLeft, y: s.offsetTop, w: s.offsetWidth, h: s.offsetHeight }));
    return { box, hl, rects, a, z, t0, t1 };
  });

  // ---- front: the schedule board (bottom zone) ---------------------------------------------------------------------------------------------------------
  const BX = 70, BY = 1214, BW = 940;
  const board = el('div', 'abs', front);
  // a white sheet under the board so it reads on the pale cardigan: sharp corners, a hairline
  const sheet = el('div', 'abs', board);
  Object.assign(sheet.style, { left: '-26px', top: '-26px', width: `${940 + 52}px`, height: '394px', background: 'rgba(10,14,32,.46)', backdropFilter: 'blur(18px)', border: `1.5px solid ${HAIR}`, boxSizing: 'border-box', transformOrigin: '50% 100%' });
  // row A: the week strip, seven tiles
  const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const TW = 92, TG = 26, TH = 92;
  const TX0 = (940 - (7 * TW + 6 * TG)) / 2;
  const tiles = DAYS.map((d, i) => {
    const box = el('div', 'abs', board);
    Object.assign(box.style, { width: `${TW}px`, height: `${TH}px`, border: `2px solid ${HAIR}`, borderRadius: '50%', boxSizing: 'border-box' });
    const fill = el('div', 'abs', box);
    Object.assign(fill.style, { left: '-2px', top: '-2px', width: `${TW}px`, height: `${TH}px`, borderRadius: '50%', background: '#fff', transformOrigin: '50% 50%' });
    const txt = el('div', 'abs num', box, d);
    Object.assign(txt.style, { fontSize: '36px', width: `${TW}px`, textAlign: 'center', top: `${TH / 2 - 17}px`, left: '-2px', color: MUT });
    return { box, fill, txt, x: TX0 + i * (TW + TG), lit: i === 0 ? WORDS[23][1] : i === 2 ? WORDS[25][1] : null };
  });
  // row B: two blocks, big numerals
  const RY = TH + 22, RH = 232;
  const blk = (x, w) => { const b_ = el('div', 'abs', board); Object.assign(b_.style, { width: `${w}px`, height: `${RH}px`, borderTop: `3px solid ${INK}`, boxSizing: 'border-box' }); b_.style.transformOrigin = '0 0'; return { b_, x, w }; };
  const B1 = blk(0, 450), B2 = blk(490, 450);
  const mkNum = (parent, text, fs, w) => { const box = maskBox(parent, w, fs * 0.98); const d = el('div', 'abs num', box, text); d.style.fontSize = `${fs}px`; d.style.color = INK; return { box, d, w: d.offsetWidth }; };
  const mkLab = (parent, text) => { const d = el('div', 'abs cap', parent, text); d.style.fontSize = '26px'; d.style.fontWeight = '800'; d.style.color = MUT; return d; };
  const n1 = mkNum(B1.b_, '2×', 172, 450); const l1 = mkLab(B1.b_, 'в неделю');
  const n2 = mkNum(B2.b_, '2 ч', 172, 450); const l2 = mkLab(B2.b_, 'по два часа');
  const dots = Array.from({ length: 7 }, (_, i) => {
    const d = el('div', 'abs', B1.b_);
    Object.assign(d.style, { width: '21px', height: '21px', borderRadius: '50%', border: `2px solid ${HAIR}`, boxSizing: 'border-box' });
    const f = el('div', 'abs', d); Object.assign(f.style, { left: '-2px', top: '-2px', width: '21px', height: '21px', borderRadius: '50%', background: MARK, transformOrigin: '50% 50%' });
    return { d, f, on: i === 0 || i === 3 };
  });
  const DR = 54, DC = 66;
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ticks += `<line x1="${DC + (DR - 7) * Math.sin(a)}" y1="${DC - (DR - 7) * Math.cos(a)}" x2="${DC + DR * Math.sin(a)}" y2="${DC - DR * Math.cos(a)}" stroke="${HAIR}" stroke-width="${i % 3 ? 2 : 4}"/>`; }
  const AR = DR - 12;
  const ax1 = DC + AR * 0.5, ay1 = DC + AR * 0.866, ax2 = DC - AR * 0.5;
  const dialLen = AR * Math.PI / 3;
  const dial = el('div', 'abs', B2.b_, `<svg width="${2 * DC}" height="${2 * DC}" viewBox="0 0 ${2 * DC} ${2 * DC}"><circle cx="${DC}" cy="${DC}" r="${DR + 6}" fill="none" stroke="${HAIR}" stroke-width="2"/>${ticks}<path class="dialArc" d="M${ax1} ${ay1} A${AR} ${AR} 0 0 1 ${ax2} ${ay1}" fill="none" stroke="#ffd84d" stroke-width="10" stroke-linecap="round" stroke-dasharray="${dialLen}" stroke-dashoffset="${dialLen}"/><circle cx="${DC}" cy="${DC}" r="4" fill="#fff"/></svg>`);
  const dialArc = dial.querySelector('.dialArc');

  // ---- front: call to action (top zone) ------------------------------------------------------------------------------------------------------------------
  const cta = el('div', 'abs', front);
  const ctaW = 760, ctaH = 132;
  Object.assign(cta.style, { width: `${ctaW}px`, height: `${ctaH}px`, background: '#ffffff', borderRadius: `${ctaH / 2}px`, overflow: 'hidden', transformOrigin: '50% 50%' });
  const ctaTxt = el('div', 'abs', cta, 'Пишите в директ');
  Object.assign(ctaTxt.style, { font: '800 56px/1 var(--display)', color: DK, letterSpacing: '-0.01em', whiteSpace: 'nowrap', left: '56px', top: `${ctaH / 2 - 29}px` });
  const ctaIcon = el('div', 'abs', cta, '<svg width="64" height="64" viewBox="0 0 24 24"><path d="M3 11.5L21 4l-5 17-4-7-9-2.5z" fill="#0e1222"/></svg>');
  ctaIcon.style.top = `${ctaH / 2 - 32}px`;
  const ctaMark = el('div', 'abs', front);
  Object.assign(ctaMark.style, { width: '420px', height: '8px', background: '#ffd84d', transformOrigin: '0 50%' });

  // ---- the frame function ---------------------------------------------------------------------------------------------------------------------------------
  const render = (t, f) => {
    const k = fileOf(f);
    if (k !== shown) { shown = k; vid.src = `assets/footage/talk/${pad(k)}.jpg`; person.src = `assets/footage/talk-cut/${pad(k)}.webp`; }
    const z = zoomAt(t);
    const o = `${cam.x}px ${cam.y}px`;
    set(vid, { x: 0, y: 0, s: z, origin: o, o: 1 });
    set(grade, { x: 0, y: 0, s: 1, o: 1 });
    set(person, { x: 0, y: 0, s: z, origin: o, o: 1 });
    set(behind, { x: 0, y: 0, s: 1 + (z - 1) * 0.35, origin: o });
    set(front, { x: 0, y: 0, o: 1 });

    // kicker ------------------------------------------------------------------------------------------------------------------------------------------------------
    const kv = t >= CUE.kicker - 0.1 && t < CUE.group + 0.35;
    set(kick, { vis: kv, x: 80, y: 226, o: 1 - appear(t, CUE.group, 0.3) });
    if (kv) {
      set(kLine, { x: 0, y: 24, sx: ease.outExpo(clamp((t - CUE.kicker + 0.06) / 0.4)), o: 1 });
      set(kMark, { x: 140, y: 0, sx: ease.outExpo(clamp((t - WORDS[5][1] + 0.08) / 0.3)), o: 1 });
      set(kTxt, { x: 158, y: 11, o: appear(t, CUE.kicker - 0.04, 0.1) });
    }
    // group name ------------------------------------------------------------------------------------------------------------------------------------------------
    const lv = t >= CUE.group - 0.05 && t < CUE.nameOut + 0.45;
    const lout = ease.inCubic(clamp((t - CUE.nameOut) / 0.4));
    set(lock, { vis: lv, x: 80, y: 268, o: 1 - lout });
    if (lv) {
      const w8 = W_(8), w10 = W_(10), w11 = W_(11);
      set(tag, { x: 0, y: -20, o: appear(t, CUE.group, 0.12) });
      const y1 = 22, y2 = y1 + L1.h * 0.78, y3 = y2 + L2txt.h * 0.82;
      set(L1.box, { x: 0, y: y1, vis: true }); set(L1.d, { x: 0, y: L1.h * 1.05 * rise(t, w8.s - 0.08, 0.5) });
      L2bar.style.width = `${L2txt.w + 36}px`; L2bar.style.height = `${L2txt.h * 0.74}px`;
      set(L2bar, { x: -10, y: y2 + L2txt.h * 0.12, sx: ease.outExpo(clamp((t - w10.s + 0.12) / 0.45)), o: 1 });
      set(L2txt.box, { x: 0, y: y2, vis: true }); set(L2txt.d, { x: 14, y: L2txt.h * 1.1 * rise(t, w10.s - 0.08, 0.5) });
      set(L3.box, { x: 0, y: y3, vis: true }); set(L3.d, { x: 0, y: L3.h * 1.05 * rise(t, w11.s - 0.1, 0.5) });
    }
    // «Жду всех» ----------------------------------------------------------------------------------------------------------------------------------------------------
    const wv = t >= CUE.all - 0.1 && t < CUE.ask + 0.2;
    set(wait, { vis: wv, x: 100, y: 236, o: 1 - appear(t, CUE.ask - 0.1, 0.3) });
    if (wv) {
      set(waitBox.d, { x: 0, y: 230 * rise(t, W_(30).s - 0.1, 0.5) });
      set(waitBar, { x: 6, y: 196, sx: ease.outExpo(clamp((t - W_(31).s + 0.1) / 0.4)), o: 1 });
    }
    // «?» and the two marker words ----------------------------------------------------------------------------------------------------------------------------
    const qv = t >= CUE.ask - 0.1 && t < CUE.cta + 0.25;
    const qp = ease.outExpo(clamp((t - (CUE.ask - 0.05)) / 0.7));
    set(qm, { vis: qv, x: W - qmW - 30, y: 150 + lerp(70, 0, qp), s: lerp(0.92, 1, qp), o: qv ? Math.min(qp, 1 - appear(t, CUE.cta - 0.1, 0.3)) * 0.92 : 0 });
    set(chipQ.box, { vis: qv, x: 84, y: 236, o: 1 - appear(t, CUE.cta - 0.1, 0.3) });
    set(chipI.box, { vis: qv, x: 84, y: 344, o: 1 - appear(t, CUE.cta - 0.1, 0.3) });
    if (qv) {
      set(chipQ.bar, { x: -14, y: 8, sx: ease.outExpo(clamp((t - W_(34).s + 0.12) / 0.35)), o: 1 });
      set(chipQ.d, { x: 6, y: 12 + 120 * rise(t, W_(34).s - 0.08, 0.45), o: 1 });
      set(chipI.bar, { x: -14, y: 8, sx: ease.outExpo(clamp((t - W_(35).s + 0.12) / 0.35)), o: 1 });
      set(chipI.d, { x: 6, y: 12 + 120 * rise(t, W_(35).s - 0.08, 0.45), o: 1 });
    }

    // 17:00 — 19:00 in the top zone, on «пяти» and «семи» ----------------------------------------------------------------------------------------------
    const tv = t >= CUE.time - 0.12 && t < CUE.boardOut + 0.5;
    const to = ease.inCubic(clamp((t - CUE.boardOut) / 0.4));
    set(timeG, { vis: tv, x: 80, y: 236 - 14 * to, o: 1 - to });
    if (tv) {
      const xa = 0, xd = tA.w + tGap, xb = xd + 64 + tGap;
      set(tCap, { x: 0, y: -34, o: appear(t, CUE.time, 0.12) });
      set(tA.box, { x: xa, y: 0 }); set(tA.d, { x: 0, y: tA.h * 1.05 * rise(t, W_(27).s - 0.08, 0.45), o: 1 });
      set(tDash, { x: xd, y: tA.h * 0.5 - 5, sx: ease.outExpo(clamp((t - (W_(28).s - 0.04)) / 0.3)), o: 1 });
      tB.bar.style.width = `${tB.w + 28}px`; tB.bar.style.height = `${tB.h * 0.82}px`;
      set(tB.box, { x: xb, y: 0 });
      set(tB.bar, { x: xb - 14, y: tB.h * 0.1, sx: ease.outExpo(clamp((t - W_(29).s + 0.12) / 0.4)), o: 1 });
      set(tB.d, { x: 0, y: tB.h * 1.05 * rise(t, W_(29).s - 0.08, 0.45), o: 1 });
    }

    // captions ----------------------------------------------------------------------------------------------------------------------------------------------------------
    set(capBase, { x: 90, y: 1330, o: 1 });
    caps.forEach((c, i) => {
      const nextStart = i < caps.length - 1 ? caps[i + 1].t0 : 99;
      const end = Math.min(c.t1, nextStart - 0.02);
      const boardNow = t >= SHOW_BOARD[0] && t < SHOW_BOARD[1];
      const vis = t >= c.t0 && t < end + 0.1 && !boardNow;
      set(c.box, { vis, x: 0, y: lerp(20, 0, ease.outExpo(clamp((t - c.t0) / 0.2))), o: Math.min(appear(t, c.t0, 0.1), 1 - appear(t, end, 0.1)) });
      if (!vis) return;
      // the marker moves word to word
      let kk = 0;
      for (let j = 0; j < c.rects.length; j++) if (t >= WORDS[c.a + j][1] - 0.04) kk = j;
      const prev = c.rects[Math.max(0, kk - 1)], cur = c.rects[kk];
      const p = kk === 0 ? 1 : ease.outCubic(clamp((t - (WORDS[c.a + kk][1] - 0.04)) / 0.12));
      const same = Math.abs(prev.y - cur.y) < 4;
      const r = same ? { x: lerp(prev.x, cur.x, p), y: cur.y, w: lerp(prev.w, cur.w, p), h: cur.h } : cur;
      const started = t >= WORDS[c.a][1] - 0.04;
      set(c.hl, { x: r.x - 10, y: r.y + 12, o: started ? 1 : 0 });
      c.hl.style.width = `${r.w + 20}px`; c.hl.style.height = `${r.h - 20}px`;
      c.hl.style.zIndex = '0';
    });

    // schedule board ---------------------------------------------------------------------------------------------------------------------------------------------------
    const bv = t >= CUE.board - 0.12 && t < CUE.boardOut + 0.5;
    const bo = ease.inCubic(clamp((t - CUE.boardOut) / 0.4));
    set(board, { vis: bv, x: BX, y: BY + 30 * bo, o: 1 - bo });
    if (bv) {
      set(sheet, { x: 0, y: 0, sy: ease.outExpo(clamp((t - (CUE.board - 0.2)) / 0.4)), o: 1 });
      // blocks (row B)
      const rb = ease.outExpo(clamp((t - (W_(15).s - 0.1)) / 0.45));
      set(B1.b_, { x: B1.x, y: RY, sx: ease.outExpo(clamp((t - (W_(15).s - 0.12)) / 0.4)), o: t < W_(15).s - 0.12 ? 0 : 1 });
      set(n1.d, { x: 0, y: 180 * rise(t, W_(15).s - 0.06, 0.45) + 10, o: 1 });
      set(n1.box, { x: 0, y: 0 }); n1.box.style.top = '0px';
      set(l1, { x: 4, y: RH - 44, o: appear(t, W_(18).s - 0.08, 0.15) });
      set(B2.b_, { x: B2.x, y: RY, sx: ease.outExpo(clamp((t - (CUE.hours - 0.12)) / 0.4)), o: t < CUE.hours - 0.12 ? 0 : 1 });
      set(n2.d, { x: 0, y: 180 * rise(t, CUE.hours - 0.04, 0.45) + 10, o: 1 });
      set(l2, { x: 4, y: RH - 44, o: appear(t, W_(21).s - 0.08, 0.15) });
      dots.forEach((q, i) => {
        const ap = ease.outExpo(clamp((t - (W_(15).s + 0.25 + i * 0.03)) / 0.3));
        set(q.d, { x: 272 + i * 26, y: 80, s: lerp(0.4, 1, ap), o: ap });
        const fp = q.on ? ease.outBackSoft(clamp((t - (W_(16).s + (i ? 0.12 : 0))) / 0.3)) : 0;
        set(q.f, { x: 0, y: 0, s: fp, o: fp > 0 ? 1 : 0 });
      });
      const dp = ease.outExpo(clamp((t - (CUE.hours + 0.05)) / 0.4));
      set(dial, { x: 322, y: 42, s: lerp(0.6, 1, dp), o: dp });
      dialArc.setAttribute('stroke-dashoffset', String(dialLen * (1 - ease.inOutCubic(clamp((t - (CUE.hours + 0.1)) / (W_(21).e - CUE.hours))))));
      // week strip (row A)
      tiles.forEach((q, i) => {
        const t0 = CUE.days - 0.05 + i * 0.045;
        const ap = ease.outExpo(clamp((t - t0) / 0.35));
        set(q.box, { x: q.x, y: lerp(26, 0, ap), s: lerp(0.7, 1, ap), o: ap });
        const lp = q.lit == null ? 0 : ease.outExpo(clamp((t - (q.lit - 0.1)) / 0.28));
        set(q.fill, { x: 0, y: 0, s: lp, o: lp > 0 ? 1 : 0 });
        q.txt.style.color = lp > 0.5 ? DK : MUT;
        set(q.txt, { x: 0, y: TH / 2 - 24 - TH / 2 + TH / 2, o: 1 });
      });
    }

    // call to action ------------------------------------------------------------------------------------------------------------------------------------------------------
    const cv = t >= CUE.cta - 0.12;
    const cp = ease.outExpo(clamp((t - (CUE.cta - 0.1)) / 0.55));
    set(cta, { vis: cv, x: (W - ctaW) / 2, y: 232 + lerp(60, 0, cp), s: lerp(0.94, 1, cp) * (1 + 0.012 * Math.sin((t - CUE.cta) * 3) * (t > CUE.cta + 1 ? 1 : 0)), o: cp });
    ctaTxt.style.opacity = '1';
    set(ctaIcon, { x: ctaW - 64 - 52 + 10 * Math.sin((t - CUE.cta) * 4), y: 0, o: 1 });
    ctaIcon.style.top = `${ctaH / 2 - 32}px`;
    set(ctaMark, { vis: cv, x: (W - 420) / 2, y: 232 + ctaH + 18, sx: ease.outExpo(clamp((t - CUE.cta - 0.25) / 0.5)), o: cp });
  };
  render.prepare = async (t, f) => { await show(fileOf(f)); };
  return render;
}
