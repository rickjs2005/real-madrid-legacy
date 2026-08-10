import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { eras, yearsOfHistory } from '../../data/legacy'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

// Grain estático via SVG inline — custo de paint fixo, sem asset externo
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Tratamento de época: P&B, contraste alto, tom quente — dourado fica só nos acentos
const ERA_FILTER = '[filter:grayscale(1)_contrast(1.15)_sepia(0.3)_brightness(0.88)]'

export default function Legacy() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-era]')
        const rail = gsap.utils.toArray<HTMLElement>('[data-rail]')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${slides.length * 80}%`,
            pin: true,
            scrub: 0.5,
          },
        })
        slides.forEach((slide, i) => {
          if (i === 0) return
          tl.to(slides[i - 1], { opacity: 0, scale: 0.97, duration: 1 })
            .fromTo(slide, { opacity: 0 }, { opacity: 1, duration: 1 }, '<0.3')
          const frame = slide.querySelector<HTMLElement>('[data-frame]')
          if (frame) {
            tl.fromTo(
              frame,
              { clipPath: 'inset(0 0 100% 0)' },
              { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power2.out' },
              '<0.1',
            )
            // a foto cresce lentamente enquanto a era está em cena
            tl.fromTo(frame.querySelector('img'), { scale: 1.02 }, { scale: 1.14, duration: 1.8, ease: 'none' }, '<')
          }
          const lines = slide.querySelectorAll('[data-line]')
          if (lines.length) tl.fromTo(lines, { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, '<0.15')
          // trilho: destaca o ano da era atual
          const eraIdx = i - 1
          if (eraIdx >= 0 && eraIdx < rail.length) {
            if (eraIdx > 0) tl.to(rail[eraIdx - 1], { opacity: 0.35, color: '#f5f4f0', duration: 0.3 }, '<')
            tl.to(rail[eraIdx], { opacity: 1, color: '#c9a24b', duration: 0.3 }, '<')
          }
        })
        // linha de progresso do trilho acompanha a travessia inteira
        gsap.fromTo(
          '[data-rail-line]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${slides.length * 80}%`,
              scrub: 0.5,
            },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="legacy" className="relative h-screen overflow-hidden text-day">
      <SectionLabel n="03" title="THE LEGACY" className="absolute top-[8vh] left-[8vw] z-10" />

      <div className="absolute left-[4vw] top-1/2 z-10 -translate-y-1/2">
        <div className="absolute -left-3 top-0 h-full w-px bg-day/15" />
        <div data-rail-line className="absolute -left-3 top-0 h-full w-px bg-gold" style={{ transform: 'scaleY(0)' }} />
        <ul className="flex flex-col gap-5">
          {eras.map((e) => (
            <li key={e.year} data-rail className="font-display text-[11px] tracking-[0.25em] opacity-35">
              {e.year}
            </li>
          ))}
        </ul>
      </div>

      <div data-era className="absolute inset-0 flex items-center justify-center">
        <img
          src="/assets/legacy/1902.webp"
          alt=""
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className={`absolute inset-0 h-full w-full object-cover opacity-15 ${ERA_FILTER}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,7,15,0.85))]" />
        <div className="relative text-center">
          <p className="text-xs tracking-[0.4em] opacity-50">FOUNDED 1902</p>
          <p className="font-display text-[9vw] leading-none mt-4">{yearsOfHistory} YEARS</p>
          <p className="font-display text-[2.4vw] text-gold mt-2">OF IMPOSSIBLE MOMENTS</p>
        </div>
      </div>

      {eras.map((era, i) => (
        <div
          key={era.year}
          data-era
          className="absolute inset-0 flex items-center justify-between pl-[12vw] pr-[10vw]"
          style={{ opacity: 0 }}
        >
          {/* sobreposição editorial: a era anterior espia por trás da moldura
              em alguns capítulos (spread de revista, não scrapbook) */}
          {[1, 4, 7].includes(i) && (
            <div className="absolute right-[34vw] top-[15vh] h-[34vh] w-[13vw] overflow-hidden opacity-60">
              <img
                src={`/assets/legacy/${eras[i - 1].year}.webp`}
                alt=""
                onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')}
                className={`h-full w-full object-cover ${ERA_FILTER} brightness-[0.6]`}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-day/10" />
            </div>
          )}
          <div className="max-w-[42vw]">
            <p data-line className="font-display text-[15vw] leading-none">{era.year}</p>
            <p data-line className="font-display text-[2.2vw] text-gold mt-2">{era.title}</p>
            <p data-line className="mt-4 max-w-md text-sm opacity-70">{era.text}</p>
            <p data-line className="mt-6 text-xs tracking-[0.4em] opacity-50">{era.stat}</p>
          </div>
          <div data-frame className="relative h-[72vh] w-[30vw] shrink-0 overflow-hidden">
            <img
              src={`/assets/legacy/${era.year}.webp`}
              alt={era.title}
              onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')}
              className={`h-full w-full object-cover ${ERA_FILTER}`}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,7,15,0.6))]" />
            <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-day/15" />
            <p className="absolute bottom-4 left-4 text-[10px] tracking-[0.3em] opacity-50">{era.year} — {era.place}</p>
          </div>
        </div>
      ))}

      <div data-era className="absolute inset-0 flex items-center justify-center text-center" style={{ opacity: 0 }}>
        <div>
          <p data-line className="font-display text-[16vw] leading-none text-gold">15</p>
          <p data-line className="font-display text-[3vw]">EUROPEAN CUPS</p>
          <p data-line className="mt-6 text-sm tracking-[0.3em] opacity-70">AND THE STORY IS STILL BEING WRITTEN.</p>
          <p data-line className="mt-10 text-2xl opacity-50">↓</p>
        </div>
      </div>
    </section>
  )
}
