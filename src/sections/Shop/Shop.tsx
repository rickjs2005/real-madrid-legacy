import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = ['HOME KIT', 'AWAY KIT', 'TRAINING', 'LIFESTYLE']

export default function Shop() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-kit]',
        { scale: 1.15, yPercent: 6 },
        {
          scale: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 0.5 },
        },
      )
      gsap.from('[data-cat]', {
        scrollTrigger: { trigger: '[data-cats]', start: 'top 80%' },
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="shop" className="min-h-screen py-[14vh] px-[8vw]">
      <p className="text-sm tracking-[0.4em] opacity-50">07 — SHOP</p>
      <div className="mt-[6vh] grid grid-cols-2 items-center gap-16">
        <div>
          <h2 className="font-display text-[7vw] leading-[0.9]">THE NEW<br />KIT</h2>
          <p className="mt-6 max-w-sm text-sm opacity-70">The 2026-27 second jersey, by adidas.</p>
          <p className="mt-8 inline-block border-b border-current pb-1 text-sm tracking-[0.3em] hover:text-gold hover:border-gold transition-colors cursor-pointer">
            EXPLORE COLLECTION →
          </p>
        </div>
        <div className="overflow-hidden">
          <img
            data-kit
            src="/assets/shop/kit-away.webp"
            alt="Real Madrid 2026-27 away kit"
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="w-full object-contain"
          />
        </div>
      </div>
      <div data-cats className="mt-[10vh] grid grid-cols-4 border-t border-current/15">
        {CATEGORIES.map((c) => (
          <p key={c} data-cat className="py-8 font-display text-2xl tracking-wide border-r border-current/15 last:border-r-0 pl-6 hover:text-gold transition-colors cursor-pointer">
            {c}
          </p>
        ))}
      </div>
    </section>
  )
}
