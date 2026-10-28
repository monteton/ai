# Brief — VinylM

Facts that may appear on screen, each with its source. Nothing else goes into the video. The live site vinyl-m.com is blocked in the
build environment, so every fact comes from its source repository `monteton/vinylm` (CNAME = vinyl-m.com): `assets/js/data.js` (the site's
own texts; its Montenegrin switch «MN» is the `sr` block, Latin script), `index.html`, `style.css`.

- **Promise** (one sentence): VinylM provides professional sound, light, LED screens and a team for concerts, festivals and corporate events in Montenegro, since 2007.
- **Business**: equipment rental («Iznajmljivanje opreme» — the person's own description; the site says «Profesionalna oprema i tim za festivale, koncerte i korporativne događaje»).
- **Audience**: event organisers, festivals, corporate clients in Montenegro and the region.
- **Tone**: confident, editorial, loud. Paper and ink with a red-orange accent, as the site.

## Proof points

1. Sound: D&B, JBL, RCF systems, digital consoles, monitoring — source: data.js `svcSoundDesc`, catalog.sound (DiGiCo, Yamaha CL5, Midas M32, Pioneer CDJ 3000 …).
2. Light: moving heads, LED PAR, laser systems, truss — source: `svcLightDesc`.
3. Effects and screens: LED screens, video walls, 3D mapping — source: `svcEffectsDesc`.
4. DJ and backline: Pioneer CDJ 3000, DJM — source: catalog.sound `catDj`, `catBackline`.
5. Numbers: 15+ years of experience, 500+ events organised, 50+ partners and artists, 10+ festival projects — source: index.html `.stats` (data-n).
6. Events: Montenegro Jazz Festival — Petrovac, Reggae Festival — Budva, Garden Planet Festival — Budva, Dukley Music Festival — Budva — source: data.js `events`.

## Offer and prices (only if published)

- None published. No prices in the video.

## Call to action — where people buy / sign up

- «Vaš sledeći događaj počinje ovde» → «Zatražite ponudu» (the site's `ctaTitle` / `ctaBtn`) → phone, e-mail, Instagram.

## Contacts (exactly as given)

- Phone: +382 67 439 100 · E-mail: vinylmbudva@gmail.com · Instagram: https://www.instagram.com/_vinyl_m/ (shown as @_vinyl_m) — source: data.js `contact`.
- Budva, Montenegro.

## Brand

- Colours (index.html `:root`): paper #f2eee6, ink #111, red #ff4a1c, muted #6f695d.
- Fonts: Montserrat (display, 900) and Cormorant Garamond italic (accents), the site's own woff2 files.
- Logo file: `assets/img/logo-dark.png` / `logo-light.png` (a vinyl record with a lightning bolt, «Vinyl M»).
- Signature shape / motif (the visual DNA): the record and the bolt; a giant M behind the logo; layers — a wall of the word behind, the equipment in the middle, an outline of the word in front.
- Photos: none from the gallery. The equipment is drawn in code (speaker array, moving heads, LED wall, record deck) because the stock-photo hosts are blocked in the build environment.
