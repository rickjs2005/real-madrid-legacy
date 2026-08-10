import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { nextMatch } from '../../data/match'
import { initSmoothScroll } from '../../lib/lenis'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-line]', {
        yPercent: 110,
        stagger: 0.12,
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.2,
      })
      gsap.to('[data-particle]', {
        y: -30,
        opacity: 0,
        stagger: { each: 0.4, repeat: -1 },
        duration: 3,
        ease: 'none',
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const scrollToMatch = () => {
    initSmoothScroll().scrollTo('#matchday')
  }

  const dateLabel = new Date(nextMatch.dateISO)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    .toUpperCase()

  return (
    <section ref={root} id="hero" className="relative h-screen overflow-hidden">
      <img
        src="/assets/hero/crest.webp"
        alt=""
        onError={(e) => (e.currentTarget.style.display = 'none')}
        className="absolute right-[8vw] top-1/2 w-[22vw] -translate-y-1/2 opacity-15"
      />
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          data-particle
          className="absolute size-1 rounded-full bg-gold/60"
          style={{ left: `${(i * 137) % 100}%`, top: `${(i * 61) % 100}%` }}
        />
      ))}
      <div className="flex h-full flex-col justify-center pl-[8vw]">
        <div className="overflow-hidden">
          <h1 data-line className="font-display text-[11vw] leading-[0.9] tracking-tight">REAL MADRID</h1>
        </div>
        <div className="overflow-hidden">
          <p data-line className="font-display text-[3.2vw] text-gold">THE LEGACY NEVER STOPS.</p>
        </div>
        <div className="overflow-hidden mt-6">
          <p data-line className="text-sm tracking-[0.3em] opacity-60">
            {nextMatch.competition} · {dateLabel}
          </p>
        </div>
      </div>
      <button
        onClick={scrollToMatch}
        className="absolute bottom-10 left-[8vw] text-sm tracking-[0.3em] border-b border-ink pb-1 hover:text-gold hover:border-gold transition-colors"
      >
        NEXT MATCH →
      </button>
    </section>
  )
}
