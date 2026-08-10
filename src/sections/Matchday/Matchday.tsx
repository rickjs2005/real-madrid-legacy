import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextMatch, lastResults, leagueNote } from '../../data/match'
import { countdownParts } from '../../lib/countdown'

gsap.registerPlugin(ScrollTrigger)

// `score` is always stored "Real Madrid–opponent" (see src/data/match.ts).
// Labels render RMA on the side matching `home`, so when RM is away/neutral
// (home: false) the opponent sits on the left — the score digits must flip
// to "opponent–Real Madrid" to keep matching the label order left-to-right.
function displayScore(score: string, home: boolean) {
  if (home) return score
  const [rm, opponent] = score.split('–')
  return `${opponent}–${rm}`
}

export default function Matchday() {
  const root = useRef<HTMLElement>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-club]', {
        scrollTrigger: { trigger: root.current, start: 'top 60%' },
        xPercent: (i) => (i === 0 ? -40 : 40),
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.from('[data-meta]', {
        scrollTrigger: { trigger: root.current, start: 'top 50%' },
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const cd = countdownParts(nextMatch.dateISO, now)
  const kickoff = new Date(nextMatch.dateISO)

  return (
    <section ref={root} id="matchday" className="min-h-screen py-[12vh] px-[8vw]">
      <p className="text-sm tracking-[0.4em] opacity-50">01 — MATCHDAY</p>
      <div className="mt-[8vh] flex items-center justify-between">
        <h2 data-club className="font-display text-[6.5vw] leading-none">{nextMatch.home}</h2>
        <span className="font-display text-[3vw] text-gold">VS</span>
        <h2 data-club className="font-display text-[6.5vw] leading-none text-right">{nextMatch.away}</h2>
      </div>
      <div className="mt-[8vh] grid grid-cols-4 gap-8 border-t border-current/15 pt-8">
        <div data-meta>
          <p className="text-xs tracking-[0.3em] opacity-50">KICK-OFF</p>
          <p className="font-display text-3xl mt-2">
            {kickoff.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()} —{' '}
            {kickoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div data-meta>
          <p className="text-xs tracking-[0.3em] opacity-50">VENUE</p>
          <p className="font-display text-2xl mt-2">{nextMatch.venue}</p>
        </div>
        <div data-meta>
          <p className="text-xs tracking-[0.3em] opacity-50">COMPETITION</p>
          <p className="font-display text-2xl mt-2">{nextMatch.competition}</p>
        </div>
        <div data-meta>
          <p className="text-xs tracking-[0.3em] opacity-50">COUNTDOWN</p>
          <p className="font-display text-3xl mt-2 text-gold">
            {cd ? `${cd.days}D ${cd.hours}H ${cd.minutes}M` : 'MATCHDAY'}
          </p>
        </div>
      </div>
      <div className="mt-[6vh] flex items-end justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] opacity-50">LAST RESULTS</p>
          {lastResults.map((r) => (
            <p key={r.opponent} className="mt-2 font-display text-xl">
              {r.home ? 'RMA' : r.opponent.slice(0, 3).toUpperCase()} {displayScore(r.score, r.home)}{' '}
              {r.home ? r.opponent.slice(0, 3).toUpperCase() : 'RMA'}
            </p>
          ))}
        </div>
        <p className="text-sm tracking-[0.3em] opacity-50">{leagueNote}</p>
      </div>
    </section>
  )
}
