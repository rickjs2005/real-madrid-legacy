import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextMatch, lastResults, leagueNote } from '../../data/match'
import { countdownParts } from '../../lib/countdown'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

// score é armazenado sempre RM-first (ver src/data/match.ts); em jogo fora,
// os dígitos invertem para acompanhar a ordem visitante–mandante do label.
function displayScore(score: string, home: boolean) {
  if (home) return score
  const [rm, opponent] = score.split('–')
  return `${opponent}–${rm}`
}

// Composição de evento/transmissão: os dois nomes em escala desigual
// (assimetria editorial), o countdown como elemento dominante e os metadados
// como "lower third" de broadcast — uma única linha na base.
export default function Matchday() {
  const root = useRef<HTMLElement>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-club-home]', {
          scrollTrigger: { trigger: root.current, start: 'top 65%' },
          xPercent: -18,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
        })
        gsap.from('[data-club-away]', {
          scrollTrigger: { trigger: root.current, start: 'top 65%' },
          xPercent: 18,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
        })
        gsap.from('[data-count]', {
          scrollTrigger: { trigger: root.current, start: 'top 55%' },
          scale: 1.08,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        })
        gsap.from('[data-lowerthird]', {
          scrollTrigger: { trigger: root.current, start: 'top 40%' },
          y: 20,
          opacity: 0,
          duration: 0.8,
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const cd = countdownParts(nextMatch.dateISO, now)
  const kickoff = new Date(nextMatch.dateISO)

  return (
    <section ref={root} id="matchday" className="flex min-h-screen flex-col justify-between py-[10vh] px-[8vw]">
      <SectionLabel n="01" title="MATCHDAY" />

      <div className="mt-[4vh]">
        <p data-club-home className="font-display text-2xl text-gold mb-3">NEXT MATCH</p>
        <h2 data-club-home className="font-display text-[6vw] leading-[0.95] whitespace-nowrap">
          {nextMatch.home}
        </h2>
        <div className="mt-1 flex items-start gap-6">
          <span className="font-display text-[1.8vw] text-gold pt-[0.8vw]">VS</span>
          <h2 data-club-away className="font-display text-[6vw] leading-[0.95] whitespace-nowrap">
            {nextMatch.away}
          </h2>
        </div>
      </div>

      <div data-count className="self-center text-center">
        <p className="text-xs tracking-[0.4em] opacity-50">KICK-OFF IN</p>
        <p className="font-display text-[7vw] leading-none text-gold mt-2">
          {cd ? `${cd.days}D ${cd.hours}H ${cd.minutes}M` : 'MATCHDAY'}
        </p>
      </div>

      <div data-lowerthird className="border-t border-gold/40 pt-6">
        <div className="flex items-baseline justify-between gap-8 text-sm">
          <p>
            <span className="text-xs tracking-[0.3em] opacity-50 mr-3">KICK-OFF</span>
            <span className="font-display text-xl">
              {kickoff.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()} ·{' '}
              {kickoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
          <p>
            <span className="text-xs tracking-[0.3em] opacity-50 mr-3">VENUE</span>
            <span className="font-display text-xl">{nextMatch.venue}</span>
          </p>
          <p>
            <span className="text-xs tracking-[0.3em] opacity-50 mr-3">COMPETITION</span>
            <span className="font-display text-xl">{nextMatch.competition}</span>
          </p>
        </div>
        <div className="mt-4 flex items-baseline justify-between text-xs opacity-60">
          <p className="tracking-[0.2em]">
            LAST —{' '}
            {lastResults
              .map((r) =>
                r.home
                  ? `RMA ${displayScore(r.score, r.home)} ${r.opponent.slice(0, 3).toUpperCase()}`
                  : `${r.opponent.slice(0, 3).toUpperCase()} ${displayScore(r.score, r.home)} RMA`,
              )
              .join(' · ')}
          </p>
          <p className="tracking-[0.3em]">{leagueNote}</p>
        </div>
      </div>
    </section>
  )
}
