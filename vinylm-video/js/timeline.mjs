// ONE timeline for picture and sound (js/scenes/*.js and audio/score.mjs both import it). 116 BPM: 1 beat = 0.517 s.
export const W = 1080; // @param width
export const H = 1920; // @param height
export const FPS = 60; // @param fps
export const BPM = 116; // @param bpm
export const BEAT = 60 / BPM;
export const BAR = 4 * BEAT;
/** Beats → seconds. */
export const b = (n) => n * BEAT;

/** 48 beats = 12 bars = 24.83 s. */
export const DURATION = b(48);

/** Four equipment panels of four beats each. */
export const SVC_AT = [12, 16, 20, 24].map(b);

export const S = {
  hook: [0, b(6.4)],
  brand: [b(5.6), b(12.4)],
  svc: [b(11.6), b(28.4)],
  names: [b(27.6), b(32.4)],
  proof: [b(31.6), b(38.4)],
  lockup: [b(37.6), DURATION],
};

/** All scenes hit hard: the groove runs from the first bar. */
export const ENERGY = { hook: 'high', brand: 'high', svc: 'high', names: 'high', proof: 'high', lockup: 'high' };

export const CUE = {
  w1: b(1), // ZVUK
  w2: b(2), // SVETLO
  w3: b(3), // EKRANI
  disc: b(4), // the ink wipe and the spinning record
  bolt: b(5), // the lightning strikes
  exit: b(5.3),
  drop: b(6), // the logo slams
  sub: b(7.3),
  chips: b(9),
  brandExit: b(11.3),
  names: b(28),
  stat1: b(32),
  stat2: b(33.4),
  stat3: b(34.8),
  stat4: b(36.2),
  hole: b(37.5),
  logo: b(38),
  tagline: b(39),
  cta: b(40),
  c1: b(41),
  c2: b(42),
  c3: b(43),
  final: b(44),
};

export const WHIPS = [
  [b(0.9), b(1.4)], [b(1.9), b(2.4)], [b(2.9), b(3.4)], [b(5.2), b(6.4)],
  [b(11.2), b(12.4)], [b(15.8), b(16.3)], [b(19.8), b(20.3)], [b(23.8), b(24.3)], [b(27.6), b(28.4)],
  [b(31.6), b(32.2)], [b(37.4), b(38.5)], [b(43.9), b(44.4)],
];

export const COVERS = [b(3.6), b(7), b(14), b(40.6)];
export const LOOP = false;
