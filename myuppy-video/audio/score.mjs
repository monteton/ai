// MYUPPY promo score.
//
// Sound brief: electro-breaks, 124 BPM, D minor. Broken kick pattern (not four-on-the-floor), gated snare on 2 and 4,
// metallic 16th hats, a reese bass that growls under every chord root, brass-like stabs off the beat. The groove runs
// from the first bar (the person asked for dynamic). Each service has its own sound: film-gate flutter (video), a rising
// sine sweep (sound), a chain of pops (marketing), keyboard clatter (software), glass bells (brand); the product screen
// changes on camera shutters. Sonic logo: three glass bells, D6 – A5 – F5, on the logo slam and again on the lockup.
// A beat of silence before the lockup, a last hit on beat 49 that rings out under the end card.
//   node audio/score.mjs [out/music.wav] [--report]
import * as A from './synth/index.mjs';
import { BPM, DURATION, CUE, S, SVC_AT, b } from '../js/timeline.mjs';
import { COPY, DEFAULT_LANG } from '../js/copy.mjs';

const args = process.argv.slice(2);
const lang = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : DEFAULT_LANG;
const TX = COPY[lang] || COPY[DEFAULT_LANG];
const out = args.find((a, i) => a.endsWith('.wav') && args[i - 1] !== '--lang') || (lang === DEFAULT_LANG ? 'out/music.wav' : `out/music-${lang}.wav`);

A.init({ duration: DURATION, bpm: BPM, seed: 24 });
A.bus('drums', { gain: -2 });
A.bus('bass', { gain: -1, duck: 0.5 });
A.bus('music', { gain: 1, duck: 0.4, verb: 0.2 });
A.bus('lead', { gain: -4, verb: 0.2, delay: 0.25 });
A.bus('fx', { gain: -5, verb: 0.15 });

// ---- harmony: one table drives bass, stabs, pad and arp ---------------------------------------------------------------
const CH = ['Dm9', 'Bbmaj7', 'Gm9', 'A7sus4'];
const table = [];
for (let k = 0; k < 13; k++) table.push([k * 4, CH[k % 4]]);
table[12] = [48, 'Dm9'];
const H = A.harmony(table, { oct: 4 });

// ---- the groove -----------------------------------------------------------------------------------------------------------
const groove = (b0, b1, { full = true, bass = true } = {}) => {
  const t0 = b(b0); const t1 = b(b1);
  for (const h of A.steps('X..x..x...X...x.', { from: t0, to: t1 })) A.kick(h.t, { type: 'hard', vel: h.vel });
  for (const h of A.steps('....X..o....X..o', { from: t0, to: t1 })) A.snare(h.t, { type: 'gated', vel: h.vel * 0.9 });
  for (const h of A.steps('....x.......x...', { from: t0, to: t1 })) A.clap(h.t, { vel: 0.5 });
  for (const h of A.steps('xoxoxoxoxoxoxoxo', { from: t0, to: t1, swing: 0.06 })) A.hat(h.t, { metal: 0.8, vel: 0.2 * h.vel + 0.06, pan: 0.25 });
  for (const h of A.steps('..o...o...o...oo', { from: t0, to: t1 })) A.hat(h.t, { open: true, decay: 0.1, vel: 0.28, pan: -0.2 });
  if (bass) {
    // a reese growl on each chord root, a clean sub under it, a short octave hop on the "and" of 4
    for (let k = Math.ceil(b0 / 2) * 2; k < b1; k += 2) {
      const root = H.at(k).root;
      A.reese(b(k), b(1.8), root - 12, { detune: 0.22, cut: 520, wobble: 2, subLevel: 0.5, vel: 0.8 });
    }
    for (const h of A.steps('...............X', { from: t0, to: t1 })) A.houseBass(h.t, b(0.2), H.at(h.t / b(1)).root, { vel: 0.7, bright: 0.8 });
  }
  for (const h of A.steps('..x....x..x....x', { from: t0, to: t1 })) A.stab(h.t, H.at(h.t / b(1)), { vel: 0.42, dur: 0.12 });
  if (full) {
    for (const [a, z, ch] of H.spans(b0, b1)) A.arp(b(a), b(z), ch.map((m) => m + 12), { rate: 1 / 4, pattern: 'updown', bus: 'lead', vel: 0.45, gate: 0.55 });
  }
};

