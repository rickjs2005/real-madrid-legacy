import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'

gsap.registerPlugin(ScrollTrigger)

export default function Eternal() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=440%', pin: true, scrub: 0.85 } })
        .fromTo('[data-eternal-bg]', { opacity: 0, scale: 1.14 }, { opacity: 0.48, scale: 1.03, duration: 0.3, ease: 'power2.out' }, 0)
        .fromTo('[data-eternal-badge]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.14)
        .fromTo('[data-eternal-crest]', { opacity: 0, scale: 0.78, rotate: -4 }, { opacity: 0.72, scale: 1, rotate: 0, duration: 0.14, ease: 'expo.out' }, 0.16)
        .fromTo('[data-eternal-title] .mask-line > span', { yPercent: 115 }, { yPercent: 0, stagger: 0.04, duration: 0.1, ease: 'expo.out' }, 0.28)
        .fromTo('[data-eternal-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.1, ease: 'power3.inOut' }, 0.48)
        .fromTo('[data-eternal-infinity]', { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1, duration: 0.12, ease: 'expo.out' }, 0.58)
        .to('[data-eternal-bg]', { opacity: 0.18, scale: 1, duration: 0.28, ease: 'none' }, 0.62)
        .to('[data-eternal-content]', { opacity: 0, duration: 0.08 }, 0.83)
        .fromTo('[data-eternal-signoff]', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.9)
        .fromTo('[data-eternal-signoff-crest]', { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1, duration: 0.08, ease: 'expo.out' }, 0.91)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="eternal" className="relative h-screen overflow-hidden bg-black text-white">
      <img data-eternal-bg src="/assets/bernabeu/aerial.webp" alt="Santiago Bernabéu" className="img-dominance absolute inset-0 h-full w-full object-cover opacity-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,8,0.05),#080808_78%)]" />
      <ChapterMark n="10" title="ETERNAL" right="1902 — ∞" />

      <div data-eternal-content className="absolute inset-0">
        <p data-eternal-badge className="t-serif-i absolute left-[6vw] top-[19vh] text-[4vw] text-silver opacity-0">Players leave. Nights fade.</p>
        <img
          data-eternal-crest
          src="/assets/brand/real-madrid-crest.svg"
          alt="Real Madrid crest"
          className="absolute right-[10vw] top-[18vh] h-[31vh] w-auto opacity-0 [filter:grayscale(1)_brightness(2.6)]"
        />
        <div className="absolute bottom-[7vh] left-[6vw] right-[6vw] z-10">
          <h2 data-eternal-title className="t-display text-[13vw] text-pure">
            <span className="mask-line block"><span className="block">The badge</span></span>
            <span className="mask-line block"><span className="block">remains.</span></span>
          </h2>
          <div data-eternal-rule className="rule mt-6 origin-left" />
          <div className="mt-5 flex justify-between">
            <span className="t-label">HALA MADRID</span>
            <span className="t-label">THE ETERNAL CLUB</span>
          </div>
        </div>
        <div data-eternal-infinity className="pointer-events-none absolute right-[5vw] top-[10vh] opacity-0">
          <p className="t-num text-[19vw] text-gold">1902—∞</p>
        </div>
      </div>

      <div data-eternal-signoff className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black opacity-0">
        <img
          data-eternal-signoff-crest
          src="/assets/brand/real-madrid-crest.svg"
          alt="Real Madrid crest"
          className="mb-8 h-[18vh] w-auto opacity-0"
        />
        <p className="t-serif-i text-[4vw] text-silver">Hala Madrid.</p>
        <p className="t-display mt-4 text-[12vw] text-pure">ETERNAL.</p>
        <div className="rule my-10 w-[30vw]" />
        <p className="t-label">A CONCEPT EXPERIENCE BY MILWEB · 2026</p>
        <p className="t-label absolute bottom-[4vh] text-[8px] tracking-[0.24em] opacity-45">
          UNOFFICIAL PORTFOLIO CONCEPT · NOT AFFILIATED WITH REAL MADRID C.F.
        </p>
      </div>
    </section>
  )
}
