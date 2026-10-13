[Português](README.pt-BR.md)

# Real Madrid — The Eternal Club

A scroll-driven, cinematic one-page experience about the history of Real Madrid, built with Vite, React and Three.js. It is designed to be viewed at 1920×1080 on desktop and screen-recorded for portfolio and social media.

> **Type:** fan-made concept — non-commercial, unofficial, **not affiliated with, endorsed by or sponsored by Real Madrid C.F.** Club names, crest and trademarks belong to their respective owners.

![Opening scene: a dark stadium tunnel leading to the pitch](docs/screenshots/hero.webp)

## Features

The experience has 10 chapters: 01 Madrid · 02 The Bernabéu · 03 Built by Legends · 04 The Era of Dominance · 05 Kings of Europe · 06 90 Minutes · 07 The Present · 08 Match Centre · 09 Newsroom · 10 Eternal.

- Hero film scrubbed by scroll (frame sequence rendered with Three.js) and a WebGL displacement effect on the legends portraits, with a fallback when WebGL is unavailable.
- Smooth scrolling with Lenis and scroll-driven animation with GSAP ScrollTrigger.
- **Match Centre:** countdown to the next fixture, competition filters, fixture details and an interactive league table.
- **Newsroom:** category filters, story views and links to the club's official site.
- Season and news data live in `src/data/` as a typed editorial snapshot (last updated 3 Sep 2026), so a live API could replace it without UI changes. It is **not** live data.
- The closing chapter includes an "unofficial portfolio concept · not affiliated with Real Madrid C.F." notice.

## Stack

Vite 8 · React 19 · TypeScript 6 · Tailwind CSS 4 · Three.js with React Three Fiber and postprocessing · GSAP · Lenis · Vitest · oxlint. `sharp` is used only by the asset pipeline script.

## Getting started

Requirements: Node.js 20.19+ or 22.12+ (Vite 8) and npm.

```bash
npm ci
npm run dev      # open at 1920×1080 and scroll
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Type-check (`tsc -b`) and production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |
| `npm test` | Run unit tests with Vitest |

No environment variables are needed to run the app. `scripts/process-assets.mjs` (one-off image pipeline) reads `RAW_DIR`, the folder with the downloaded source images.

## Project structure

```
src/
  sections/      one folder per chapter (Hero, Bernabeu, Legends, Dominance, Kings,
                 NinetyMinutes, Present, MatchCentre, Newsroom, Eternal)
  components/    shared UI (chapter marks)
  lib/           Lenis, cursor, scroll velocity, WebGL helpers
  data/          season and newsroom snapshot
  archive-v1/    first version of the concept, kept untouched (and its tests)