// ---- hook (0–8): the groove from bar 1, a hit per word ----------------------------------------------------------------------
A.pad(0, b(8), A.voiceLead([H.at(0)])[0], { type: 'dark', attack: 0.6, vel: 0.7 });
A.automate('music', 'lp', [[0, 900], [b(4), 2200], [b(7.8), 6000], [b(8), 12000]]);
groove(0.5, 8, { full: false, bass: true });
A.tick(CUE.line, { bright: 6000, vel: 0.6 });
A.toneSweep(CUE.line, 0.45, { from: 'D5', to: 'D6', wave: 'sine', env: 'swell', vel: 0.22, verb: 0.3 });
[CUE.w1, CUE.w2, CUE.w3, CUE.w4].forEach((t, i) => {
  A.whoosh(t - 0.26, 0.26, { shape: 'in', f0: 400, f1: 5000, pan: [i % 2 ? 0.5 : -0.5, 0], vel: 0.35 });
  A.impact(t, { vel: 0.55 + i * 0.1, sub: i < 2 ? 'D1' : 'F1', air: 0.7 });
});
A.whoosh(CUE.w3 - 0.02, 0.3, { shape: 'swell', f0: 800, f1: 9000, pan: [-0.9, 0.9], vel: 0.4 }); // the laser
A.riser(b(4.5), CUE.exit, { vel: 0.5 });
A.whoosh(CUE.exit - 0.05, CUE.drop - CUE.exit + 0.1, { pan: [0.8, -0.8], f0: 250, f1: 6000, vel: 0.8 });
A.reverseCymbal(CUE.drop, b(1.2), { vel: 0.5 });

// ---- the drop (8–14): the mark slams in front of the wordmark ----------------------------------------------------------------
A.impact(CUE.drop, { vel: 1, sub: 'D1', air: 1.1 });
A.boom(CUE.drop, { from: 90, to: 34, vel: 0.65 });
A.crash(CUE.drop, { vel: 0.6, dur: 2 });
['A5', 'F5', 'D5'].forEach((m, i) => A.bell(CUE.drop + i * b(0.5), m, { ratio: 3.01, index: 2.2, idec: 5, dur: 1.8, vel: 0.4, bus: 'lead', verb: 0.4 }));
groove(8, 14, { full: true });
for (let k = 0; k < 14; k++) A.tick(CUE.sub + k * 0.04, { bright: 4500 + (k % 4) * 700, vel: 0.3, pan: -0.4 + k * 0.06 });
[CUE.chips, CUE.chips + b(0.5), CUE.chips + b(1)].forEach((t, i) => A.pop(t, ['D6', 'F6', 'A6'][i], { vel: 0.5, pan: -0.5 + i * 0.5 }));
A.whoosh(CUE.brandExit - 0.05, 0.6, { pan: [0, 0], f0: 300, f1: 7000, vel: 0.7, shape: 'out' });

// ---- services (14–29): one groove, five signatures ----------------------------------------------------------------------------
groove(14, 29, { full: true });
SVC_AT.forEach((T, i) => {
  A.whoosh(T - 0.18, 0.3, { shape: 'in', pan: [i % 2 ? -0.9 : 0.9, 0], f0: 500, f1: 6000, vel: 0.5 });
  A.impact(T, { vel: 0.75, sub: ['D1', 'D1', 'G1', 'F1', 'D1'][i], air: 0.6 });
  A.crash(T, { vel: 0.3, dur: 1 });
});
// video: the film gate flutters
for (let k = 0; k < 12; k++) A.tick(SVC_AT[0] + 0.1 + k * 0.034, { bright: 7200, vel: 0.28, pan: k % 2 ? 0.5 : -0.5 });
// sound: a sine sweep rises through the waveform
A.toneSweep(SVC_AT[1] + 0.05, 0.9, { from: 'D4', to: 'D6', wave: 'sine', env: 'swell', vel: 0.28, verb: 0.35 });
// marketing: a chain of pops climbing like a chart
['D5', 'F5', 'A5', 'C6', 'D6'].forEach((m, i) => A.pop(SVC_AT[2] + 0.18 + i * 0.13, m, { vel: 0.42, pan: -0.5 + i * 0.25 }));
// software: keyboard clatter
for (let k = 0; k < 9; k++) A.key(SVC_AT[3] + 0.12 + k * 0.065 + (k % 3) * 0.012, { vel: 0.45, pan: -0.3 + (k % 4) * 0.2 });
A.blip(SVC_AT[3] + 0.78, 'A6', { dur: 0.1, vel: 0.35 });
// brand: glass bells and a sparkle
['F6', 'A6'].forEach((m, i) => A.bell(SVC_AT[4] + 0.05 + i * 0.12, m, { ratio: 3.01, index: 2, idec: 4, dur: 1.4, vel: 0.35, bus: 'lead', verb: 0.45 }));
A.sparkle(SVC_AT[4] + 0.2, { vel: 0.6 });
A.whoosh(b(28.6), 0.5, { shape: 'in', pan: [0.9, 0], f0: 300, f1: 7000, vel: 0.65 });

