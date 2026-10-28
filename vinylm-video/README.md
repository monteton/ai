# VinylM — promo

24.8 s · 1080×1920 (9:16) · 60 fps · Montenegrin (Latin) · nu-disco funk, 116 BPM, G dorian.

Everything is code: the picture is an HTML page rendered frame by frame in headless Chrome with motion blur; the score and every sound
effect are synthesised in Node on the same timeline (`js/timeline.mjs`). Facts and their sources: `brief.md`; the critique rounds: `REVIEW.md`.

    export CHROME_PATH=<path to Chrome/Chromium>   # if it is not found automatically
    node audio/score.mjs            # the soundtrack → out/music.wav
    node tools/render.mjs           # the film → out/vinylm-promo.mp4 (+ -web.mp4, covers, QA)
    node tools/render.mjs --draft   # half size, no motion blur — for timing

## Direction card

- Film in one line: a loud, editorial reel for an event-equipment rental in Budva that ends on «Vaš sledeći događaj počinje ovde — Zatražite ponudu».
- Read from: «для vinylm… язык черногорский латиница, остальное такое же (25 с, вертикаль, крутая моушен графика, вставки, текст на разных слоях, перед предметами и за ними), используй стиль сайта. Это прокат оборудования, фотографии не из галереи, лучше скачай что-нибудь подходящее». Stock hosts are blocked in the build environment, so the equipment is drawn in code.
- Concept: **layers on paper and ink**. Every panel is a sandwich — a wall of the same word behind (outline · solid · outline), the equipment in the middle, an outline slice of the word in front. Signature moment: the logo slams onto a giant red M, an outline of the M cuts across it.
- Not taken: (2) a spec-sheet film listing the catalogue item by item; (3) a festival-poster film built only on the four events.
- Look: the site's own — paper #f2eee6, ink #111, red #ff4a1c; Montserrat 900 for the giant words, Cormorant Garamond italic for the lines.
- Energy: all scenes high — «крутая моушен графика… такое же»: the groove runs from the first bar and is held; contrast comes from the record stopping for one beat before the lockup.
- Mood: bright and loud, then dark on the drop.
- Sound role: music-led, with the record as the brand-world sound.
- Palette: paper #f2eee6 · ink #111 · red #ff4a1c · muted #6f695d.
- Type: Montserrat 900 (giant words, numbers), Montserrat 800 caps (labels), Cormorant Garamond italic (lines, labels of numbers).
- Hard cuts (beats): ink circle on 4; whip left on 5.3; whip up on 11.3 and 37.4; diagonal wipes on 12 / 16 / 20 / 24; whip down on 31.6.
- Banned in this video: a scene counter or chapter label, HUD, cross-fades, a logo alone on black first, a stock look, house at 120–128 with a kick on every beat.

## Story

Beats at 116 BPM (1 beat = 0.517 s, 1 bar = 2.07 s).

| Time | Beats | Picture — how it enters, what holds, how it leaves | Sound |
|---|---|---|---|
| 0.0–3.1 s | 0–6 | hook: ZVUK / SVETLO / EKRANI slam on beats 1–3 with colour slabs and outline echoes; an ink circle swallows the frame, a record spins in, a bolt strikes; whip left | crackle, stabs per word, record pitch-down, needle, zap |
| 3.1–6.2 s | 6–12 | brand: the logo slams on a giant red M, outline M across it; «Iznajmljivanje opreme», place, chips; whip up | drop, boom, three chimes (sonic logo), groove |
| 6.2–14.5 s | 12–28 | equipment: ZVUK (speaker array) · SVETLO (moving heads) · EKRANI (LED wall) · DJ (record deck) — word wall behind, equipment, outline slice in front, the site's line; diagonal wipes | sub drop · laser zaps · digital blips · scratch |
| 14.5–16.5 s | 28–32 | events: JAZZ / REGGAE / GARDEN / DUKLEY on four colour slabs, one per beat | brass stab per slab, crowd swell |
| 16.5–19.7 s | 32–38 | 15+ · 500+ · 50+ · 10+ on ink / red / paper / ink, serif italic labels, a giant outline + behind | impact and rolling ticks per number |
| 19.7–24.8 s | 38–48 | lockup: logo on the red M again, «Vaš sledeći događaj POČINJE OVDE», button, three contacts; last hit on 44 | tape-stop → sonic logo → last hit with a tail |

## Sound brief

- Feel / genre: nu-disco funk with a live-drum feel; warm, plucky, not four-on-the-floor.
- Tempo & key: 116 BPM, G dorian (Gm9 – C9 – Bbmaj7 – Dm9, four beats each).
- Groove: kick `X..x..x.X...x...`, claps on 2 and 4 with rim ghosts, 16th shakers with swing 0.1.
- Kit: 'tight' kick, claps, rim, shaker, open hats off the beat.
- Bass: a plucky funk line locked to the kick, octave hop and fifth.
- Harmony: clav stabs off the beat, brass stabs on the hits, a plucked arp on the lead bus.
- Hook (sonic logo): three chimes, G5 – Bb5 – D6, on the drop and on the lockup.
- Brand-world sounds: record crackle, needle drop, pitch-down, scratch, tape-stop.
- Silence: the record stops (tape-stop) over the beat before the lockup; the last hit on beat 44 rings out.
- Loudness: -14 LUFS, true peak ≤ -1 dBTP.
