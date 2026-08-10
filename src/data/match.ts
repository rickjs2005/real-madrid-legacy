// Snapshot real: 2026-08-10 — fonte: realmadrid.com (case gravado, não mantido vivo)
//
// Verificado via WebFetch/WebSearch em 2026-08-10:
// - nextMatch = Real Madrid vs Deportivo de A Coruña (Trofeo Teresa Herrera,
//   LXXXI edição), confirmado como o próximo jogo real do clube no widget
//   "Next Match" da home realmadrid.com/en-US, cruzado com artigo oficial
//   "Real Madrid will play the LXXXI edition of the Teresa Herrera Trophy on
//   August 12" (realmadrid.com, 09-07-2026) e imprensa (ESPN, LaLiga.com,
//   whenisthematch.com, renderfoot.com). Data: 12/08/2026. Horário: 21:00 CEST
//   (9:00 PM, confirmado de forma consistente em duas fontes independentes —
//   o widget oficial e a agregação de imprensa). Estádio: Abanca-Riazor, A
//   Coruña (nome com patrocínio confirmado no próprio widget oficial).
// - Corrigido em rodada de revisão: a primeira versão deste arquivo usava o
//   amistoso vs Schalke 04 (16/08, Veltins-Arena, confirmado via artigo
//   oficial de 29-07-2026 e imprensa) como "nextMatch", por ser o jogo
//   explicitamente citado no brief. Isso violava a regra de não exibir dado
//   falso sob o rótulo "NEXT MATCH", já que o Deportivo (12/08) é
//   cronologicamente o próximo jogo real. A informação do Schalke 04
//   permanece — de forma honesta — na seção de notícias (ver `news.ts`,
//   item secundário "Real Madrid will play a friendly match against
//   Schalke 04 on August 16").
// - Resultados de pré-temporada 2026 confirmados via reportagens oficiais
//   realmadrid.com/en-US/news/football/first-team/reports:
//   "Victory in Budapest" (08-08-2026): Ferencváros 1-2 Real Madrid.
//   "Draw in the first preseason match" (01-08-2026): Real Madrid 2-2 Fiorentina
//   (Wörthersee Stadion, Klagenfurt — sede neutra; tratado como home: false).
// - Abertura da LaLiga 2026-27: estreia do Real Madrid adiada para a 2ª jornada,
//   22/08 fora contra o Espanyol (jogadores na Copa do Mundo); jogo vs Real
//   Sociedad (1ª jornada) remarcado para 26/08 no Bernabéu.

export const nextMatch = {
  home: 'DEPORTIVO DE LA CORUÑA',
  away: 'REAL MADRID',
  dateISO: '2026-08-12T21:00:00+02:00',
  venue: 'Estadio Abanca-Riazor, A Coruña',
  competition: 'TROFEO TERESA HERRERA · PRE-SEASON FRIENDLY',
}

export const lastResults = [
  { opponent: 'FERENCVÁROS', score: '2–1', home: false },
  { opponent: 'FIORENTINA', score: '2–2', home: false },
]

export const leagueNote = 'LA LIGA 2026-27 · SEASON OPENS AUG 22 AT ESPANYOL'
