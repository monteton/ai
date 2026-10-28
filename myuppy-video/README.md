# MYUPPY — promo

25.2 s · 1080×1920 (9:16) · 60 fps · Russian · electro-breaks, 124 BPM, D minor.

Everything is code: the picture is an HTML page rendered frame by frame in headless Chrome with motion blur; the score
and every sound effect are synthesised in Node on the same timeline (`js/timeline.mjs`). Facts and their sources:
`brief.md`; the critique rounds: `REVIEW.md`.

    export CHROME_PATH=<path to Chrome/Chromium>   # if it is not found automatically
    node audio/score.mjs        # the soundtrack → out/music.wav
    node tools/render.mjs       # the film → out/myuppy-promo.mp4 (+ -web.mp4, covers, QA)
    node tools/render.mjs --draft   # half size, no motion blur — for timing

## Direction card

- Film in one line: a studio that casts bold ideas into flawless digital form — and the viewer ends on «Есть проект? Обсудим».
- Read from: «сделай крутую рекламу моего проекта… 25 секунд, крутая графика, титры шрифтом Bebas, цвет сайта, вертикаль 9/16, русский… крутая моушен графика, вставки, текст на разных слоях, перед предметами и за ними». Source: the site's own repository (myuppy.com is blocked from the build environment). Plays as a Reel: first frame must work muted.
- Concept: **layers**. Every key moment is a sandwich — a giant Bebas word behind the object, the object (chrome mark, lens, waveform, chart, circuit, shard burst, product window) in the middle, an outlined copy of the same word in front. Signature moment: the chrome mark slams in front of MYUPPY while the outline of the same word cuts across it in cyan.
- Not taken: (2) a single product tour of Polako RAW only; (3) a numbers-first film («250+ проектов») with services as proof.
- Look: the site's own — near-black #04050a, neon cyan, violet, chrome gradient, thin grid; Bebas Neue for everything.
- Energy: hook high · brand high · svc high · polako high · proof high · lockup high — «крутая… динамичная»: the groove runs from the first bar and is held; contrast comes from adding layers and from one beat of silence before the lockup.
- Mood: dark, confident, fast.
- Sound role: music-led, with a signature SFX per service.
- Palette: ground #04050a · text #eef2f8 · accent #6ff3ff · accent-2 #b7a4ff · muted #8b95a5 · chrome gradient (text fill).
- Type: Bebas Neue only; 250–880 px for the giant words, 84–88 px for the site's own lines, 34–60 px caps for labels.
- Hard cuts (beats): diagonal wipes on 14 / 17 / 20 / 23 / 26; whip left on 7.3, whip up on 13.3 and 42.1; zoom through the product window on 36.3; flash cuts on 31 / 32 / 33 / 34 (chips, screen changes).
- Banned in this video: a scene counter or chapter label, HUD, cross-fades, a logo alone on black first, a stock look, house at 120–128 with a kick on every beat.

## Story

Beats at 124 BPM (1 beat = 0.484 s, 1 bar = 1.935 s).

| Time | Beats | Picture — how it enters, what holds, how it leaves | Sound |
|---|---|---|---|
| 0.0–3.9 s | 0–8 | hook: «СМЕЛЫЕ ИДЕИ» slam on 1–2, sink back as a ghost outline; «В ЦИФРОВУЮ ФОРМУ» lands in front on 4–5 with a cyan laser sweep; whip left | breaks groove from bar 1, impact per word, riser |
| 3.9–6.8 s | 8–14 | brand: the chrome mark slams in front of a giant MYUPPY, a far outline wordmark drifts the other way, the outline of the same word runs over the mark; chips ИИ / ДИЗАЙН / КИНО pop in front; whip up | drop, boom, glass-bell sonic logo, pops |
| 6.8–14.0 s | 14–29 | services: ВИДЕО (lens) · ЗВУК (waveform) · МАРКЕТИНГ (chart) · СОФТ (circuit) · БРЕНД (shards) — word behind, object, outline slice in front, the site's own line under it; diagonal wipe on every third beat | film flutter · sine sweep · pop chain · keyboard · glass bells |
| 14.0–17.9 s | 29–37 | Polako RAW: the window flies in tilted between POLAKO and RAW, emblem and four feature chips in front, three screens on shutter cuts; zoom through the window | shutters, glitch, riser |
| 17.9–20.8 s | 37–43 | 250+ · 15M+ · 98% · 40+: a number per 1.5 beats in chrome, its label as a giant outline behind it, caps label and a bar in front; ground flips cyan / violet | impact and rolling ticks per number |
| 20.8–25.2 s | 43–52 | lockup: the mark slams again, «ЕСТЬ ПРОЕКТ? ОБСУДИМ», three contacts pop; last hit on 49, then holds ≥ 4 s | silence → sonic logo → last hit with a tail |

## Sound brief

- Feel / genre: electro-breaks — broken, metallic, chrome; not house.
- Tempo & key: 124 BPM, D minor (Dm9 – Bbmaj7 – Gm9 – A7sus4, four beats each).
- Groove: kick `X..x..x...X...x.`, gated snare on 2 and 4 with ghost notes, clap layered on 4, metallic 16th hats with swing 0.06.
- Kit: 'hard' kick, 'gated' snare, metal-0.8 hats.
- Percussion: open hats off the beat.
- Bass: reese growl on every chord root, a clean sub under it, an octave hop on the last 16th of the bar.
- Harmony: brass-like stabs off the beat, a plucked arp on the lead bus.
- Hook (sonic logo): three glass bells, D6 – A5 – F5, on the logo slam and again on the lockup.
- Brand-world sounds: film-gate flutter, sine sweep, pop chain, keyboard clatter, glass bells, camera shutter.
- Silence: one beat (42.5 → 43) before the lockup; the last hit on 49 rings out.
- Loudness: -14 LUFS, true peak ≤ -1 dBTP.
