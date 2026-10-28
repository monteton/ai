// ONE timeline for picture and sound. Scenes (js/scenes/*.js) and the score (audio/score.mjs) both import this file,
// so every slam, whoosh and cut lands on the same sample. Plan the story in beats; b(n) turns beats into seconds.
export const W = 1080; // @param width
export const H = 1920; // @param height
export const FPS = 60; // @param fps
export const BPM = 124; // @param bpm
export const BEAT = 60 / BPM;
export const BAR = 4 * BEAT;
/** Beats → seconds. */
export const b = (n) => n * BEAT;

/** 52 beats = 13 bars = 25.16 s. The lockup lands on beat 43 and holds 9 beats. */
export const DURATION = b(52);

/** Services: five panels of three beats each, between the brand drop and Polako RAW. */
export const SVC_AT = [14, 17, 20, 23, 26].map(b);

/** Scene windows [start, end] in seconds. Neighbours overlap by a beat or less: that is where transitions live. */
export const S = {
  hook: [0, b(8.4)],
  brand: [b(7.6), b(14.5)],
  svc: [b(13.7), b(29.5)],
  polako: [b(28.7), b(37.5)],
  proof: [b(36.7), b(43.4)],
  lockup: [b(42.6), DURATION],
};

/** All scenes hit hard: the person asked for dynamic, so the groove runs from the first bar. */
export const ENERGY = { hook: 'high', brand: 'high', svc: 'high', polako: 'high', proof: 'high', lockup: 'high' };

/** Named moments shared by the picture and the score (seconds). */
export const CUE = {
  line: b(0.25),
  w1: b(1), // СМЕЛЫЕ
  w2: b(2), // ИДЕИ
  w3: b(4), // В ЦИФРОВУЮ
  w4: b(5), // ФОРМУ
  exit: b(7.3),
  drop: b(8), // the logo slams in front of the giant wordmark
  sub: b(9.5),
  chips: b(11),
  brandExit: b(13.3),
  polako: b(29), // the window flies in
  chip1: b(31),
  chip2: b(32),
  chip3: b(33),
  chip4: b(34),
  polakoExit: b(36.3),
  stat1: b(37),
  stat2: b(38.5),
  stat3: b(40),
  stat4: b(41.5),
  hole: b(42.5),
  logo: b(43),
  tagline: b(44),
  cta: b(45),
  c1: b(46),
  c2: b(47),
  c3: b(48),
  final: b(49),
};

/** Fast moves: frames inside these windows get 16 motion-blur samples instead of 8. */
export const WHIPS = [
  [b(0.9), b(1.4)], [b(1.9), b(2.4)], [b(3.9), b(4.4)], [b(4.9), b(5.4)], [b(7.2), b(8.5)],
  [b(13.2), b(14.4)], [b(16.8), b(17.3)], [b(19.8), b(20.3)], [b(22.8), b(23.3)], [b(25.8), b(26.3)], [b(28.7), b(29.6)],
  [b(36.2), b(37.4)], [b(42.4), b(43.6)], [b(48.9), b(49.4)],
];

/** Stills saved as covers / thumbnails after the final render. */
export const COVERS = [b(5.6), b(9.2), b(31.5), b(46.5)];

/** true for a video that loops: the last frame folds back into the first. */
export const LOOP = false;
