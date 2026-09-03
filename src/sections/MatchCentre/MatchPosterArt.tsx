type ClubTheme = {
  short: string
  accent: string
}

const clubThemes: Record<string, ClubTheme> = {
  'REAL BETIS': { short: 'RBB', accent: '#087a52' },
  'INTER MILAN': { short: 'INT', accent: '#1769aa' },
  'RAYO VALLECANO': { short: 'RAY', accent: '#d51f35' },
  ELCHE: { short: 'ELC', accent: '#168157' },
  'ATLÉTICO MADRID': { short: 'ATM', accent: '#bf1734' },
  VILLARREAL: { short: 'VIL', accent: '#d5b72b' },
  ROMA: { short: 'ROM', accent: '#8f2636' },
  'RB LEIPZIG': { short: 'RBL', accent: '#d4203f' },
}

export function ClubBadge({ club, light = false }: { club: string; light?: boolean }) {
  if (club === 'REAL MADRID') {
    return <img src="/assets/brand/real-madrid-crest.svg" alt="Real Madrid crest" className="h-11 w-11 object-contain" />
  }

  const theme = clubThemes[club] ?? { short: club.slice(0, 3), accent: '#777777' }
  return (
    <span
      aria-label={`${club} monogram`}
      className={`t-label flex h-11 w-11 items-center justify-center rounded-full border ${light ? 'bg-white/90 text-black' : 'bg-black text-white'}`}
      style={{ borderColor: theme.accent, boxShadow: `inset 0 0 0 3px ${theme.accent}22` }}
    >
      {theme.short}
    </span>
  )
}

export default function MatchPosterArt({
  home,
  away,
  round,
}: {
  home: string
  away: string
  round: string
}) {
  const opponent = home === 'REAL MADRID' ? away : home
  const opponentSide = home === 'REAL MADRID' ? 'right' : 'left'
  const theme = clubThemes[opponent] ?? { short: opponent.slice(0, 3), accent: '#777777' }
  const roundNumber = round.match(/\d+/)?.[0] ?? '01'

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-75"
        style={{
          background: `
            radial-gradient(circle at ${opponentSide === 'left' ? '27%' : '73%'} 57%, ${theme.accent}1f 0%, transparent 24%),
            radial-gradient(circle at ${opponentSide === 'left' ? '73%' : '27%'} 57%, rgba(184,155,94,.16) 0%, transparent 24%)
          `,
        }}
      />

      <div className="absolute left-1/2 top-[51%] h-[56vh] w-[29vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden [clip-path:polygon(50%_0,100%_25%,88%_100%,12%_100%,0_25%)]">
        <img
          src="/assets/film/lights.webp"
          alt=""
          className="h-full w-full scale-110 object-cover opacity-[0.13] [filter:grayscale(1)_contrast(1.35)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pure/35 via-transparent to-pure/80" />
      </div>

      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-45">
        <defs>
          <linearGradient id="match-poster-line" x1="0" x2="1">
            <stop offset="0" stopColor={theme.accent} stopOpacity="0" />
            <stop offset="0.5" stopColor={theme.accent} stopOpacity="0.45" />
            <stop offset="1" stopColor="#b89b5e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="800" cy="494" rx="190" ry="320" fill="none" stroke="url(#match-poster-line)" strokeWidth="1" />
        <ellipse cx="800" cy="494" rx="82" ry="138" fill="none" stroke="#080808" strokeOpacity="0.12" strokeWidth="1" />
        <path d="M610 788 L716 205 L884 205 L990 788 Z" fill="none" stroke="#080808" strokeOpacity="0.1" />
        <path d="M630 675 H970 M654 540 H946 M682 385 H918" fill="none" stroke="#080808" strokeOpacity="0.08" />
        <path d="M800 205 V788" fill="none" stroke="url(#match-poster-line)" strokeWidth="1" />
        <circle cx="800" cy="541" r="45" fill="none" stroke="#080808" strokeOpacity="0.12" />
        <path d="M0 720 L610 570 M1600 720 L990 570" fill="none" stroke="url(#match-poster-line)" strokeWidth="1" />
      </svg>

      <div
        className={`absolute top-[26vh] h-[58vh] w-[7vw] skew-x-[-14deg] opacity-[0.07] ${opponentSide === 'left' ? 'left-[16vw]' : 'right-[16vw]'}`}
        style={{ backgroundColor: theme.accent }}
      />
      <div
        className={`absolute top-[31vh] h-[48vh] w-px rotate-[14deg] opacity-35 ${opponentSide === 'left' ? 'left-[25vw]' : 'right-[25vw]'}`}
        style={{ backgroundColor: theme.accent }}
      />

      <span className="t-num outline-text-dark absolute -right-[3vw] top-[6vh] text-[39vw] text-transparent opacity-[0.12]">
        {roundNumber}
      </span>
      <p className="t-label absolute bottom-[11vh] left-1/2 -translate-x-1/2 text-[8px] text-black/20">
        MATCHDAY ARTWORK · {theme.short} / RMA
      </p>
    </div>
  )
}

