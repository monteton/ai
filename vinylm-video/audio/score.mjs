// VinylM promo score.
//
// Sound brief: nu-disco funk, 116 BPM, G dorian. A live-drum feel, not four-on-the-floor: a syncopated kick, claps on 2 and 4 with rim ghosts,
// 16th shakers, a plucky funk bass with octave hops, clav and brass stabs off the beat. The groove runs from bar 1. Brand-world sounds
// are the record itself: surface crackle under the hook, a needle drop and a pitch-down on the record at beat 4, a lightning zap on the
// bolt, scratches on the DJ panel, and a real tape-stop before the lockup (the record stops, then the logo slams). Each panel has its own
// signature: a sub drop (ZVUK), laser zaps (SVETLO), digital blips (EKRANI), a scratch (DJ). Sonic logo: three chimes, G5 – Bb5 – D6.
//   node audio/score.mjs [out/music.wav] [--report]
import * as A from './synth/index.mjs';
import { BPM, DURATION, CUE, S, SVC_AT, b } from '../js/timeline.mjs';
import { COPY, DEFAULT_LANG } from '../js/copy.mjs';

const args = process.argv.slice(2);
const lang = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : DEFAULT_LANG;
const TX = COPY[lang] || COPY[DEFAULT_LANG];
const out = args.find((a, i) => a.endsWith('.wav') && args[i - 1] !== '--lang') || (lang === DEFAULT_LANG ? 'out/music.wav' : `out/music-${lang}.wav`);

A.init({ duration: DURATION, bpm: BPM, seed: 116 });
A.bus('drums', { gain: -2 });
A.bus('bass', { gain: -1, duck: 0.45 });
A.bus('music', { gain: 1, duck: 0.35, verb: 0.2 });
A.bus('lead', { gain: -4, verb: 0.2, delay: 0.25 });
A.bus('fx', { gain: -5, verb: 0.15 });

// ---- harmony: one table drives bass, stabs and arp ------------------------------------------------------------------------------
const CH = ['Gm9', 'C9', 'Bbmaj7', 'Dm9'];
const table = [];
for (let k = 0; k < 12; k++) table.push([k * 4, CH[k % 4]]);
table[11] = [44, 'Gm9'];
const H = A.harmony(table, { oct: 4 });

// ---- the groove ---------------------------------------------------------------------------------------------------------------------
const groove = (b0, b1, { full = true, bass = true } = {}) => {
  const t0 = b(b0); const t1 = b(b1);
  for (const h of A.steps('X..x..x.X...x...', { from: t0, to: t1 })) A.kick(h.t, { type: 'tight', vel: h.vel });
  for (const h of A.steps('....X.......X..o', { from: t0, to: t1 })) A.clap(h.t, { vel: h.vel * 0.75 });
  for (const h of A.steps('..o...o.o...o...', { from: t0, to: t1 })) A.rim(h.t, {});
  for (const h of A.steps('xoxoxoxoxoxoxoxo', { from: t0, to: t1, swing: 0.1 })) A.shaker(h.t, { tone: 1.1 });
  for (const h of A.steps('..o...o...o...o.', { from: t0, to: t1 })) A.hat(h.t, { open: true, decay: 0.11, vel: 0.3, pan: -0.2 });
  if (bass) {
    // a funk line: root on the one, a 16th pickup, an octave hop and a fifth, locked to the kick
    for (const h of A.steps('X..x..x.X..xx.x.', { from: t0, to: t1 })) {
      const beat = h.t / b(1);
      const root = H.at(beat).root;
      const up = h.i % 16 === 6 || h.i % 16 === 14 ? 12 : h.i % 16 === 11 ? 7 : 0;
      A.houseBass(h.t, b(0.22), root - 12 + up, { vel: 0.85 * h.vel, bright: 0.85 });
    }
  }
  for (const h of A.steps('..x....x..x....x', { from: t0, to: t1 })) A.keys(h.t, 0.12, H.at(h.t / b(1)), { type: 'clav', vel: 0.55 });
  if (full) {
    for (const [a, z, ch] of H.spans(b0, b1)) A.arp(b(a), b(z), ch.map((m) => m + 12), { rate: 1 / 4, pattern: 'updown', bus: 'lead', vel: 0.4, gate: 0.5 });
    for (const h of A.steps('......X.......x.', { from: t0, to: t1 })) A.stab(h.t, H.at(h.t / b(1)), { vel: 0.35, dur: 0.12 });
  }
};

