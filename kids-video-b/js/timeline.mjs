// ONE timeline for picture and sound. The source clip is 18.7 s at 30 fps; the film holds its last frame for 1.2 s so the call to action can rest.
export const W = 1080; // @param width
export const H = 1920; // @param height
export const FPS = 30; // @param fps
export const BPM = 120; // @param bpm
export const BEAT = 60 / BPM;
export const BAR = 4 * BEAT;
export const b = (n) => n * BEAT;

export const CLIP = 18.7; // seconds of source video
export const DURATION = 19.9;

export const S = { talk: [0, DURATION] };
export const ENERGY = { talk: 'mid' };

/** Moments, aligned to words (js/words.mjs). */
export const CUE = {
  kicker: 1.2, // «идёт набор»
  group: 2.12, // «в группу»
  name: 3.04, // «Путь к одарённому ребёнку»
  nameOut: 5.15,
  board: 5.48, // «два раза в неделю»
  hours: 7.56, // «два часа»
  days: 8.44, // «по понедельникам и средам»
  time: 10.72, // «с пяти до семи»
  boardOut: 13.25,
  all: 13.68, // «Жду всех»
  ask: 14.96, // «Если есть вопросы, интерес»
  cta: 17.08, // «пишите в директ»
};

export const WHIPS = [];
export const COVERS = [3.9, 9.9, 15.8, 18.6];
export const LOOP = false;
