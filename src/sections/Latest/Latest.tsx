import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { headline, secondary } from '../../data/news'

gsap.registerPlugin(ScrollTrigger)

export default function Latest() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-news]', {
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="latest" className="min-h-screen py-[14vh] px-[8vw]">
      <p className="text-sm tracking-[0.4em] opacity-50">06 — LATEST</p>
      <article data-news className="mt-[6vh] border-b border-current/15 pb-10">
        <p className="text-xs tracking-[0.3em] text-gold">{headline.tag}</p>
        <h2 className="font-display text-[4.5vw] leading-tight mt-3 max-w-[70vw]">{headline.title}</h2>
      </article>
      <div className="grid grid-cols-3 gap-10 mt-10">
        {secondary.map((n) => (
          <article data-news key={n.title}>
            <p className="text-xs tracking-[0.3em] text-gold">{n.tag}</p>
            <h3 className="font-display text-2xl mt-2 leading-snug">{n.title}</h3>
          </article>
        ))}
      </div>
      <p className="mt-10 text-xs opacity-40">Headlines snapshot — realmadrid.com, 10 Aug 2026</p>
    </section>
  )
}
