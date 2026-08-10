import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { founded } from '../../data/legacy'
import { trophies } from '../../data/trophies'
import { initSmoothScroll } from '../../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

// Pôster cinematográfico: fotografia noturna do Bernabéu em viewport inteira,
// tipografia monumental por cima, e SÓ identidade — nada de próximo jogo aqui
// (futebol é papel do MATCHDAY). No scroll, o hero não termina: a foto cresce,
// o texto se desloca e a seção se transforma na próxima.
export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const europeanCups = trophies.find((t) => t.name === 'EUROPEAN CUPS')?.count ?? 15

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // entrada: a foto respira, o nome sobe por máscaras, o resto em silêncio
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('[data-hero-photo]', { scale: 1.1, opacity: 0.4 }, { scale: 1.04, opacity: 1, duration: 1.8, ease: 'power2.out' }, 0)
          .from('[data-line]', { yPercent: 110, stagger: 0.14, duration: 1.1, ease: 'power4.out' }, 0.5)
          .from('[data-quiet]', { opacity: 0, duration: 0.9, ease: 'none' }, 1.3)
        // transformação: pin curto em que a foto avança e o texto cede o palco
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=90%',
            pin: true,
            scrub: 0.5,
          },
        })
          .to('[data-hero-photo]', { scale: 1.16, ease: 'none' }, 0)
          .to('[data-hero-title]', { yPercent: -36, ease: 'none' }, 0)
          .to('[data-hero-tag]', { opacity: 0, duration: 0.4 }, 0.1)
          .to('[data-quiet]', { opacity: 0, duration: 0.35 }, 0.55)
          .to('[data-hero-veil]', { opacity: 0.85, duration: 0.5 }, 0.4)
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
    <section ref={root} id="hero" className="relative h-screen overflow-hidden text-day">
      <div data-hero-photo className="absolute inset-0">
        <img
          src="/assets/hero/stadium-night.webp"
          alt="Santiago Bernabéu on a European night"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="h-full w-full object-cover
                     [filter:grayscale(0.35)_sepia(0.15)_contrast(1.12)_brightness(0.72)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,7,15,0.75))]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/40" />
      </div>
      {/* véu que escurece a cena na transformação para o MATCHDAY */}
      <div data-hero-veil className="pointer-events-none absolute inset-0 z-20 bg-night opacity-0" />

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
        <span data-scrollcue-line className="block h-14 w-px bg-day/70" />
      </button>
    </section>
  )
}
