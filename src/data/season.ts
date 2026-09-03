export type Competition = 'LALIGA' | 'CHAMPIONS'
export type MatchStatus = 'RESULT' | 'UPCOMING'

export type Match = {
  id: string
  dateISO: string
  competition: Competition
  round: string
  home: string
  away: string
  venue: string
  status: MatchStatus
  homeScore?: number
  awayScore?: number
}

export type Standing = {
  position: number
  club: string
  played: number
  won: number
  drawn: number
  lost: number
  goalDifference: number
  points: number
}

// Editorial snapshot. The UI consumes typed data so this file can later be
// replaced by a football API without changing MatchCentre.
export const seasonSnapshot = {
  season: '2026/27',
  updatedAt: '03 SEP 2026',
  sourceLabel: 'REAL MADRID · LALIGA',
}

export const matches: Match[] = [
  {
    id: 'esp-rma-2026-08-22',
    dateISO: '2026-08-22T21:30:00+02:00',
    competition: 'LALIGA',
    round: 'MATCHDAY 02',
    home: 'ESPANYOL',
    away: 'REAL MADRID',
    venue: 'RCDE Stadium, Barcelona',
    status: 'RESULT',
    homeScore: 1,
    awayScore: 2,
  },
  {
    id: 'rma-rso-2026-08-26',
    dateISO: '2026-08-26T21:00:00+02:00',
    competition: 'LALIGA',
    round: 'MATCHDAY 01',
    home: 'REAL MADRID',
    away: 'REAL SOCIEDAD',
    venue: 'Estadio Bernabéu, Madrid',
    status: 'RESULT',
    homeScore: 4,
    awayScore: 1,
  },
  {
    id: 'rma-mal-2026-08-30',
    dateISO: '2026-08-30T17:00:00+02:00',
    competition: 'LALIGA',
    round: 'MATCHDAY 03',
    home: 'REAL MADRID',
    away: 'MÁLAGA',
    venue: 'Estadio Bernabéu, Madrid',
    status: 'RESULT',
    homeScore: 4,
    awayScore: 0,
  },
  {
    id: 'bet-rma-2026-09-04',
    dateISO: '2026-09-04T21:00:00+02:00',
    competition: 'LALIGA',
    round: 'MATCHDAY 04',
    home: 'REAL BETIS',
    away: 'REAL MADRID',
    venue: 'La Cartuja, Seville',
    status: 'UPCOMING',
  },
  {
    id: 'rma-int-2026-09-08',
    dateISO: '2026-09-08T21:00:00+02:00',
    competition: 'CHAMPIONS',
    round: 'LEAGUE PHASE · 01',
    home: 'REAL MADRID',
    away: 'INTER MILAN',
    venue: 'Estadio Bernabéu, Madrid',
    status: 'UPCOMING',
  },
  {
    id: 'rma-ray-2026-09-12',
    dateISO: '2026-09-12T21:00:00+02:00',
    competition: 'LALIGA',
    round: 'MATCHDAY 05',
    home: 'REAL MADRID',
    away: 'RAYO VALLECANO',
    venue: 'Estadio Bernabéu, Madrid',
    status: 'UPCOMING',
  },
  {
    id: 'elc-rma-2026-09-15',
    dateISO: '2026-09-15T21:30:00+02:00',
    competition: 'LALIGA',
    round: 'MATCHDAY 06',
    home: 'ELCHE',
    away: 'REAL MADRID',
    venue: 'Martínez Valero, Elche',
    status: 'UPCOMING',
  },
  {
    id: 'atm-rma-2026-09-20',
    dateISO: '2026-09-20T16:15:00+02:00',
    competition: 'LALIGA',
    round: 'MATCHDAY 07',
    home: 'ATLÉTICO MADRID',
    away: 'REAL MADRID',
    venue: 'Metropolitano, Madrid',
    status: 'UPCOMING',
  },
  {
    id: 'rma-vil-2026-10-11',
    dateISO: '2026-10-11T18:00:00+02:00',
    competition: 'LALIGA',
    round: 'MATCHDAY 08 · TIME TBC',
    home: 'REAL MADRID',
    away: 'VILLARREAL',
    venue: 'Estadio Bernabéu, Madrid',
    status: 'UPCOMING',
  },
  {
    id: 'rom-rma-2026-10-14',
    dateISO: '2026-10-14T21:00:00+02:00',
    competition: 'CHAMPIONS',
    round: 'LEAGUE PHASE · 02',
    home: 'ROMA',
    away: 'REAL MADRID',
    venue: 'Stadio Olimpico, Rome',
    status: 'UPCOMING',
  },
  {
    id: 'rma-rbl-2026-10-21',
    dateISO: '2026-10-21T21:00:00+02:00',
    competition: 'CHAMPIONS',
    round: 'LEAGUE PHASE · 03',
    home: 'REAL MADRID',
    away: 'RB LEIPZIG',
    venue: 'Estadio Bernabéu, Madrid',
    status: 'UPCOMING',
  },
]

export const standings: Standing[] = [
  { position: 1, club: 'BARCELONA', played: 3, won: 3, drawn: 0, lost: 0, goalDifference: 10, points: 9 },
  { position: 2, club: 'REAL MADRID', played: 3, won: 3, drawn: 0, lost: 0, goalDifference: 8, points: 9 },
  { position: 3, club: 'ATLÉTICO MADRID', played: 3, won: 2, drawn: 1, lost: 0, goalDifference: 4, points: 7 },
  { position: 4, club: 'ALAVÉS', played: 3, won: 2, drawn: 1, lost: 0, goalDifference: 4, points: 7 },
  { position: 5, club: 'OSASUNA', played: 3, won: 2, drawn: 1, lost: 0, goalDifference: 2, points: 7 },
  { position: 6, club: 'SEVILLA', played: 3, won: 2, drawn: 0, lost: 1, goalDifference: 1, points: 6 },
  { position: 7, club: 'REAL BETIS', played: 3, won: 2, drawn: 0, lost: 1, goalDifference: -1, points: 6 },
]

export const nextMatch =
  matches.find((match) => match.status === 'UPCOMING' && new Date(match.dateISO).getTime() > Date.now()) ??
  matches.find((match) => match.status === 'UPCOMING') ??
  matches[matches.length - 1]
