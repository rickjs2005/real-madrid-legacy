import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { founded } from '../../data/legacy'
import { trophies } from '../../data/trophies'
import { initSmoothScroll } from '../../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

// Los Blancos: pôster branco monumental. O nome do clube em tinta sobre branco,
// a fotografia da noite europeia como faixa editorial entre listras douradas, e
// o nome atravessando POR CIMA da faixa (sanduíche). No scroll, a faixa cresce
// e escurece — um gostinho da noite que só volta inteira no Bernabéu.
export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const europeanCups = trophies.find((t) => t.name === 'EUROPEAN CUPS')?.count ?? 15

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power4.out' } })
          .fromTo('[data-hero-band]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power2.inOut' }, 0.1)
          .from('[data-line]', { yPercent: 110, stagger: 0.14, duration: 1.1 }, 0.5)
          .from('[data-quiet]', { opacity: 0, duration: 0.9, ease: 'none' }, 1.4)
        // transformação: a faixa avança e o texto cede — prenúncio da noite
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=80%',
            pin: true,
            scrub: 0.5,
          },
        })
          .to('[data-hero-band] img', { scale: 1.18, ease: 'none' }, 0)
          .to('[data-hero-title]', { yPercent: -30, ease: 'none' }, 0)
          .to('[data-hero-tag]', { opacity: 0, duration: 0.4 }, 0.1)
          .to('[data-quiet]', { opacity: 0, duration: 0.35 }, 0.5)
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

  return (
    <section ref={root} id="hero" className="relative h-screen overflow-hidden bg-day">
      {/* faixa fotográfica editorial entre listras douradas */}
      <div data-hero-band className="absolute left-0 right-0 top-[24vh] z-0 h-[46vh] overflow-hidden border-y border-gold/50">
        <img
          src="/assets/hero/stadium-night.webp"
          alt="Santiago Bernabéu on a European night"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="h-full w-full object-cover object-center
                     [filter:grayscale(0.85)_sepia(0.2)_contrast(1.1)_brightness(0.9)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-day/10" />
      </div>

      <div data-hero-title className="relative z-10 flex h-full flex-col justify-center pl-[8vw]">
        <div className="overflow-hidden">
          <h1 data-line className="font-display text-[13vw] leading-[0.86] tracking-tight">REAL</h1>
        </div>
        <div className="overflow-hidden">
          <h1 data-line className="font-display text-[13vw] leading-[0.86] tracking-tight">MADRID</h1>
        </div>
        <div className="overflow-hidden mt-5">
          <p data-line data-hero-tag className="font-display text-[2.4vw] text-gold">THE LEGACY NEVER STOPS.</p>
        </div>
      </div>

      <div data-quiet className="absolute bottom-10 left-[8vw] z-10">
        <p className="text-[10px] tracking-[0.4em] opacity-60">EST. {founded}</p>
        <p className="font-display text-2xl mt-2">
          <span className="text-gold">{europeanCups}</span> EUROPEAN CUPS
        </p>
      </div>

      <button
        data-quiet
        onClick={() => initSmoothScroll().scrollTo('#matchday')}
        className="absolute bottom-10 right-[4vw] z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.4em] opacity-60">SCROLL TO ENTER</span>
        <span data-scrollcue-line className="block h-14 w-px bg-gold" />
      </button>
    </section>
  )
}
