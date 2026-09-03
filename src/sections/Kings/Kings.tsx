import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'

gsap.registerPlugin(ScrollTrigger)

const years = ['1956', '1957', '1958', '1959', '1960', '1966', '1998', '2000', '2002', '2014', '2016', '2017', '2018', '2022', '2024']

export default function Kings() {
  const root = useRef<HTMLElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const state = { value: 1 }
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=520%', pin: true, scrub: 0.9 },
        })
        .fromTo('[data-kings-room]', { scale: 1.18, opacity: 0 }, { scale: 1.04, opacity: 0.38, duration: 0.22, ease: 'power2.out' }, 0)
        .fromTo('[data-kings-cup]', { opacity: 0, yPercent: 12, rotate: -3 }, { opacity: 0.86, yPercent: 0, rotate: 0, duration: 0.18, ease: 'power3.out' }, 0.1)
        .fromTo('[data-kings-one]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.16)
        .to('[data-kings-one]', { opacity: 0, duration: 0.05 }, 0.3)
        .to(state, {
          value: 15,
          duration: 0.32,
          ease: 'power4.out',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(state.value)).padStart(2, '0')
          },
        }, 0.3)
        .fromTo('[data-kings-count]', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.16, ease: 'expo.out' }, 0.31)
        .fromTo('[data-kings-title] .mask-line > span', { yPercent: 110 }, { yPercent: 0, duration: 0.08, ease: 'expo.out' }, 0.48)
        .fromTo('[data-kings-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.1, ease: 'power3.inOut' }, 0.54)
        .fromTo('[data-kings-years]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.1 }, 0.6)
        .to('[data-kings-room]', { scale: 1, opacity: 0.22, duration: 0.4, ease: 'none' }, 0.6)
        .fromTo('[data-kings-close]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.84)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="kings" data-cursor="view" className="relative h-screen overflow-hidden bg-black text-white">
      <img data-kings-room src="/assets/trophies/room.webp" alt="Real Madrid trophy room" className="img-dominance absolute inset-0 h-full w-full object-cover opacity-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_67%_46%,transparent_0%,rgba(8,8,8,0.48)_32%,#080808_75%)]" />
      <ChapterMark n="05" title="KINGS OF EUROPE" right="1956 — 2024" />

      <p data-kings-one className="t-serif-i absolute left-[6vw] top-[23vh] z-20 text-[7vw] text-silver opacity-0">
        It began<br />with one.
      </p>

      <div data-kings-cup className="absolute bottom-[-8vh] right-[8vw] z-10 h-[100vh] w-[31vw] opacity-0">
        <img src="/assets/trophies/european-cup.webp" alt="European Cup" className="h-full w-full object-contain [filter:grayscale(1)_contrast(1.2)_brightness(1.18)]" />
      </div>

      <div data-kings-count className="absolute left-[4vw] top-[15vh] z-0 flex items-end opacity-0">
        <span ref={count} data-stretch className="t-num text-[42vw] text-gold">01</span>
        <span className="t-label mb-[7vw] ml-4 text-gold">EUROPEAN<br />CUPS</span>
      </div>

      <div className="absolute bottom-[7vh] left-[6vw] right-[6vw] z-20">
        <h2 data-kings-title className="t-display text-[10.8vw] text-pure">
          <span className="mask-line block"><span className="block">Europe is our stage.</span></span>
        </h2>
        <div data-kings-rule className="rule mt-5 origin-left" />
        <div data-kings-years className="mt-4 flex justify-between opacity-0">
          {years.map((year, i) => <span key={year} className={`t-label ${i === years.length - 1 ? 'text-gold' : ''}`}>{year}</span>)}
        </div>
      </div>

      <p data-kings-close className="t-label absolute right-[6vw] top-[18vh] z-20 max-w-[17vw] text-right leading-[1.9] opacity-0">
        FIFTEEN NIGHTS<br />FIFTEEN CROWNS<br /><span className="text-gold">ONE CLUB</span>
      </p>
    </section>
  )
}