// ---- Polako RAW (29–37): the window flies in, camera shutters on the screen changes -------------------------------------------
A.impact(CUE.polako, { vel: 0.95, sub: 'D1', air: 0.9 });
A.crash(CUE.polako, { vel: 0.5, dur: 1.6 });
groove(29, 37, { full: true });
[CUE.chip1, CUE.chip2, CUE.chip3, CUE.chip4].forEach((t, i) => A.pop(t, ['D6', 'F6', 'A5', 'C6'][i], { vel: 0.5, pan: i % 2 ? 0.4 : -0.4 }));
A.shutter(CUE.chip2 - 0.02, { vel: 0.7 });
A.shutter(CUE.chip4 - 0.02, { vel: 0.7 });
A.glitch(CUE.chip2 - 0.04, 0.12, { vel: 0.35 });
A.glitch(CUE.chip4 - 0.04, 0.12, { vel: 0.35 });
A.riser(b(34.5), CUE.polakoExit + 0.5, { vel: 0.5, curve: 2.2 });
A.whoosh(CUE.polakoExit, 0.7, { shape: 'in', pan: [0, 0], f0: 200, f1: 8000, vel: 0.7 });
A.reverseCymbal(CUE.stat1, b(1.2), { vel: 0.55 });

// ---- proof (37–43): a number per beat and a half, digits ticking ----------------------------------------------------------------
groove(37, 42.5, { full: true });
[CUE.stat1, CUE.stat2, CUE.stat3, CUE.stat4].forEach((t, i) => {
  A.impact(t, { vel: 0.8 + i * 0.05, sub: ['D1', 'F1', 'G1', 'A1'][i], air: 0.7 });
  A.crash(t, { vel: 0.25, dur: 0.9 });
  const n = 14; // kit.roll eases out-cubic over 0.45 s after +0.04
  for (let k = 1; k <= n; k++) A.tick(t + 0.04 + 0.45 * (1 - Math.cbrt(1 - k / n)), { bright: 5000 + k * 140, vel: 0.28, pan: -0.5 + i * 0.33 });
  A.pop(t + 0.5, ['A5', 'C6', 'D6', 'F6'][i], { vel: 0.35, pan: -0.5 + i * 0.33 });
});
A.roll(b(41.5), CUE.hole, (t, v) => A.snare(t, { type: 'tight', vel: v * 0.5 }), { from: 1 / 4, to: 1 / 16 });

// ---- the hole and the lockup ---------------------------------------------------------------------------------------------------------
A.gap(CUE.hole, CUE.logo - 0.01);
A.riser(b(41), CUE.logo - 0.02, { vel: 0.55, curve: 2.6 });
A.whoosh(CUE.logo - 0.42, 0.44, { shape: 'in', pan: [0, 0], f0: 300, f1: 7000, vel: 0.7 });
A.reverseCymbal(CUE.logo, b(1.5), { vel: 0.6 });
A.impact(CUE.logo, { vel: 1, sub: 'D1', air: 1.2 });
A.boom(CUE.logo, { from: 90, to: 32, vel: 0.75 });
A.crash(CUE.logo, { vel: 0.6, dur: 2.6 });
// the sonic logo again, the same three bells
['D6', 'A5', 'F5'].forEach((m, i) => A.bell(CUE.logo + i * b(0.5), m, { ratio: 3.01, index: 2.2, idec: 5, dur: 2.2, vel: 0.5, bus: 'lead', verb: 0.4 }));
groove(43, 49, { full: true });
A.sparkle(CUE.tagline, { vel: 0.8 });
A.swish(CUE.cta - 0.1, { pan: [-0.8, 0.2], vel: 0.6 });
A.impact(CUE.cta, { vel: 0.6, sub: 'D1' });
A.impact(CUE.cta + b(0.5), { vel: 0.7, sub: 'F1' });
[CUE.c1, CUE.c2, CUE.c3].forEach((t, i) => A.pop(t, ['D5', 'F5', 'A5'][i], { vel: 0.5, pan: -0.4 + i * 0.4 }));

// ---- the last hit --------------------------------------------------------------------------------------------------------------------
A.gap(CUE.final - b(0.5), CUE.final - 0.01, { buses: ['drums', 'bass'] });
A.kick(CUE.final, { type: 'hard', vel: 1 });
A.impact(CUE.final, { vel: 0.9, sub: 'D1' });
A.crash(CUE.final, { vel: 0.55, dur: 2.4 });
A.bass808(CUE.final, 2.2, 'D1', { drive: 2.8, vel: 0.8 });
A.pad(CUE.final, 2.2, A.voiceLead([H.at(48)])[0], { type: 'air', attack: 0.02, release: 2, vel: 0.9 });
A.bell(CUE.final + 0.02, 'D6', { ratio: 3.01, index: 2, dur: 2.8, vel: 0.45, bus: 'lead' });

A.render(out, { lufs: -14, fadeOut: 0.9, reverb: 'plate', delay: { beats: 0.75, feedback: 0.35 }, sections: S });
