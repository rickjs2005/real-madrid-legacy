# REAL MADRID — THE ETERNAL CLUB

Concept experience · 1920×1080 · built to be screen-recorded (Instagram / TikTok / Reels / LinkedIn / portfolio).
A cinematic film about what Real Madrid means, now followed by a functional season layer. The complete experience ships 10 chapters:
01 MADRID · 02 THE BERNABÉU · 03 BUILT BY LEGENDS · 04 THE ERA OF DOMINANCE · 05 KINGS OF EUROPE ·
06 90 MINUTES · 07 THE PRESENT · 08 MATCH CENTRE · 09 NEWSROOM · 10 ETERNAL. Spec: `docs/superpowers/specs/2026-08-27-eternal-club-design.md`.

Stack: Vite · React 19 · TypeScript · Tailwind v4 · Lenis · GSAP ScrollTrigger · Three.js (hero film + legends displacement) · Higgsfield (architecture/atmosphere assets only — never faces).

Dev: `npm run dev` (open at 1920×1080, scroll only) · Build: `npm run build` · Typecheck: `npx tsc -b`

The Match Centre includes a live countdown, competition filters, fixture details and an interactive LaLiga table. Newsroom includes category filters, story views and official-source links. Data is isolated in `src/data/` so a live API can replace the editorial snapshot without changing the UI.

Out of scope by design: mobile, SEO, 404, analytics and backend. v1 is archived untouched in `src/archive-v1/`.

## Photo credits (v2 additions)

- Ferenc Puskás, Feyenoord v Real Madrid, 1965 — Joost Evers / Anefo, CC0 — https://commons.wikimedia.org/wiki/File:Feyenoord_tegen_Real_Madrid_2-1,_Puskas_in_duel_met_Guus_Haak,_Bestanddeelnr_918-1560.jpg
- Paco Gento, Feyenoord v Real Madrid, 1965 — Rob Bogaerts / Anefo, CC BY 2.0 — https://commons.wikimedia.org/wiki/File:Feyenoord_tegen_Real_Madrid_2-1,_spelmomenten._Gento_(cropped).jpg
- Roberto Carlos, 2023 — Flickr via Wikimedia Commons, CC BY 2.0 — https://commons.wikimedia.org/wiki/File:LS3_1288_(53332367864)_(cropped).jpg
- Bernabéu facade reference used for AI reframes: MottaW, CC BY 4.0 (see below)
- 2014 Champions League final in Lisbon — Miguelazo84, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Real_Madird_4-1_Atletico_2014_Final_Champions_Lisboa_3.jpg
- Real Madrid celebrating La Décima after the 2014 final — El Coleccionista de Instantes Fotografía & Video, CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:Final_Champions_League_2014_Real_Madrid_-_Atl%C3%A9tico_de_Madrid_(14081181609).jpg

---

<details><summary>v1 README (archived)</summary>

# REAL MADRID — THE LEGACY

Unofficial concept · one-page cinematic experience · desktop-only (built for recording)

**Problem.** The official site works as an institutional news portal.
**Proposal.** Explore how the same brand could turn its history, football and stadium into an immersive digital experience.
**Result.** 10 sections, each with its own visual language, stitched by a continuous light arc (day → night → day), scrolling at 60fps.

Stack: Vite · React · TypeScript · Tailwind v4 · Lenis · GSAP ScrollTrigger · React Three Fiber (Bernabéu section only).

All imagery and trademarks belong to Real Madrid CF. Data is a dated snapshot (10 Aug 2026) — this is a recorded case, not a live product.

Dev: `npm run dev` · Test: `npm test` · Build: `npm run build`

## Photo credits

Photos sourced from Wikimedia Commons under their individual licenses:

