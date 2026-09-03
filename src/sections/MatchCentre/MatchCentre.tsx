import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'
import {
  matches,
  nextMatch,
  seasonSnapshot,
  standings,
  type Competition,
  type Match,
} from '../../data/season'
import MatchPosterArt, { ClubBadge } from './MatchPosterArt'

gsap.registerPlugin(ScrollTrigger)

type View = 'MATCHES' | 'TABLE'
type CompetitionFilter = 'ALL' | Competition

const competitionLabels: Record<CompetitionFilter, string> = {
  ALL: 'ALL',
  LALIGA: 'LA LIGA',
  CHAMPIONS: 'CHAMPIONS',
}

function formatMatchDate(dateISO: string) {
  const date = new Date(dateISO)
  return {
    day: date.toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'Europe/Madrid' }),
    month: date.toLocaleDateString('en-GB', { month: 'short', timeZone: 'Europe/Madrid' }).toUpperCase(),
    time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }),
  }
}

function countdownTo(dateISO: string) {
  const distance = new Date(dateISO).getTime() - Date.now()
  if (distance <= 0) return 'MATCHDAY'
  const days = Math.floor(distance / 86_400_000)
  const hours = Math.floor((distance % 86_400_000) / 3_600_000)
  const minutes = Math.floor((distance % 3_600_000) / 60_000)
  return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`
}

function matchResult(match: Match) {
  if (match.status === 'UPCOMING') return '—'
  return `${match.homeScore} — ${match.awayScore}`
}

function clubName(name: string) {
  const words = name.split(' ')
  if (words.length === 1) return name
  return <>{words.slice(0, -1).join(' ')}<br />{words.at(-1)}</>
}

export default function MatchCentre() {
  const root = useRef<HTMLElement>(null)
  const [view, setView] = useState<View>('MATCHES')
  const [competition, setCompetition] = useState<CompetitionFilter>('ALL')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [countdown, setCountdown] = useState(() => countdownTo(nextMatch.dateISO))

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(countdownTo(nextMatch.dateISO)), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedMatch(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-match-reveal]',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-match-stage]', start: 'top 68%' },
        },
      )
      gsap.fromTo(
        '[data-season-panel]',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-season-panel]', start: 'top 78%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const filteredMatches = useMemo(
    () => matches.filter((match) => competition === 'ALL' || match.competition === competition),
    [competition],
  )
  const nextDate = formatMatchDate(nextMatch.dateISO)

  return (
    <section ref={root} id="match-centre" className="relative overflow-hidden bg-pure text-black">
      <div data-match-stage className="relative flex min-h-screen flex-col justify-between px-[6vw] pb-[6vh] pt-[15vh]">
        <ChapterMark n="08" title="MATCH CENTRE" right={`${seasonSnapshot.season} · LIVE LAYER`} tone="black" />

        <MatchPosterArt home={nextMatch.home} away={nextMatch.away} round={nextMatch.round} />

        <div data-match-reveal className="relative z-10 flex items-end justify-between border-b border-black/20 pb-[3vh] opacity-0">
          <div>
            <p className="t-label mb-4 text-black/55">NEXT MATCH · {nextMatch.round}</p>
            <p className="t-serif-i text-[3.2vw] text-black/65">The season is happening now.</p>
          </div>
          <div className="text-right">
            <p className="t-num text-[5.8vw] text-gold">{nextDate.day}</p>
            <p className="t-label mt-2 text-black/55">{nextDate.month} · {nextDate.time} CEST</p>
          </div>
        </div>

        <div data-match-reveal className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-[4vw] opacity-0">
          <div className="text-right">
            <p className="t-label mb-4 text-black/50">HOME</p>
            <h2 className="t-display text-[7.4vw]">{clubName(nextMatch.home)}</h2>
            <div className="mt-5 flex items-center justify-end gap-4">
              <p className="t-label text-black/50">{nextMatch.venue}</p>
              <ClubBadge club={nextMatch.home} light />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-[9vw] w-[9vw] items-center justify-center rounded-full border border-black/25">
              <span className="t-serif-i text-[2.2vw]">vs</span>
            </div>
            <span className="t-label mt-5 text-black/45">{countdown}</span>
          </div>

          <div>
            <p className="t-label mb-4 text-black/50">AWAY</p>
            <h2 className="t-display text-[7.4vw]">{clubName(nextMatch.away)}</h2>
            <div className="mt-5 flex items-center gap-4">
              <ClubBadge club={nextMatch.away} light />
              <p className="t-label text-black/50">{nextMatch.round}</p>
            </div>
          </div>
        </div>

        <div data-match-reveal className="relative z-10 grid grid-cols-3 border-y border-black/20 py-5 opacity-0">
          <p className="t-label text-black/55">VENUE <strong className="ml-5 text-black">{nextMatch.venue.split(',')[0]}</strong></p>
          <p className="t-label text-center text-black/55">COMPETITION <strong className="ml-5 text-black">{competitionLabels[nextMatch.competition]}</strong></p>
          <p className="t-label text-right text-black/55">FORM <strong className="ml-5 text-black">W · W · W</strong></p>
        </div>
      </div>

      <div data-season-panel className="relative min-h-screen bg-black px-[6vw] pb-[9vh] pt-[13vh] text-white opacity-0">
        <div className="flex items-end justify-between border-b border-silver/25 pb-7">
          <div>
            <p className="t-label text-gold">SEASON HUB · {seasonSnapshot.season}</p>
            <h2 className="t-display mt-5 text-[7vw]">EVERY NIGHT<br />MATTERS.</h2>
          </div>
          <div className="grid grid-cols-3 gap-[4vw] text-right">
            <div><p className="t-num text-[4vw]">03</p><p className="t-label mt-2">PLAYED</p></div>
            <div><p className="t-num text-[4vw]">10</p><p className="t-label mt-2">GOALS</p></div>
            <div><p className="t-num text-[4vw] text-gold">+08</p><p className="t-label mt-2">DIFF</p></div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div className="flex gap-8" aria-label="Season view">
            {(['MATCHES', 'TABLE'] as View[]).map((item) => (
              <button
                key={item}
                type="button"
                data-cursor="view"
                aria-pressed={view === item}
                onClick={() => setView(item)}
                className={`t-label border-b pb-2 transition-colors ${view === item ? 'border-gold text-gold' : 'border-transparent hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </div>

          {view === 'MATCHES' && (
            <div className="flex gap-6" aria-label="Competition filter">
              {(Object.keys(competitionLabels) as CompetitionFilter[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  data-cursor="view"
                  aria-pressed={competition === item}
                  onClick={() => setCompetition(item)}
                  className={`t-label transition-colors ${competition === item ? 'text-gold' : 'hover:text-white'}`}
                >
                  {competitionLabels[item]}
                </button>
              ))}
            </div>
          )}
        </div>

        {view === 'MATCHES' ? (
          <div className="mt-6" aria-live="polite">
            {filteredMatches.map((match) => {
              const date = formatMatchDate(match.dateISO)
              return (
                <button
                  key={match.id}
                  type="button"
                  data-cursor="view"
                  onClick={() => setSelectedMatch(match)}
                  className="group grid w-full grid-cols-[7vw_15vw_1fr_11vw] items-center border-t border-silver/20 py-[2.1vh] text-left transition-colors hover:bg-white hover:px-4 hover:text-black"
                >
                  <span className="t-num text-[2.2vw] text-gold">{date.day}</span>
                  <span className="t-label group-hover:text-black/55">{date.month} · {date.time}</span>
                  <span className="flex items-baseline gap-5">
                    <strong className="t-display-thin text-[2.1vw]">{match.home}</strong>
                    <span className="t-num text-[2.1vw]">{matchResult(match)}</span>
                    <strong className="t-display-thin text-[2.1vw]">{match.away}</strong>
                  </span>
                  <span className="t-label text-right group-hover:text-black/55">{match.competition}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="mt-7" aria-live="polite">
            <div className="grid grid-cols-[5vw_1fr_repeat(5,6vw)] border-y border-silver/25 py-4">
              {['POS', 'CLUB', 'P', 'W', 'D', 'GD', 'PTS'].map((label, index) => (
                <span key={label} className={`t-label ${index > 1 ? 'text-right' : ''}`}>{label}</span>
              ))}
            </div>
            {standings.map((standing) => {
              const isMadrid = standing.club === 'REAL MADRID'
              return (
                <div
                  key={standing.club}
                  className={`grid grid-cols-[5vw_1fr_repeat(5,6vw)] items-center border-b py-[2.2vh] ${isMadrid ? 'border-gold bg-gold text-black' : 'border-silver/20'}`}
                >
                  <span className="t-num pl-4 text-[2.5vw]">{String(standing.position).padStart(2, '0')}</span>
                  <span className="t-display-thin text-[2.1vw]">{standing.club}</span>
                  {[standing.played, standing.won, standing.drawn, standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference, standing.points].map((value, index) => (
                    <span key={`${standing.club}-${index}`} className="t-num text-right text-[1.8vw]">{value}</span>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <p className="t-label">DATA SNAPSHOT · {seasonSnapshot.updatedAt}</p>
          <p className="t-label">SOURCE · {seasonSnapshot.sourceLabel}</p>
        </div>
      </div>

      {selectedMatch && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-end bg-black/75 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMatch(null)
          }}
        >
          <article role="dialog" aria-modal="true" aria-label="Match details" className="relative h-full w-[48vw] bg-pure p-[6vw] text-black">
            <button
              type="button"
              data-cursor="view"
              onClick={() => setSelectedMatch(null)}
              className="t-label absolute right-[4vw] top-[5vh] border-b border-black pb-2 text-black"
            >
              CLOSE ×
            </button>
            <p className="t-label mt-[8vh] text-black/50">{selectedMatch.competition} · {selectedMatch.round}</p>
            <p className="t-num mt-10 text-[8vw] text-gold">{matchResult(selectedMatch)}</p>
            <h3 className="t-display mt-8 text-[5vw]">
              {selectedMatch.home}<br /><span className="text-black/25">VERSUS</span><br />{selectedMatch.away}
            </h3>
            <div className="mt-12 border-y border-black/20 py-7">
              <p className="t-label text-black/55">{formatMatchDate(selectedMatch.dateISO).day} {formatMatchDate(selectedMatch.dateISO).month} · {formatMatchDate(selectedMatch.dateISO).time} CEST</p>
              <p className="t-label mt-4 text-black/55">{selectedMatch.venue}</p>
            </div>
            <p className="t-serif-i mt-10 text-[2.6vw]">Every match adds another line to the story.</p>
          </article>
        </div>
      )}
    </section>
  )
}
