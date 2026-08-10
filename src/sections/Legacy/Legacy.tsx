import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { eras } from '../../data/legacy'

gsap.registerPlugin(ScrollTrigger)

export default function Legacy() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-era]')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${slides.length * 90}%`,
            pin: true,
            scrub: 0.5,
          },
        })
        slides.forEach((slide, i) => {
          if (i === 0) return
          tl.to(slides[i - 1], { opacity: 0, scale: 0.96, duration: 1 })
            .fromTo(slide, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1 }, '<0.3')
        })
        // parallax sutil: as fotos derivam dentro da moldura ao longo da seção
        // (scale-110 na img dá ±5% de folga; yPercent ±4 fica dentro dela)
        gsap.fromTo(
          '[data-era-img]',
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${slides.length * 90}%`,
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
      <p className="absolute top-[8vh] left-[8vw] z-10 text-sm tracking-[0.4em] opacity-50">03 — THE LEGACY</p>
      {eras.map((era, i) => (
        <div
          key={era.year}
          data-era
          className="absolute inset-0 flex items-center justify-between px-[10vw]"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <div className="max-w-[44vw]">
            <p className="font-display text-[13vw] leading-none">{era.year}</p>
            <p className="font-display text-[2.2vw] text-gold mt-2">{era.title}</p>
            <p className="mt-4 max-w-md text-sm opacity-70">{era.text}</p>
            <p className="mt-6 text-xs tracking-[0.4em] opacity-50">{era.stat}</p>
          </div>
          <div className="relative h-[72vh] w-[30vw] shrink-0 overflow-hidden">
            <img
              data-era-img
              src={`/assets/legacy/${era.year}.webp`}
              alt={era.title}
              onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')}
              className="h-full w-full scale-110 object-cover
                         [filter:grayscale(1)_sepia(0.35)_hue-rotate(190deg)_saturate(1.6)_brightness(0.85)]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-night/40" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-day/15" />
            <p className="absolute bottom-4 left-4 text-[10px] tracking-[0.3em] opacity-50">{era.year} — REAL MADRID CF</p>
          </div>
        </div>
      ))}
    </section>
  )
}