- Real Madrid players in 1902-1908 — Unknown author, Public Domain — https://commons.wikimedia.org/wiki/File:Real_Madrid_players_in_1902-1908.jpg
- Di Stéfano, 1959 — Wim van Rossem / Anefo, CC0 — https://commons.wikimedia.org/wiki/File:Di_Stefano_1959.jpg
- Alfredo Di Stéfano, Estadio magazine, 11 Aug 1960 — Unknown author, Public Domain (PD-Chile) — https://commons.wikimedia.org/wiki/File:Alfredo_Di_St%C3%A9fano,_Estadio,_1960-08-11_(898).jpg
- Hugo Sánchez, Real Madrid in Oisterwijk, 1988 — Rob Bogaerts / Anefo, CC0 — https://commons.wikimedia.org/wiki/File:Real_Madrid_in_Oisterwijk_Hugo_Sanchez_,_kop,_Bestanddeelnr_934-2327.jpg
- Raúl González, 2008 — Tsutomu Takasu, CC BY 2.0 — https://commons.wikimedia.org/wiki/File:Ra%C3%BAl_Gonz%C3%A1lez_11dic2008.jpg
- Zinedine Zidane — Walterlan Papetti, CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:Zinedine_Zidane.jpg
- Cristiano Ronaldo vs Ludogorets, 2014 — Biser Todorov, CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:Ronaldo_vs_Ludogorets_(51101071755)_(Ronaldo_cropped).jpg
- Cristiano Ronaldo, moments after the 2018 Champions League final (Kyiv) — Антон Зайцев (Anton Zaitsev), CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Ronaldo_in_2018.jpg
- Karim Benzema wearing Real Madrid home kit, 2021-2022 — Real Madrid, CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Karim_Benzema_wearing_Real_Madrid_home_kit_2021-2022.jpg
- Vinícius Júnior, Brazil v Morocco, 2026 (x2) — Bryan Berlin / WikiPortraits, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_(cropped).jpg and https://commons.wikimedia.org/wiki/File:Vinicius_Junior_Brazil_V_Morocco_13_June_2026-94_(cropped).jpg
- Kylian Mbappé, France v Senegal, 2026 — Bryan Berlin / WikiPortraits, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Kylian_Mbappe_France_v_Senegal_16_June_2026-391_(cropped).jpg
- Jude Bellingham, Laureus World Sports Awards, 2024 — Barcex, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190558_(cropped).jpg
- Federico Valverde, 2021 — Real Madrid (official YouTube channel still), CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Federico_Valverde_2021_(cropped).jpg
- Bernardo Silva, Croatia v Portugal, 2026 — Bryan Berlin / WikiPortraits, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Bernardo_Silva_Croatia_v_Portugal_2_July_2026-238.jpg
- Thibaut Courtois, RB Salzburg v Real Madrid, 2019 — Werner100359, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:FC_RB_Salzburg_versus_Real_Madrid_(Testspiel,_7._August_2019)_03.jpg
- Estadio Santiago Bernabéu exterior, December 2024 — MottaW, CC BY 4.0 — https://commons.wikimedia.org/wiki/File:M-estadio-santiago-bernabeu-diciembre-2024-a.jpg
- Museo del Real Madrid, Bernabéu tour — Lệ Xuân, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:170928_Museo_del_Real_Madrid_C._F.jpg
- UEFA Champions League original trophy (1995–2005) — Jay Clark, CC BY-SA 2.5 — https://commons.wikimedia.org/wiki/File:UEFA_Champions_League_original_trophy_(1995-2005).jpg
- Santiago Bernabéu Stadium, Real Madrid v Borussia Dortmund (Champions League semi-final), 30 Apr 2013 — Little Savage, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Santiago_Bernab%C3%A9u_Stadium,_Real_Madrid_-_Borussia_Dortmund,_2013_-_11.jpg

Club crest, kit product shots and two trophy silhouettes (La Liga, Copa del Rey) were not sourced (trademark / no clean free-license image found) — see `public/assets/ASSETS.md` for the full slot-by-slot status.

</details>
