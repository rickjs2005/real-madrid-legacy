# Wikimedia Commons asset sourcing report

Real Madrid — The Legacy · 2026-08-10 · commit `a0d3dd7` on `master`

## Summary

13 of 14 originally-listed slots filled, all with verified Public Domain / CC0 / CC BY / CC BY-SA
sources from Wikimedia Commons. Every file below was checked individually via the Commons API
(`action=query&prop=imageinfo&iiprop=url|extmetadata`) — the `LicenseShortName` field is quoted as
returned by the API. No non-free or unverified-license image was used. Club crest, kit product shots,
and trophy photos were **not** sourced (see "Skipped" section).

Method: `curl` with `User-Agent: real-madrid-legacy-portfolio/1.0 (contact: rickjanuario0@gmail.com)`
against `commons.wikimedia.org/w/api.php`, both `action=query&list=search&srnamespace=6` for discovery
and `action=query&prop=imageinfo` for per-file license verification. Every candidate that made the
final cut was also visually previewed (downloaded thumbnail, inspected) before use.

## Filled slots

| Slot | Commons file | Commons page | Author | License |
|---|---|---|---|---|
| `legacy/1902.webp` | Real Madrid players in 1902-1908.jpg | https://commons.wikimedia.org/wiki/File:Real_Madrid_players_in_1902-1908.jpg | Unknown author | Public Domain (PD-anon-70-EU) |
| `legacy/1956.webp` | Di Stefano 1959.jpg | https://commons.wikimedia.org/wiki/File:Di_Stefano_1959.jpg | Wim van Rossem / Anefo (Nationaal Archief) | CC0 |
| `legacy/1998.webp` | Raúl González 11dic2008.jpg | https://commons.wikimedia.org/wiki/File:Ra%C3%BAl_Gonz%C3%A1lez_11dic2008.jpg | Tsutomu Takasu | CC BY 2.0 |
| `legacy/2002.webp` | Zinedine Zidane.jpg | https://commons.wikimedia.org/wiki/File:Zinedine_Zidane.jpg | Walterlan Papetti | CC BY-SA 2.0 |
| `legacy/2014.webp` | Ronaldo vs Ludogorets (51101071755) (Ronaldo cropped).jpg | https://commons.wikimedia.org/wiki/File:Ronaldo_vs_Ludogorets_(51101071755)_(Ronaldo_cropped).jpg | Biser Todorov | CC BY-SA 2.0 |
| `legacy/2024.webp` | Vinícius Júnior Brazil V Morocco 13 June 2026-207 (cropped).jpg | https://commons.wikimedia.org/wiki/File:Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_(cropped).jpg | Bryan Berlin / WikiPortraits | CC BY-SA 4.0 |
| `squad/p01.webp` (Mbappé) | Kylian Mbappe France v Senegal 16 June 2026-391 (cropped).jpg | https://commons.wikimedia.org/wiki/File:Kylian_Mbappe_France_v_Senegal_16_June_2026-391_(cropped).jpg | Bryan Berlin / WikiPortraits | CC BY-SA 4.0 |
| `squad/p02.webp` (Vinícius Jr) | Vinicius Junior Brazil V Morocco 13 June 2026-94 (cropped).jpg | https://commons.wikimedia.org/wiki/File:Vinicius_Junior_Brazil_V_Morocco_13_June_2026-94_(cropped).jpg | Bryan Berlin / WikiPortraits | CC BY-SA 4.0 |
| `squad/p03.webp` (Bellingham) | 25th Laureus World Sports Awards - Red Carpet - Jude Bellingham - 240422 190558 (cropped).jpg | https://commons.wikimedia.org/wiki/File:25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190558_(cropped).jpg | Barcex | CC BY-SA 4.0 |
| `squad/p04.webp` (Valverde) | Federico Valverde 2021 (cropped).jpg | https://commons.wikimedia.org/wiki/File:Federico_Valverde_2021_(cropped).jpg | Real Madrid (still from official YouTube channel, YouTube CC BY license) | CC BY 3.0 |
| `squad/p05.webp` (Bernardo Silva) | Bernardo Silva Croatia v Portugal 2 July 2026-238.jpg | https://commons.wikimedia.org/wiki/File:Bernardo_Silva_Croatia_v_Portugal_2_July_2026-238.jpg | Bryan Berlin / WikiPortraits | CC BY-SA 4.0 |
| `squad/p06.webp` (Courtois) | FC RB Salzburg versus Real Madrid (Testspiel, 7. August 2019) 03.jpg | https://commons.wikimedia.org/wiki/File:FC_RB_Salzburg_versus_Real_Madrid_(Testspiel,_7._August_2019)_03.jpg | Werner100359 | CC BY-SA 4.0 |
| `bernabeu/aerial.webp` | M-estadio-santiago-bernabeu-diciembre-2024-a.jpg | https://commons.wikimedia.org/wiki/File:M-estadio-santiago-bernabeu-diciembre-2024-a.jpg | MottaW | CC BY 4.0 |

