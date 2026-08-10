import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { trophies } from '../../data/trophies'

gsap.registerPlugin(ScrollTrigger)

const ASSET: Record<string, string> = {
  'EUROPEAN CUPS': 'european-cup',
  'LA LIGA': 'la-liga',
  'COPA DEL REY': 'copa-del-rey',
}

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
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="trophies" className="relative h-screen overflow-hidden text-day">
      <p className="absolute top-[8vh] left-[8vw] z-10 text-sm tracking-[0.4em] opacity-50">04 — TROPHIES</p>
      {trophies.map((t, i) => (
        <div
          key={t.name}
          data-trophy
          className="absolute inset-0 flex items-center justify-between px-[10vw]"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <div>
            <p data-count={t.count} className="font-display text-[24vw] leading-none text-gold">{t.count}</p>
            <p className="font-display text-[3vw]">{t.name}</p>
          </div>
          <img
            src={`/assets/trophies/${ASSET[t.name]}.webp`}
            alt={t.name}
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="h-[70vh] object-contain drop-shadow-[0_0_80px_rgba(201,162,75,0.25)]"
          />
        </div>
      ))}
    </section>
  )
}
