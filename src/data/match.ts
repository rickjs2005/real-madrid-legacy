// Snapshot real: 2026-08-10 — fonte: realmadrid.com (case gravado, não mantido vivo)
//
// Verificado via WebFetch/WebSearch em 2026-08-10:
// - Artigo oficial realmadrid.com (29-07-2026): "Real Madrid will play a friendly
//   match against Schalke 04 next Sunday, August 16, at 5:00 pm... at the
//   Veltins-Arena in Gelsenkirchen." Corroborado por veltins-arena.de e imprensa
//   esportiva (ESPN, Yahoo Sports).
// - Resultados de pré-temporada 2026 confirmados via reportagens oficiais
//   realmadrid.com/en-US/news/football/first-team/reports:
//   "Victory in Budapest" (08-08-2026): Ferencváros 1-2 Real Madrid.
//   "Draw in the first preseason match" (01-08-2026): Real Madrid 2-2 Fiorentina
//   (Wörthersee Stadion, Klagenfurt — sede neutra).
// - Abertura da LaLiga 2026-27: estreia do Real Madrid adiada para a 2ª jornada,
//   23/08 fora contra o Espanyol (jogadores na Copa do Mundo); jogo vs Real
//   Sociedad (1ª jornada) remarcado para 26/08 no Bernabéu.
//
// Nota: a "Deportivo de A Coruña" (12/08) apareceu como amistoso ainda mais
// próximo na home do site — não usado aqui porque o brief pediu explicitamente
// verificação do amistoso vs Schalke 04 de 16/08 como o "next match" da seção.

export const nextMatch = {
  home: 'SCHALKE 04',
  away: 'REAL MADRID',
  dateISO: '2026-08-16T17:00:00+02:00',
  venue: 'Veltins-Arena, Gelsenkirchen',
  competition: 'PRE-SEASON FRIENDLY',
}

export const lastResults = [
  { opponent: 'FERENCVÁROS', score: '2–1', home: false },
  { opponent: 'FIORENTINA', score: '2–2', home: false },
]

export const leagueNote = 'LA LIGA 2026-27 · SEASON OPENS AUG 22 AT ESPANYOL'