All originals were downloaded to a scratch temp dir (outside the repo), never to `public/assets/_raw`,
so there was nothing to delete before committing. `scripts/process-assets.mjs` (sharp) resized each to
max 1600px width (`withoutEnlargement: true`, so smaller originals stay smaller) and re-encoded as
webp q80, writing directly to the paths above. All 13 outputs verified to exist and be real, sane
images (12 of 13 are >20KB; see note on p04 below).

## Skipped slots (with reason)

- **`hero/crest.webp`** — explicitly excluded per instructions (club crest/logo is a trademark, not to
  be sourced).
- **`shop/kit-home.webp`, `shop/kit-away.webp`** — explicitly excluded per instructions (copyrighted
  kit marketing shots).
- **`trophies/european-cup.webp`, `la-liga.webp`, `copa-del-rey.webp`** — searched Commons for clean
  PD/CC photos of the trophies themselves (not held by a player, not a club-museum photo with unclear
  rights); nothing suitable turned up in the time available. Left empty — typography carries that
  section per the brief, no placeholder or ad-hoc find was substituted.
- **`bernabeu/stadium.glb`** — out of scope for this pass (3D model download), left as pre-existing
  "pendente" in ASSETS.md.

## Notable sourcing decisions / caveats

- **Era slots aren't literal-year photos.** For 1902 the file genuinely is the 1902–1908 squad. For
  1956 (Di Stéfano) I used a 1959 Real Madrid dressing-room portrait — the earliest high-quality,
  clearly-licensed individual photo of him in a Real Madrid shirt I could find; a candid 1962 airport
  photo (also CC0) was rejected as a candidate because it's a busy crowd shot, not a portrait. For 2002
  (Zidane) the only clean, high-res CC BY-SA portrait available is a 2013 studio shot (as Real Madrid
  Castilla coach, not in a playing kit) — noted since it doesn't literally depict 2002. 2014 (Ronaldo)
  is an October 2014 in-game shot in the Real Madrid away kit, matching La Décima's year.
- **Squad photos are mostly national-team kit, not Real Madrid kit.** For Mbappé, Vinícius Jr,
  Bellingham and Bernardo Silva, the highest-resolution and most recent CC-licensed portraits available
  are from international fixtures (2026 World Cup cycle matches, a 2024 awards red carpet), credited to
  WikiPortraits contributor Bryan Berlin and to Barcex. I prioritized recency + resolution + solid
  licensing over kit-accuracy since no comparably clean, high-res Real Madrid-kit alternative with
  verified free licensing existed for these four. Valverde and Courtois *are* in Real Madrid colors
  (interview still / friendly-match photo, respectively).
- **`squad/p04.webp` (Valverde) is 18.9KB**, just under the 20KB sanity bar. Visually verified (see
  commit) — it's a real, sharp, in-focus portrait; it compresses unusually well because it's a simple
  close-up with a smoothly blurred bokeh background. I checked two alternative Valverde photos (a 2017
  U-20 national-team shot with a cluttered background, and a 2022 low-quality upscaled crop) and judged
  the current one the better choice despite the smaller file size. Left as-is rather than swap to a
  worse-composed but larger file.
- Recommended photographer Кирилл Венедиктов (Kirill Venediktov) turned up as the credited author of
  `Thibaut Courtois at the 2018 World Cup (cropped).jpg` (CC BY-SA 3.0) — but that file's resolution
  (455×569) and Belgium-kit context were weaker than the Real Madrid preseason photo ultimately used
  for `squad/p06.webp`, so it was not used.
- One candidate was explicitly rejected for license ambiguity: a 2025 Copa del Rey final Vinícius Jr
  photo credited to Junta de Andalucía was tagged CC BY-SA 2.0 on Commons, but its own description text
  states the photo may only be used by news organizations / personal printing and not for commercial
  purposes — a restriction that conflicts with what CC BY-SA actually permits. Treated as an unreliable
  license tag and skipped rather than trusted at face value.

## Verification

- `npm run build` (`tsc -b && vite build`) passes cleanly — see build output in the session; no errors,
  bundle emitted to `dist/`.
- No browser check performed per instructions (controller verifies visually).
- Single commit `a0d3dd7` on `master`: "feat: real photos from wikimedia commons with per-file
  licenses" — includes the 13 webp assets, `scripts/process-assets.mjs`, `package.json` /
  `package-lock.json` (sharp devDependency), `public/assets/ASSETS.md`, and `README.md`.

## Follow-up pass — 2026-08-10 · commit `7c02921` on `master`

3 more Legacy-section era slots sourced for the 8-era expansion (1960, 1986, 2018), same method
(`curl` with the same `User-Agent`, Commons API `action=query&list=search` for discovery +
`action=query&prop=imageinfo&iiprop=url|extmetadata` for per-file license verification, visual
preview before use). This run did not touch anything under `src/` — a parallel change to
`src/sections/Legacy/` and `src/data/` landed on `master` in between (commits `ee52787`,
`42a2f90`); this commit sits cleanly on top of it.