public/assets/   images, video and the asset manifest (ASSETS.md)
docs/            design specs and art direction notes
scripts/         asset processing pipeline
```

## Limitations

- Desktop only, tuned for a 1920×1080 viewport; mobile, SEO, 404 page, analytics and backend are out of scope.
- Match, table and news content is a dated snapshot, not a live feed.
- The production bundle has a chunk larger than 500 kB (Vite warning).

## Media credits and origin

- **Photographs:** Wikimedia Commons, under public domain, CC0, CC BY or CC BY-SA licenses. The full slot-by-slot list (file, author, license, link) is in [`public/assets/ASSETS.md`](public/assets/ASSETS.md); the main credits are repeated below.
- **Videos** `public/assets/film/aerial.mp4` and `public/assets/film/facade.mp4`, the tunnel frame sequence (`film/tunnel/`) and the other `film/` stills: AI-generated with Higgsfield (architecture and atmosphere only, never faces), according to the project's asset manifest. The two Bernabéu clips used the CC BY 4.0 facade photo by MottaW as a reference image.
- **Club crest** (`public/assets/brand/real-madrid-crest.svg`): trademark of Real Madrid C.F., taken from the file hosted on Wikipedia; it is **not** under a free license. It appears only in the Match Centre poster and the closing chapter, in an editorial, non-commercial context with the non-affiliation notice.
- Kit images and the La Liga / Copa del Rey trophy cut-outs were intentionally not used.

<details><summary>Photo credits (Wikimedia Commons)</summary>

- Real Madrid players in 1902-1908 — Unknown author, Public Domain — https://commons.wikimedia.org/wiki/File:Real_Madrid_players_in_1902-1908.jpg
- Di Stéfano, 1959 — Wim van Rossem / Anefo, CC0 — https://commons.wikimedia.org/wiki/File:Di_Stefano_1959.jpg
- Alfredo Di Stéfano, Estadio magazine, 11 Aug 1960 — Unknown author, Public Domain (PD-Chile) — https://commons.wikimedia.org/wiki/File:Alfredo_Di_St%C3%A9fano,_Estadio,_1960-08-11_(898).jpg
- Hugo Sánchez, Real Madrid in Oisterwijk, 1988 — Rob Bogaerts / Anefo, CC0 — https://commons.wikimedia.org/wiki/File:Real_Madrid_in_Oisterwijk_Hugo_Sanchez_,_kop,_Bestanddeelnr_934-2327.jpg
- Ferenc Puskás, Feyenoord v Real Madrid, 1965 — Joost Evers / Anefo, CC0 — https://commons.wikimedia.org/wiki/File:Feyenoord_tegen_Real_Madrid_2-1,_Puskas_in_duel_met_Guus_Haak,_Bestanddeelnr_918-1560.jpg
- Paco Gento, Feyenoord v Real Madrid, 1965 — Rob Bogaerts / Anefo, CC BY 2.0 — https://commons.wikimedia.org/wiki/File:Feyenoord_tegen_Real_Madrid_2-1,_spelmomenten._Gento_(cropped).jpg
- Raúl González, 2008 — Tsutomu Takasu, CC BY 2.0 — https://commons.wikimedia.org/wiki/File:Ra%C3%BAl_Gonz%C3%A1lez_11dic2008.jpg
- Roberto Carlos, 2023 — Flickr via Wikimedia Commons, CC BY 2.0 — https://commons.wikimedia.org/wiki/File:LS3_1288_(53332367864)_(cropped).jpg
- Zinedine Zidane — Walterlan Papetti, CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:Zinedine_Zidane.jpg
- Cristiano Ronaldo vs Ludogorets, 2014 — Biser Todorov, CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:Ronaldo_vs_Ludogorets_(51101071755)_(Ronaldo_cropped).jpg
- Cristiano Ronaldo after the 2018 Champions League final (Kyiv) — Антон Зайцев (Anton Zaitsev), CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Ronaldo_in_2018.jpg
- Karim Benzema, Real Madrid home kit 2021-2022 — Real Madrid, CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Karim_Benzema_wearing_Real_Madrid_home_kit_2021-2022.jpg
- Vinícius Júnior, Brazil v Morocco, 2026 (x2) — Bryan Berlin / WikiPortraits, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_(cropped).jpg and https://commons.wikimedia.org/wiki/File:Vinicius_Junior_Brazil_V_Morocco_13_June_2026-94_(cropped).jpg
- Kylian Mbappé, France v Senegal, 2026 — Bryan Berlin / WikiPortraits, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Kylian_Mbappe_France_v_Senegal_16_June_2026-391_(cropped).jpg
- Jude Bellingham, Laureus World Sports Awards, 2024 — Barcex, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190558_(cropped).jpg
- Federico Valverde, 2021 — Real Madrid (official YouTube channel still), CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Federico_Valverde_2021_(cropped).jpg
- Bernardo Silva, Croatia v Portugal, 2026 — Bryan Berlin / WikiPortraits, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Bernardo_Silva_Croatia_v_Portugal_2_July_2026-238.jpg
- Thibaut Courtois, RB Salzburg v Real Madrid, 2019 — Werner100359, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:FC_RB_Salzburg_versus_Real_Madrid_(Testspiel,_7._August_2019)_03.jpg
- Estadio Santiago Bernabéu exterior, December 2024 — MottaW, CC BY 4.0 — https://commons.wikimedia.org/wiki/File:M-estadio-santiago-bernabeu-diciembre-2024-a.jpg
- Museo del Real Madrid, Bernabéu tour — Lệ Xuân, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:170928_Museo_del_Real_Madrid_C._F.jpg
- UEFA Champions League original trophy (1995–2005) — Jay Clark, CC BY-SA 2.5 — https://commons.wikimedia.org/wiki/File:UEFA_Champions_League_original_trophy_(1995-2005).jpg
- Santiago Bernabéu, Real Madrid v Borussia Dortmund, 30 Apr 2013 — Little Savage, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Santiago_Bernab%C3%A9u_Stadium,_Real_Madrid_-_Borussia_Dortmund,_2013_-_11.jpg
- 2014 Champions League final in Lisbon — Miguelazo84, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Real_Madird_4-1_Atletico_2014_Final_Champions_Lisboa_3.jpg
- Real Madrid celebrating La Décima, 2014 — El Coleccionista de Instantes Fotografía & Video, CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:Final_Champions_League_2014_Real_Madrid_-_Atl%C3%A9tico_de_Madrid_(14081181609).jpg

</details>

## Design docs

- Current version spec: [`docs/superpowers/specs/2026-08-27-eternal-club-design.md`](docs/superpowers/specs/2026-08-27-eternal-club-design.md)
- First version spec: [`docs/superpowers/specs/2026-08-10-real-madrid-legacy-design.md`](docs/superpowers/specs/2026-08-10-real-madrid-legacy-design.md)
- Art direction notes: [`docs/art-direction/`](docs/art-direction/README.md)

## Security

See [SECURITY.md](SECURITY.md).

## License

No license has been chosen yet; all rights reserved by the author. This covers the project's own code and design only. Third-party photographs keep their individual licenses (see the credits above), and the club's name, crest and trademarks belong to Real Madrid C.F.
