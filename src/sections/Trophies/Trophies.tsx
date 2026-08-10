import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { trophies } from '../../data/trophies'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

// A sala de troféus: fotografia real do museu do clube como fundo em parallax
// (camada lenta) e os números monumentais na frente (camada rápida) — dois
// planos de profundidade, não uma tabela de estatísticas.
export default function Trophies() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-trophy]')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${slides.length * 100}%`,
            pin: true,
            scrub: 0.5,
          },
        })
        slides.forEach((slide, i) => {
          const counter = slide.querySelector('[data-count]') as HTMLElement
          const target = Number(counter.dataset.count)
          if (i > 0) {
            tl.to(slides[i - 1], { opacity: 0, yPercent: -8, duration: 1 })
            tl.fromTo(slide, { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 1 }, '<0.3')
          }
          tl.fromTo(
            counter,
            { innerText: 0 },
            { innerText: target, snap: { innerText: 1 }, duration: 1.2, ease: 'power1.out' },
            i === 0 ? 0 : '<0.2',
          )
        })
        // parallax do fundo: a sala atravessa a seção mais devagar que os números
        gsap.fromTo(
          '[data-room]',
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${slides.length * 100}%`,
              scrub: 0.6,
            },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="trophies" className="relative h-screen overflow-hidden text-day">
      <div className="absolute inset-0 overflow-hidden">
        <img
          data-room
          src="/assets/trophies/room.webp"
          alt="Real Madrid trophy room"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="h-full w-full object-cover opacity-35
                     [filter:grayscale(0.8)_sepia(0.35)_contrast(1.1)_brightness(0.55)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,7,15,0.9))]" />
      </div>
      <SectionLabel n="04" title="TROPHIES" className="absolute top-[8vh] left-[8vw] z-10" />
      {trophies.map((t, i) => (
        <div
          key={t.name}
          data-trophy
          className="absolute inset-0 z-10 flex items-center px-[10vw]"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <div>
            <p data-count={t.count} className="font-display text-[24vw] leading-none text-gold drop-shadow-[0_0_60px_rgba(201,162,75,0.35)]">
              {t.count}
            </p>
            <p className="font-display text-[3vw]">{t.name}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
