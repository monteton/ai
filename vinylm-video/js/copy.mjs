// Every word on screen. Montenegrin, Latin script (?lang=sr). Facts only from vinyl-m.com (monteton/vinylm: assets/js/data.js,
// the site's own MN texts), «Iznajmljivanje opreme» (equipment rental) is the person's own description of the business.
export const BRAND = "VinylM"; // @param name
export const SLUG = "vinylm-promo"; // @param slug  (output file names)
export const DEFAULT_LANG = "sr"; // @param lang

export const COPY = {
  sr: {
    hook: ['ZVUK', 'SVETLO', 'EKRANI'],
    hookNote: 'oprema za događaje',
    sub: 'Iznajmljivanje opreme',
    place: 'BUDVA · CRNA GORA · OD 2007',
    chips: ['ZVUK', 'SVETLO', 'EFEKTI'],
    svc: [
      { word: 'ZVUK', art: 'speakers', gear: 'D&B · JBL · RCF', line: 'sistemi, digitalni pultovi, monitoring' },
      { word: 'SVETLO', art: 'lights', gear: 'MOVING HEADS · LED PAR', line: 'laser sistemi, truss konstrukcije' },
      { word: 'EKRANI', art: 'led', gear: 'LED EKRANI', line: 'video zidovi, 3D mapping' },
      { word: 'DJ', art: 'disc', gear: 'PIONEER CDJ 3000 · DJM', line: 'i kompletan backline' },
    ],
    namesHead: 'Događaji koje smo organizovali',
    names: [
      { big: 'JAZZ', small: 'MONTENEGRO JAZZ FESTIVAL · PETROVAC' },
      { big: 'REGGAE', small: 'REGGAE FESTIVAL · BUDVA' },
      { big: 'GARDEN', small: 'GARDEN PLANET FESTIVAL · BUDVA' },
      { big: 'DUKLEY', small: 'DUKLEY MUSIC FESTIVAL · BUDVA' },
    ],
    stats: [
      { to: 15, suf: '+', label: 'Godina iskustva' },
      { to: 500, suf: '+', label: 'Organizovanih događaja' },
      { to: 50, suf: '+', label: 'Partnera i artista' },
      { to: 10, suf: '+', label: 'Festivalskih projekata' },
    ],
    tagline: 'PROFESIONALNA OPREMA I TIM',
    cta: ['Vaš sledeći događaj', 'POČINJE OVDE'],
    ctaBtn: 'ZATRAŽITE PONUDU',
    contacts: [
      { icon: 'phone', text: '+382 67 439 100' },
      { icon: 'mail', text: 'vinylmbudva@gmail.com' },
      { icon: 'cam', text: '@_vinyl_m' },
    ],
  },
};
