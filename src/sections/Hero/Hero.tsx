import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { founded } from '../../data/legacy'
import { trophies } from '../../data/trophies'
import { initSmoothScroll } from '../../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

// Cold open de documentário: a noite europeia em viewport inteira, REAL MADRID
// em branco-osso monumental sobre o canto mais escuro da fotografia (um único
// ponto focal), duas assinaturas e nada mais. Na carga, a cena revela do preto;
// no scroll, a foto avança e um véu branco amanhece — match-cut para o mundo
// branco do site. A noite só volta no clímax (Bernabéu): bookends.
export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const europeanCups = trophies.find((t) => t.name === 'EUROPEAN CUPS')?.count ?? 15

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // abertura de filme: preto → estádio → nome → tagline → assinaturas
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('[data-blackveil]', { opacity: 1 }, { opacity: 0, duration: 1.5, ease: 'power2.inOut' }, 0)
          .fromTo('[data-hero-photo]', { scale: 1.18 }, { scale: 1.06, duration: 2.4, ease: 'power2.out' }, 0)
          .from('[data-line]', { yPercent: 110, stagger: 0.16, duration: 1.1, ease: 'power4.out' }, 0.8)
          .from('[data-quiet]', { opacity: 0, duration: 0.9, ease: 'none' }, 1.9)
        // transformação: a foto avança, o nome sai, o dia amanhece → MATCHDAY
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 0.5,
          },
        })
          .to('[data-hero-photo]', { scale: 1.3, ease: 'none' }, 0)
          .to('[data-hero-title]', { yPercent: -70, ease: 'none' }, 0)
          .to('[data-hero-tag]', { opacity: 0, duration: 0.3 }, 0.05)
          .to('[data-quiet]', { opacity: 0, duration: 0.3 }, 0.4)
          .fromTo('[data-dayveil]', { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.in' }, 0.55)
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
    <section ref={root} id="hero" className="relative h-screen overflow-hidden bg-night text-day">
      {/* a noite europeia em tela cheia */}
      <div data-hero-photo className="absolute inset-0">
        <img
          src="/assets/hero/stadium-night.webp"
          alt="Santiago Bernabéu on a European night"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="h-full w-full object-cover
                     [filter:grayscale(0.3)_sepia(0.15)_contrast(1.15)_brightness(0.8)]"
        />
        {/* vinheta + peso no canto inferior esquerdo, onde vive a tipografia */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,7,15,0.7))]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-night/85 via-night/25 to-transparent" />
      </div>

      {/* nome monumental: Los Blancos sobre a noite — o único ponto focal */}
      <div data-hero-title className="absolute bottom-[14vh] left-[8vw] z-10">
        <div className="overflow-hidden">
          <h1 data-line className="font-display text-[15vw] leading-[0.84] tracking-tight">REAL</h1>
        </div>
        <div className="overflow-hidden">
          <h1 data-line className="font-display text-[15vw] leading-[0.84] tracking-tight">MADRID</h1>
        </div>
        <div className="overflow-hidden mt-5">
          <p data-line data-hero-tag className="font-display text-[2.2vw] text-gold-bright">THE LEGACY NEVER STOPS.</p>
        </div>
      </div>

      <p data-quiet className="absolute bottom-8 left-[8vw] z-10 text-[11px] tracking-[0.4em] opacity-70">
        EST. {founded}
      </p>
      <p data-quiet className="absolute bottom-8 right-[16vw] z-10 text-[11px] tracking-[0.4em] opacity-70">
        <span className="font-display text-lg tracking-normal text-gold-bright">{europeanCups}</span>{'  '}EUROPEAN CUPS
      </p>

      <button
        data-quiet
        onClick={() => initSmoothScroll().scrollTo('#matchday')}
        className="absolute bottom-8 right-[4vw] z-10 flex flex-col items-center gap-3"
      >
        <span className="sr-only">Scroll to next section</span>
        <span data-scrollcue-line className="block h-16 w-px bg-day/80" />
      </button>

      {/* véus: preto (abertura) e branco (amanhecer para o MATCHDAY) */}
      <div data-blackveil className="pointer-events-none absolute inset-0 z-30 bg-night opacity-0" />
      <div data-dayveil className="pointer-events-none absolute inset-0 z-30 bg-day opacity-0" />
    </section>
  )
}