// ---- hook (0–6): crackle, three stabs, the record pitches down, the bolt strikes -----------------------------------------------------
for (let k = 0; k < 90; k++) A.click(A.between(0.02, CUE.drop), { vel: 0.05 + 0.1 * A.rand() });
A.noiseHit(0, CUE.disc, { hp: 4000, attack: 0.3, decay: CUE.disc, pink: true, vel: 0.06 });
A.pad(0, b(6), A.voiceLead([H.at(0)])[0], { type: 'warm', attack: 0.5, vel: 0.5 });
A.automate('music', 'lp', [[0, 700], [b(3), 1600], [b(5.8), 7000], [b(6), 12000]]);
groove(0.5, 4, { full: false, bass: true });
[CUE.w1, CUE.w2, CUE.w3].forEach((t, i) => {
  A.whoosh(t - 0.22, 0.22, { shape: 'in', f0: 400, f1: 4500, pan: [i % 2 ? 0.5 : -0.5, 0], vel: 0.3 });
  A.impact(t, { vel: 0.6 + i * 0.1, sub: ['G1', 'C2', 'D2'][i], air: 0.6 });
  A.brass(t, 0.28, H.at([0, 4, 8][i]), { cut: 3000 });
});
A.noiseHit(CUE.disc - 0.04, 0.2, { lp: 1800, attack: 0.01, decay: 0.15, vel: 0.4 }); // the wipe
A.toneSweep(CUE.disc, 0.9, { wave: 'saw', from: 'G4', to: 'G2', cut: 2200, env: 'decay', vel: 0.3 }); // the record slows
A.thud(CUE.disc + 0.05, { f0: 90, vel: 0.6 }); // needle drop
A.click(CUE.disc + 0.1, { vel: 0.5 });
A.zap(CUE.bolt - 0.02, { vel: 0.9 });
A.impact(CUE.bolt, { vel: 0.95, sub: 'G1', air: 1 });
A.crash(CUE.bolt, { vel: 0.5, dur: 1.2 });
A.riser(CUE.disc + 0.5, CUE.exit, { vel: 0.45 });
A.whoosh(CUE.exit - 0.05, CUE.drop - CUE.exit + 0.1, { pan: [0.8, -0.8], f0: 250, f1: 6000, vel: 0.8 });
A.reverseCymbal(CUE.drop, b(1), { vel: 0.5 });

// ---- the drop (6–12): the logo slams on the giant M -----------------------------------------------------------------------------------------
A.impact(CUE.drop, { vel: 1, sub: 'G1', air: 1.1 });
A.boom(CUE.drop, { from: 90, to: 34, vel: 0.65 });
A.crash(CUE.drop, { vel: 0.6, dur: 2 });
['G5', 'Bb5', 'D6'].forEach((m, i) => A.bell(CUE.drop + i * b(0.5), m, { ratio: 2, index: 1.6, idec: 5, dur: 1.8, vel: 0.45, bus: 'lead', verb: 0.4 }));
groove(6, 12, { full: true });
A.sparkle(CUE.sub, { vel: 0.5 });
[CUE.chips, CUE.chips + b(0.5), CUE.chips + b(1)].forEach((t, i) => A.pop(t, ['G6', 'Bb6', 'D7'][i], { vel: 0.45, pan: -0.5 + i * 0.5 }));
A.whoosh(CUE.brandExit - 0.05, 0.6, { pan: [0, 0], f0: 300, f1: 7000, vel: 0.7, shape: 'out' });

// ---- equipment (12–28): one groove, four signatures --------------------------------------------------------------------------------------------
groove(12, 28, { full: true });
SVC_AT.forEach((T, i) => {
  A.whoosh(T - 0.18, 0.3, { shape: 'in', pan: [i % 2 ? -0.9 : 0.9, 0], f0: 500, f1: 6000, vel: 0.5 });
  A.impact(T, { vel: 0.8, sub: ['G1', 'C2', 'Bb1', 'D2'][i], air: 0.6 });
  A.crash(T, { vel: 0.3, dur: 1 });
});
// ZVUK: a sub drop under the speaker stack
A.boom(SVC_AT[0] + 0.05, { from: 110, to: 38, vel: 0.7 });
for (let k = 0; k < 6; k++) A.thud(SVC_AT[0] + 0.1 + k * b(0.5), { f0: 70, vel: 0.35 });
// SVETLO: four laser zaps, one per fixture
for (let k = 0; k < 4; k++) A.zap(SVC_AT[1] + 0.12 + k * b(0.5), { vel: 0.55 });
A.sparkle(SVC_AT[1] + 0.2, { vel: 0.4 });
// EKRANI: digital blips climbing in a pentatonic
['G5', 'Bb5', 'C6', 'D6', 'F6', 'G6', 'Bb6', 'D7'].forEach((m, k) => A.blip(SVC_AT[2] + 0.12 + k * b(0.25), m, { dur: 0.09, vel: 0.4, pan: -0.6 + k * 0.17 }));
// DJ: a scratch and a hi-hat roll into the next beat
A.toneSweep(SVC_AT[3] + 0.1, 0.18, { wave: 'saw', from: 'G3', to: 'G5', cut: 2600, env: 'decay', vel: 0.35 });
A.toneSweep(SVC_AT[3] + 0.3, 0.18, { wave: 'saw', from: 'G5', to: 'D3', cut: 2600, env: 'decay', vel: 0.35 });
A.noiseHit(SVC_AT[3] + 0.1, 0.4, { bp: 2200, q: 2, attack: 0.01, decay: 0.3, vel: 0.2 });
A.roll(b(27), b(28), (t, v) => A.hat(t, { vel: v * 0.4 }), { from: 1 / 4, to: 1 / 8 });

