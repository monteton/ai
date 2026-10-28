// Sound for the film: the speaker's own voice, untouched, with a few very quiet design sounds under the graphics (a soft tick when a
// word-tied graphic lands, a small pop on a lit weekday, a faint whoosh on the big type). No music: the film stays strict.
//   node audio/score.mjs [out/music.wav] [--report]
import * as A from './synth/index.mjs';
import { execFileSync } from 'node:child_process';
import { DURATION, CUE, CLIP } from '../js/timeline.mjs';
import { WORDS } from '../js/words.mjs';

const args = process.argv.slice(2);
const out = args.find((a) => a.endsWith('.wav')) || 'out/music.wav';
const sfx = out.replace(/\.wav$/, '-sfx.wav');
const word = (i) => WORDS[i][1];

A.init({ duration: DURATION, bpm: 120, seed: 11 });
A.bus('fx', { gain: -4, verb: 0.12 });
const tick = (t, v = 0.5, pan = 0) => A.tick(t, { bright: 5200, vel: v, pan });

// kicker «ИДЁТ НАБОР»
A.whoosh(CUE.kicker - 0.3, 0.3, { shape: 'in', f0: 500, f1: 3500, vel: 0.22 });
tick(CUE.kicker, 0.5);
// the group name: one soft pop per line, rising
[8, 10, 11].forEach((i, k) => { A.whoosh(word(i) - 0.28, 0.24, { shape: 'in', f0: 600, f1: 4000, vel: 0.2 }); A.pop(word(i) - 0.04, ['C5', 'E5', 'G5'][k], { vel: 0.3 }); });
A.whoosh(CUE.nameOut, 0.3, { shape: 'out', f0: 3500, f1: 500, vel: 0.18 });
// the schedule board
tick(word(15) - 0.06, 0.55, -0.3);
tick(CUE.hours - 0.04, 0.55, 0.0);
for (let k = 0; k < 7; k++) tick(CUE.days - 0.05 + k * 0.045, 0.28, -0.4 + k * 0.13);
A.pop(word(23) - 0.06, 'E5', { vel: 0.32, pan: -0.3 }); // ПН
A.pop(word(25) - 0.06, 'G5', { vel: 0.32, pan: 0.1 }); // СР
tick(word(27) - 0.04, 0.55, 0.3);
tick(word(29) - 0.04, 0.55, 0.3);
A.ding(word(29) + 0.1, 'C6', { vel: 0.18 });
A.whoosh(CUE.boardOut, 0.3, { shape: 'out', f0: 3000, f1: 500, vel: 0.18 });
// «Жду всех», «?», the call to action
A.whoosh(word(30) - 0.3, 0.26, { shape: 'in', f0: 500, f1: 3500, vel: 0.2 });
A.pop(word(30) - 0.04, 'E5', { vel: 0.28 });
A.pop(word(34) - 0.04, 'G5', { vel: 0.28, pan: -0.3 });
A.pop(word(35) - 0.04, 'C6', { vel: 0.28, pan: 0.3 });
A.whoosh(CUE.cta - 0.3, 0.3, { shape: 'in', f0: 500, f1: 4500, vel: 0.24 });
A.pop(CUE.cta - 0.02, 'G5', { vel: 0.35 });
A.sparkle(CUE.cta + 0.35, { vel: 0.22 });

A.render(sfx, { lufs: -27, truePeak: -3, reverb: 'plate', delay: { beats: 0.75, feedback: 0.2 } });

// voice (as recorded, levelled) + design sounds → the film's sound
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'assets/voice.wav', '-i', sfx, '-filter_complex',
  `[0:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-15:TP=-2:LRA=8,apad=whole_dur=${DURATION}[v];[1:a]aresample=48000[s];[v][s]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.8[o]`,
  '-map', '[o]', '-t', String(DURATION), '-ar', '48000', '-ac', '2', out], { stdio: 'inherit' });
const m = execFileSync('ffmpeg', ['-v', 'info', '-nostats', '-i', out, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
console.log('wrote', out);
