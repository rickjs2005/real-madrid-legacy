import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

const COLLECTION = [
  { n: '01', name: 'HOME KIT', note: 'The white. Since 1902.' },
  { n: '02', name: 'AWAY KIT', note: '2026-27 second jersey, by adidas.' },
  { n: '03', name: 'TRAINING', note: 'Valdebebas issue.' },
  { n: '04', name: 'LIFESTYLE', note: 'Off the pitch.' },
]

// Apresentação de coleção, não e-commerce: o kit vira tipografia monumental
// (fill + outline alternados) e as categorias viram um índice editorial em
// linhas — sem grid de cards, sem preços (concept: nada de dado inventado).
export default function Shop() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-kit-line]', {
          scrollTrigger: { trigger: root.current, start: 'top 60%' },
          yPercent: 110,
          stagger: 0.12,
          duration: 1,
          ease: 'power4.out',
        })
        gsap.from('[data-row]', {
          scrollTrigger: { trigger: '[data-index]', start: 'top 80%' },
          y: 26,
          opacity: 0,
          stagger: 0.09,
          duration: 0.7,
          ease: 'power3.out',
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="shop" className="min-h-screen py-[14vh] px-[8vw]">
      <SectionLabel n="07" title="SHOP" />

      <div className="mt-[6vh]">
        <div className="overflow-hidden">
          <h2 data-kit-line className="font-display text-[11vw] leading-[0.9]">THE NEW</h2>
        </div>
        <div className="overflow-hidden">
          <h2
            data-kit-line
            className="font-display text-[11vw] leading-[0.9]"
            style={{ WebkitTextStroke: '2px var(--color-ink)', color: 'transparent' }}
          >
            KIT
          </h2>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <p className="max-w-sm text-sm opacity-70">The 2026-27 collection, by adidas.</p>
          <p className="inline-block border-b border-current pb-1 text-sm tracking-[0.3em] hover:text-gold hover:border-gold transition-colors cursor-pointer">
            EXPLORE COLLECTION →
          </p>
        </div>
      </div>

      <div data-index className="mt-[10vh]">
        {COLLECTION.map((item) => (
          <div
            key={item.n}
            data-row
            className="group flex items-baseline justify-between border-t border-gold/30 py-6 transition-transform duration-300 hover:translate-x-3 cursor-pointer"
          >
            <div className="flex items-baseline gap-8">
              <span className="font-display text-sm text-gold">{item.n}</span>
              <span className="font-display text-4xl tracking-wide group-hover:text-gold transition-colors">
                {item.name}
              </span>
            </div>
            <span className="text-xs tracking-[0.2em] opacity-50">{item.note}</span>
          </div>
        ))}
        <div className="border-t border-gold/30" />
      </div>
    </section>
  )
}