// ---- events (28–32): four festivals, one per beat ----------------------------------------------------------------------------------------------
for (let i = 0; i < 4; i++) {
  const t = CUE.names + b(i);
  A.impact(t, { vel: 0.75, sub: ['G1', 'C2', 'Bb1', 'D2'][i], air: 0.6 });
  A.brass(t, 0.3, H.at(28 + i), { cut: 3200 });
  A.whoosh(t - 0.15, 0.25, { shape: 'in', pan: [i % 2 ? 0.8 : -0.8, 0], f0: 600, f1: 5000, vel: 0.4 });
}
A.noiseHit(CUE.names, b(4), { bp: 1800, q: 0.7, attack: b(3.5), decay: 0.3, pink: true, vel: 0.12 }); // a crowd swell
groove(28, 32, { full: true });

// ---- proof (32–38): a number per 1.4 beats, digits ticking -----------------------------------------------------------------------------------------
groove(32, 36.8, { full: true });
[CUE.stat1, CUE.stat2, CUE.stat3, CUE.stat4].forEach((t, i) => {
  A.impact(t, { vel: 0.8 + i * 0.05, sub: ['G1', 'C2', 'Bb1', 'D2'][i], air: 0.7 });
  A.crash(t, { vel: 0.25, dur: 0.9 });
  const n = 14; // kit.roll eases out-cubic over 0.45 s after +0.04
  for (let k = 1; k <= n; k++) A.tick(t + 0.04 + 0.45 * (1 - Math.cbrt(1 - k / n)), { bright: 5000 + k * 140, vel: 0.28, pan: -0.5 + i * 0.33 });
  A.pop(t + 0.5, ['G5', 'Bb5', 'D6', 'G6'][i], { vel: 0.35, pan: -0.5 + i * 0.33 });
});
A.roll(b(36), CUE.hole, (t, v) => A.snare(t, { type: 'tight', vel: v * 0.5 }), { from: 1 / 4, to: 1 / 16 });

// ---- the record stops, then the lockup ---------------------------------------------------------------------------------------------------------------
A.tapeStop(CUE.hole - 0.1, 0.55, { until: CUE.logo - 0.01 });
A.riser(b(36.6), CUE.logo - 0.02, { vel: 0.45, curve: 2.6 });
A.whoosh(CUE.logo - 0.42, 0.44, { shape: 'in', pan: [0, 0], f0: 300, f1: 7000, vel: 0.7 });
A.reverseCymbal(CUE.logo, b(1.5), { vel: 0.6 });
A.impact(CUE.logo, { vel: 1, sub: 'G1', air: 1.2 });
A.boom(CUE.logo, { from: 90, to: 32, vel: 0.75 });
A.crash(CUE.logo, { vel: 0.6, dur: 2.6 });
['G5', 'Bb5', 'D6'].forEach((m, i) => A.bell(CUE.logo + i * b(0.5), m, { ratio: 2, index: 1.6, idec: 5, dur: 2.2, vel: 0.5, bus: 'lead', verb: 0.4 }));
groove(38, 44, { full: true });
A.sparkle(CUE.tagline, { vel: 0.8 });
A.swish(CUE.cta - 0.1, { pan: [-0.8, 0.2], vel: 0.6 });
A.impact(CUE.cta, { vel: 0.6, sub: 'G1' });
A.impact(CUE.cta + b(0.5), { vel: 0.7, sub: 'C2' });
A.pop(CUE.cta + b(1), 'D6', { vel: 0.5 });
[CUE.c1, CUE.c2, CUE.c3].forEach((t, i) => A.pop(t, ['G5', 'Bb5', 'D6'][i], { vel: 0.5, pan: -0.4 + i * 0.4 }));

// ---- the last hit -----------------------------------------------------------------------------------------------------------------------------------------
A.gap(CUE.final - b(0.5), CUE.final - 0.01, { buses: ['drums', 'bass'] });
A.kick(CUE.final, { type: 'tight', vel: 1 });
A.impact(CUE.final, { vel: 0.9, sub: 'G1' });
A.crash(CUE.final, { vel: 0.55, dur: 2.4 });
A.bass808(CUE.final, 2.2, 'G1', { drive: 2.8, vel: 0.8 });
A.pad(CUE.final, 2.2, A.voiceLead([H.at(44)])[0], { type: 'air', attack: 0.02, release: 2, vel: 0.9 });
A.bell(CUE.final + 0.02, 'G6', { ratio: 2, index: 1.6, dur: 2.8, vel: 0.45, bus: 'lead' });

A.render(out, { lufs: -14, fadeOut: 0.9, reverb: 'plate', delay: { beats: 0.75, feedback: 0.35 }, sections: S });
