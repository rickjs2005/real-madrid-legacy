import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'

gsap.registerPlugin(ScrollTrigger)

const players = [
  { index: '01', name: 'MBAPPÉ', first: 'Kylian', number: '10', nation: 'FRANCE', image: '/assets/squad/p01.webp' },
  { index: '02', name: 'VINÍCIUS JR', first: 'Vini', number: '07', nation: 'BRAZIL', image: '/assets/squad/p02.webp' },
  { index: '03', name: 'BELLINGHAM', first: 'Jude', number: '05', nation: 'ENGLAND', image: '/assets/squad/p03.webp' },
  { index: '04', name: 'VALVERDE', first: 'Fede', number: '08', nation: 'URUGUAY', image: '/assets/squad/p04.webp' },
  { index: '05', name: 'COURTOIS', first: 'Thibaut', number: '01', nation: 'BELGIUM', image: '/assets/squad/p06.webp' },
]

export default function Present() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: '[data-present-intro]', start: 'top top', end: '+=230%', pin: true, scrub: 0.7 } })
        .fromTo('[data-present-copy] .mask-line > span', { yPercent: 110 }, { yPercent: 0, stagger: 0.04, duration: 0.12, ease: 'expo.out' }, 0.08)
        .fromTo('[data-present-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.12, ease: 'power3.inOut' }, 0.38)
        .fromTo('[data-present-roster]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, 0.48)
        .to('[data-present-intro]', { backgroundColor: '#080808', color: '#f5f5f2', duration: 0.18 }, 0.8)

      const reel = track.current!
      const distance = () => reel.scrollWidth - window.innerWidth
      const horizontal = gsap.to(reel, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-present-reel]',
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray<HTMLElement>('[data-present-player]').forEach((panel) => {
        const photo = panel.querySelector('[data-present-photo]')
        const name = panel.querySelector('[data-present-name]')
        if (photo) gsap.fromTo(photo, { xPercent: -7 }, { xPercent: 7, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true } })
        if (name) gsap.fromTo(name, { xPercent: 12 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true } })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="present" className="relative bg-black">
      <div data-present-intro className="relative flex h-screen items-center overflow-hidden bg-pure text-black">
        <ChapterMark n="07" title="THE PRESENT" right="THE NEXT CHAPTER" tone="black" />
        <div className="ml-[6vw]">
          <h2 data-present-copy className="text-[8.8vw] leading-[0.86]">
            <span className="mask-line block t-serif"><span className="block">Legends leave.</span></span>
            <span className="mask-line block t-display"><span className="block">The club remains.</span></span>
          </h2>
          <div data-present-rule className="mt-8 h-px w-[88vw] origin-left bg-black/30" />
          <div data-present-roster className="mt-5 flex w-[88vw] justify-between opacity-0">
            {['MBAPPÉ', 'VINI', 'BELLINGHAM', 'VALVERDE', 'ARDA', 'COURTOIS'].map((name) => <span key={name} className="t-label text-black/60">{name}</span>)}
          </div>
        </div>
      </div>

      <div data-present-reel className="relative h-screen overflow-hidden bg-pure text-black">
        <div ref={track} className="flex h-full w-max">
          {players.map((player, i) => (
            <article key={player.name} data-present-player data-cursor="view" className="relative h-screen w-screen shrink-0 overflow-hidden border-r border-black/15">
              <p className="t-label absolute left-[6vw] top-[5vh] z-20 text-black/60">07.{player.index} — THE PRESENT</p>
              <p className="t-label absolute right-[6vw] top-[5vh] z-20 text-black/60">{player.nation} · № {player.number}</p>
              <span className="t-num outline-text-dark absolute -left-[2vw] top-[8vh] text-[39vw] text-transparent opacity-35">{player.number}</span>
              <div className={`absolute bottom-0 h-[88vh] w-[34vw] overflow-hidden ${i % 2 ? 'left-[10vw]' : 'right-[10vw]'}`}>
                <img data-present-photo src={player.image} alt={`${player.first} ${player.name}`} className="img-present h-full w-[116%] max-w-none object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-pure/90 via-transparent to-transparent" />
              </div>
              <div data-present-name className={`absolute bottom-[8vh] z-10 ${i % 2 ? 'left-[40vw]' : 'left-[6vw]'}`}>
                <p className="t-serif-i mb-1 text-[4vw]">{player.first}</p>
                <h3 data-stretch className="t-display whitespace-nowrap text-[12vw]">{player.name}</h3>
                <div className="mt-6 flex items-center gap-8">
                  <div className="h-px w-[18vw] bg-black/35" />
                  <span className="t-label text-black/60">THE STORY CONTINUES</span>
                </div>
              </div>
            </article>
          ))}
          <div className="relative flex h-screen w-[65vw] shrink-0 items-center justify-center bg-black text-white">
            <p className="t-display-thin text-[5.8vw]">Today is only<br /><span className="text-gold">tomorrow's memory.</span></p>
          </div>
        </div>
      </div>
    </section>
  )
}
