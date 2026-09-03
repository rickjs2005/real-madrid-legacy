import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'

gsap.registerPlugin(ScrollTrigger)

export default function NinetyMinutes() {
  const root = useRef<HTMLElement>(null)
  const clock = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const state = { value: 0 }
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=420%', pin: true, scrub: 0.75 },
        })
        .fromTo('[data-90-clock]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.04)
        .fromTo('[data-90-small]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.12)
        .to(state, {
          value: 5,
          duration: 0.35,
          ease: 'steps(5)',
          onUpdate: () => {
            if (clock.current) clock.current.textContent = `90:${String(Math.floor(state.value)).padStart(2, '0')}`
          },
        }, 0.2)
        .to('[data-90-clock]', { color: '#b89b5e', duration: 0.02 }, 0.54)
        .fromTo('[data-90-pulse]', { scale: 0.2, opacity: 0 }, { scale: 24, opacity: 1, duration: 0.16, ease: 'expo.in' }, 0.55)
        .fromTo('[data-90-final]', { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 0.12, ease: 'expo.out' }, 0.7)
        .fromTo('[data-90-line] .mask-line > span', { yPercent: 115 }, { yPercent: 0, stagger: 0.025, duration: 0.07, ease: 'expo.out' }, 0.73)
        .fromTo('[data-90-meta]', { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.86)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="ninety" className="relative h-screen overflow-hidden bg-black text-white">
      <ChapterMark n="06" title="90 MINUTES" right="UNTIL THE FINAL WHISTLE" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p data-90-small className="t-serif-i mb-6 text-[3.8vw] text-silver opacity-0">The match says</p>
        <span ref={clock} data-90-clock data-stretch className="t-num text-[30vw] text-pure opacity-0">90:00</span>
        <p data-90-small className="t-label mt-10 opacity-0">THE CLOCK HAS SPOKEN</p>
      </div>
      <span data-90-pulse className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pure opacity-0" />

      <div data-90-final className="absolute inset-0 z-30 flex items-center bg-pure text-black">
        <div className="ml-[6vw]">
          <p className="t-label mb-8 text-black/60">REAL MADRID SAYS</p>
          <h2 data-90-line className="t-display text-[15vw]">
            <span className="mask-line block"><span className="block">90 minutes</span></span>
            <span className="mask-line block"><span className="block">are not enough.</span></span>
          </h2>
          <div data-90-meta className="mt-8 flex gap-12 opacity-0">
            <span className="t-label text-black/60">BELIEVE UNTIL THE END</span>
            <span className="t-label text-black/60">NO FINAL WHISTLE · NO SURRENDER</span>
          </div>
        </div>
      </div>
    </section>
  )
}
