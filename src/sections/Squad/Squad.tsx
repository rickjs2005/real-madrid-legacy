import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { players } from '../../data/squad'

gsap.registerPlugin(ScrollTrigger)

export default function Squad() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = root.current!.querySelector('[data-track]') as HTMLElement
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="squad" className="overflow-hidden text-day">
      <div data-track className="flex h-screen w-max">
        {players.map((p) => (
          <article key={p.index} className="group relative flex h-screen w-screen shrink-0 items-center px-[8vw]">
            <img
              src={`/assets/squad/p${p.index}.webp`}
              alt={p.name}
              onError={(e) => (e.currentTarget.style.display = 'none')}
              className="absolute right-[10vw] bottom-0 h-[88vh] object-contain object-bottom
                         [filter:grayscale(1)_sepia(0.3)_hue-rotate(190deg)_saturate(2)_brightness(0.8)]
                         transition-[filter] duration-500 group-hover:[filter:none]"
            />
            <div className="relative">
              <p className="font-display text-[2vw] text-gold">{p.index}</p>
              <h2 className="font-display text-[9vw] leading-[0.9]">{p.name}</h2>
              <p className="mt-2 text-sm tracking-[0.4em] opacity-60">{p.position}</p>
              <div className="mt-8 max-w-xs opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="flex gap-10 border-t border-day/20 pt-4">
                  <div>
                    <p className="text-xs tracking-[0.3em] opacity-50">NUMBER</p>
                    <p className="font-display text-4xl text-gold">{p.number}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] opacity-50">NATION</p>
                    <p className="font-display text-2xl">{p.nationality}</p>
                  </div>
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs tracking-[0.3em] opacity-50">{s.label}</p>
                      <p className="font-display text-2xl">{s.value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm tracking-[0.3em] border-b border-day/40 pb-1 inline-block">VIEW PLAYER →</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
