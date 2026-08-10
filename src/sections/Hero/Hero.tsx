import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextMatch } from '../../data/match'
import { initSmoothScroll } from '../../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

// Abertura de filme, não landing page: um elemento principal (o nome do clube
// em escala monumental), fotografia do Bernabéu sangrando a borda direita como
// contraponto, e o resto em silêncio. Sem partículas, sem escudo decorativo.
export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power4.out' } })
          .fromTo('[data-photo]', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.4 }, 0.1)
          .from('[data-line]', { yPercent: 110, stagger: 0.14, duration: 1.1 }, 0.35)
          .from('[data-quiet]', { opacity: 0, duration: 0.9, ease: 'none' }, 1.1)
        // saída: o hero cede o palco conforme o scroll começa (transição p/ Matchday)
        gsap.to('[data-stage]', {
          yPercent: -12,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.4 },
        })
        gsap.to('[data-photo]', {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.4 },
        })
        gsap.to('[data-scrollcue-line]', {
          scaleY: 0.2,
          transformOrigin: 'top',
          repeat: -1,
          yoyo: true,
          duration: 1.2,
          ease: 'power1.inOut',
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const kickoff = new Date(nextMatch.dateISO)
  const dateLabel = kickoff.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()

  return (
    <section ref={root} id="hero" className="relative h-screen overflow-hidden">
      <div
        data-photo
        className="absolute right-0 top-[8vh] h-[84vh] w-[36vw] overflow-hidden"
        style={{ clipPath: 'inset(0 0 0 0%)' }}
      >
        <img
          src="/assets/bernabeu/aerial.webp"
          alt="Santiago Bernabéu"
          onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')}
          className="h-full w-full object-cover object-center
                     [filter:grayscale(1)_contrast(1.1)_brightness(1.05)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-day/15" />
        <p className="absolute bottom-4 left-4 text-[10px] tracking-[0.3em] text-ink/50">
          SANTIAGO BERNABÉU — MADRID
        </p>
      </div>

      <div data-stage className="relative z-10 flex h-full flex-col justify-center pl-[8vw]">
        <div className="overflow-hidden">
          <h1 data-line className="font-display text-[12.5vw] leading-[0.88] tracking-tight">REAL</h1>
        </div>
        <div className="overflow-hidden">
          <h1 data-line className="font-display text-[12.5vw] leading-[0.88] tracking-tight">MADRID</h1>
        </div>
        <div className="overflow-hidden mt-5">
          <p data-line className="font-display text-[2.6vw] text-gold">THE LEGACY NEVER STOPS.</p>
        </div>
        <p data-quiet className="mt-8 text-xs tracking-[0.35em] opacity-50">
          NEXT — {nextMatch.home} · {dateLabel} · {nextMatch.venue.split(',')[0].toUpperCase()}
        </p>
      </div>

      <button
        data-quiet
        onClick={() => initSmoothScroll().scrollTo('#matchday')}
        className="absolute bottom-10 left-[8vw] z-10 text-sm tracking-[0.3em] border-b border-ink pb-1 hover:text-gold hover:border-gold transition-colors"
      >
        NEXT MATCH →
      </button>

      <div data-quiet className="absolute bottom-10 right-[4vw] z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[0.4em] opacity-50">SCROLL</span>
        <span data-scrollcue-line className="block h-14 w-px bg-ink/60" />
      </div>
    </section>
  )
}
