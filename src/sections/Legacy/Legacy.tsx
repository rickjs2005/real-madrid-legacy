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
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <img
            src={`/assets/legacy/${era.year}.webp`}
            alt=""
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="absolute inset-0 h-full w-full object-cover opacity-25
                       [filter:grayscale(1)_sepia(0.4)_hue-rotate(190deg)]"
          />
          <div className="relative text-center">
            <p className="font-display text-[18vw] leading-none">{era.year}</p>
            <p className="font-display text-[2vw] text-gold mt-2">{era.title}</p>
            <p className="mx-auto mt-4 max-w-md text-sm opacity-70">{era.text}</p>
            <p className="mt-6 text-xs tracking-[0.4em] opacity-50">{era.stat}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
