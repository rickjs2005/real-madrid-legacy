import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'

gsap.registerPlugin(ScrollTrigger)

// CHAPTER 02 — THE BERNABÉU.
// Cena A (silêncio → impacto): THIS IS NOT A STADIUM. pausa. IT'S THE BERNABÉU.
// Cena B (travelling): a arquitetura em macro atravessa a tela na horizontal —
// fachada, luz, túnel, gramado — com parallax por camada e labels de coordenada.

const shots = [
  { src: '/assets/film/facade-low.webp', n: '01', label: 'FAÇADE · STEEL', w: 'w-[62vw]', h: 'h-[70vh]', y: 'top-[15vh]' },
  { src: '/assets/film/facade-macro.webp', n: '02', label: 'SKIN · MACRO', w: 'w-[34vw]', h: 'h-[46vh]', y: 'top-[42vh]' },
  { src: '/assets/film/tunnel.webp', n: '03', label: 'TUNNEL · 0 LUX', w: 'w-[54vw]', h: 'h-[78vh]', y: 'top-[11vh]' },
  { src: '/assets/film/lights.webp', n: '04', label: 'LIGHTS · 2000 LUX', w: 'w-[40vw]', h: 'h-[52vh]', y: 'top-[8vh]' },
  { src: '/assets/film/pitch-reveal.webp', n: '05', label: 'PITCH · 105 × 68', w: 'w-[70vw]', h: 'h-[82vh]', y: 'top-[9vh]' },
]

export default function Bernabeu() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ——— cena A: manifesto ———
      gsap
        .timeline({
          scrollTrigger: { trigger: '[data-manifesto]', start: 'top top', end: '+=240%', pin: true, scrub: 0.7 },
        })
        .fromTo('[data-facade]', { opacity: 0 }, { opacity: 0.55, duration: 0.3, ease: 'power2.out' }, 0)
        .fromTo('[data-m1] .mask-line > span', { yPercent: 110 }, { yPercent: 0, stagger: 0.05, duration: 0.25, ease: 'power4.out' }, 0.05)
        // silêncio: nada se move
        .to('[data-m1]', { opacity: 0.18, duration: 0.15, ease: 'power2.in' }, 0.5)
        // impacto: IT'S THE BERNABÉU entra rápido, sem easing
        .fromTo('[data-m2] .mask-line > span', { yPercent: 120 }, { yPercent: 0, stagger: 0.02, duration: 0.08, ease: 'expo.out' }, 0.58)
        .fromTo('[data-m-rule]', { scaleX: 0 }, { scaleX: 1, duration: 0.2, ease: 'power3.inOut' }, 0.62)
        .fromTo('[data-m-meta]', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.7)

      // ——— cena B: travelling horizontal ———
      const el = track.current!
      const distance = () => el.scrollWidth - window.innerWidth
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-travel]',
          start: 'top top',
          end: () => `+=${distance() * 1.15}`,
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      })
      tl.to(el, { x: () => -distance(), ease: 'none' }, 0)
      // parallax por camada: cada foto desliza dentro da moldura a velocidade própria
      gsap.utils.toArray<HTMLElement>('[data-shot] img').forEach((img, i) => {
        tl.fromTo(img, { xPercent: -6 - i * 2 }, { xPercent: 6 + i * 2, ease: 'none' }, 0)
      })
      tl.fromTo('[data-travel-title]', { xPercent: 20 }, { xPercent: -60, ease: 'none' }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="bernabeu" className="relative bg-black text-white">
      {/* cena A */}
      <div data-manifesto className="relative h-screen overflow-hidden">
        {/* a pele metálica em travelling contínuo, quase apagada, atrás do manifesto */}
        <video
          data-facade
          src="/assets/film/facade.mp4"
          muted
          loop
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-0 [filter:grayscale(1)_contrast(1.2)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <ChapterMark n="02" title="THE BERNABÉU" right="CHAMARTÍN · MADRID" />
        <div className="absolute left-[6vw] top-[22vh]">
          <h2 data-m1 className="t-serif-i text-[7.2vw] text-silver">
            <span className="mask-line block">
              <span className="block">This is</span>
            </span>
            <span className="mask-line block">
              <span className="block">not a stadium.</span>
            </span>
          </h2>
        </div>
        <div className="absolute bottom-[10vh] left-[6vw] right-[6vw]">
          <h2 data-m2 data-stretch className="t-display text-[15.5vw] text-pure">
            <span className="mask-line block">
              <span className="block">It's the</span>
            </span>
            <span className="mask-line block">
              <span className="block">Bernabéu</span>
            </span>
          </h2>
          <div data-m-rule className="rule mt-6 origin-left" />
          <div data-m-meta className="mt-4 flex justify-between">
            <span className="t-label">INAUGURATED 14 · 12 · 1947</span>
            <span className="t-label">RENOVATED 2019 — 2024</span>
            <span className="t-label">CAP. 78,297</span>
          </div>
        </div>
      </div>

      {/* cena B */}
      <div data-travel className="relative h-screen overflow-hidden">
        <ChapterMark n="02" title="ARCHITECTURE" right="TRAVELLING · 0 → 105 M" />
        <p data-travel-title className="t-display pointer-events-none absolute bottom-[4vh] left-[6vw] z-0 whitespace-nowrap text-[22vw] text-graphite">
          Steel · Light · Grass
        </p>
        <div ref={track} className="absolute left-0 top-0 flex h-full items-start gap-[8vw] pl-[6vw] pr-[12vw]">
          {shots.map((s, i) => (
            <figure key={s.n} data-shot data-cursor="view" className={`relative shrink-0 ${s.w} ${s.h} ${s.y}`}>
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={s.src}
                  alt=""
                  className="img-dominance h-full w-[118%] max-w-none object-cover"
                  onError={(e) => (e.currentTarget.style.opacity = '0')}
                />
              </div>
              <figcaption className="absolute -bottom-9 left-0 flex w-full justify-between">
                <span className="t-label">{s.n}</span>
                <span className="t-label">{s.label}</span>
              </figcaption>
              {i === 2 && (
                <p className="t-serif-i absolute -right-[10vw] top-[38%] z-10 whitespace-nowrap text-[3.4vw] text-white">
                  where the noise begins.
                </p>
              )}
            </figure>
          ))}
          <div className="relative flex h-full shrink-0 flex-col justify-center pr-[10vw]">
            <p className="t-display-thin text-[4.6vw] text-silver">
              Every seat
              <br />
              a witness.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