| Slot | Commons file | Commons page | Author | License | Dimensions (output) |
|---|---|---|---|---|---|
| `legacy/1960.webp` | Alfredo Di Stéfano, Estadio, 1960-08-11 (898).jpg | https://commons.wikimedia.org/wiki/File:Alfredo_Di_St%C3%A9fano,_Estadio,_1960-08-11_(898).jpg | Unknown author (Estadio magazine, Santiago: Zig-Zag, 11 Aug 1960) | Public Domain (PD-Chile) | 1248×1723 (source was already <1600w, kept as-is) |
| `legacy/1986.webp` | Real Madrid in Oisterwijk Hugo Sanchez , kop, Bestanddeelnr 934-2327.jpg | https://commons.wikimedia.org/wiki/File:Real_Madrid_in_Oisterwijk_Hugo_Sanchez_,_kop,_Bestanddeelnr_934-2327.jpg | Rob Bogaerts / Anefo (Nationaal Archief) | CC0 | 1600×2411 (resized from 2481×3739) |
| `legacy/2018.webp` | Ronaldo in 2018.jpg | https://commons.wikimedia.org/wiki/File:Ronaldo_in_2018.jpg | Антон Зайцев (Anton Zaitsev) | CC BY-SA 3.0 | 844×1000 (source was already <1600w, kept as-is) |

All 3 outputs verified to exist and be valid webp images >20KB (61KB–870KB range).

### Sourcing notes

- **1960**: searched the Anefo/Nationaal Archief archive (as suggested) for a literal 1960 Hampden
  Park final photo first — nothing on Commons for "Real Madrid Eintracht Frankfurt 1960" except a
  line-up diagram SVG (no photo). Anefo does have several CC0 Puskás/Di Stéfano photos from the
  1959–1965 window (e.g. a 30 Jun 1959 Amsterdam friendly lineup), but the best match by far was a
  literal 11 Aug 1960 magazine photo of Di Stéfano from the Chilean sports magazine *Estadio*
  (`PD-Chile`, unknown photographer) — exact year, portrait orientation, colorized action shot. Used
  that instead of settling for an Anefo photo from an adjacent year.
- **1986**: no Real Madrid photo from 1985/1986 itself turned up in a clean license on Commons
  (searched "Real Madrid 1985/1986", Ajax/PSV/Feyenoord matchups, "Butragueño"). Found instead a
  19 Apr 1988 Anefo "kop" (headshot) portrait of Hugo Sánchez — Sánchez was Real Madrid's talismanic
  striker throughout La Quinta del Buitre (joined 1985, partnered Butragueño's generation) — CC0,
  genuinely portrait-oriented (2481×3739 native), which fits the 3:4 frame better than any group/match
  shot found. Same "closest clean-licensed photo within the era, not the literal year" approach used
  for 1902/1956/1998/2002/2014 in the original pass.
- **2018**: rejected the first strong-looking candidate — a Luka Modrić crop from the Madrid
  post-final street celebration (CC BY-SA 2.0, archimadrid.es) — after visual preview showed it's a
  busy handshake-line crowd shot with Modrić small and off-center, poor for a portrait frame. Found
  instead "Ronaldo in 2018.jpg" by Антон Зайцев (Anton Zaitsev, one of the two soccer.ru photographers
  named in the brief), CC BY-SA 3.0, taken minutes after the Kyiv final — a tight portrait crop with
  "FINAL KYIV 2018" legible on the sleeve, unambiguously dated 27 May 2018. Same photographer also has
  usable CC BY-SA 3.0 portraits of Isco, Benzema, Keylor Navas and Modrić from the same event, all in
  the ~500–930px range if a different player/mood is ever wanted for this slot; Ronaldo's was the
  sharpest and best-composed of the set.

### Script change

`scripts/process-assets.mjs` MAP now also lists `1960.jpg`/`1986.jpg`/`2018.jpg` →
`assets/legacy/{1960,1986,2018}.webp`. The loop was changed to `access()`-check each source file
and skip (log + `continue`) rather than throw when it's absent from `RAW_DIR`, so a `RAW_DIR`
holding only the new files (not all 13 originals from the first pass) works for a partial run —
this is how it was actually run this time.

### Verification

- `npm run build` (`tsc -b && vite build`) passes cleanly, no errors, bundle emitted to `dist/`.
- No browser check performed (visual verification was via direct image preview of the downloaded
  Commons originals, before processing).
- Single commit `7c02921` on `master`: "feat: legacy era photos 1960/1986/2018 from wikimedia
  commons" — includes the 3 new webp assets, the `scripts/process-assets.mjs` skip-on-missing
  change, and updated `public/assets/ASSETS.md` / `README.md` credits. Nothing under `src/` was
  staged or touched.
