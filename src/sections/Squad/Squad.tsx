import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { players } from '../../data/squad'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

export default function Squad() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = root.current!.querySelector('[data-track]') as HTMLElement
        const horizontal = gsap.to(track, {
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
        // parallax de profundidade: cada foto atravessa a tela um pouco mais
        // devagar que o texto (containerAnimation ancora no deslocamento do track)
        gsap.utils.toArray<HTMLElement>('[data-player-photo]').forEach((photo) => {
          gsap.fromTo(
            photo,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: photo,
                containerAnimation: horizontal,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
        // o número da camisa se ESCREVE em traço dourado conforme o slide chega
        // (stroke-dashoffset com scrub), e preenche como marca d'água ao assentar
        gsap.utils.toArray<SVGTextElement>('[data-shirt-number] text').forEach((numeral) => {
          const article = numeral.closest('article')
          gsap.to(numeral, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: article,
              containerAnimation: horizontal,
              start: 'left 90%',
              end: 'left 38%',
              scrub: true,
            },
          })
          gsap.to(numeral, {
            fill: 'rgba(165,128,47,0.10)',
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: article,
              containerAnimation: horizontal,
              start: 'left 42%',
              toggleActions: 'play none none reverse',
            },
          })
        })
        // stats entram quando o slide assenta — hover não existe numa gravação
        gsap.utils.toArray<HTMLElement>('[data-player-stats]').forEach((stats) => {
          gsap.fromTo(
            stats,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: stats,
                containerAnimation: horizontal,
                start: 'left 45%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="squad" className="relative overflow-hidden">
      <SectionLabel n="02" title="THE SQUAD" className="absolute top-[8vh] left-[8vw] z-10" />
      <div data-track className="flex h-screen w-max">
        {players.map((p) => (
          <article key={p.index} className="group relative flex h-screen w-screen shrink-0 items-center px-[8vw]">
            {/* o número da camisa gigante, escrito em traço dourado no fundo */}
            <svg
              data-shirt-number
              aria-hidden
              className="absolute left-[4vw] top-[4vh] z-0 h-[78vh] overflow-visible"
              viewBox="0 0 900 760"
            >
              <text
                x="0"
                y="640"
                className="font-display"
                fontSize="720"
                fill="transparent"
                stroke="#a5802f"
                strokeWidth="3"
                style={{ strokeDasharray: 2600, strokeDashoffset: 2600 }}
              >
                {p.number}
              </text>
            </svg>
            {/* sanduíche tipográfico: o nome atravessa POR TRÁS da foto (z abaixo
                da foto), enquanto índice, posição e stats ficam na frente (z-20) */}
            <h2 className="absolute left-[8vw] z-[1] font-display text-[10.5vw] leading-[0.9] whitespace-nowrap">
              {p.name}
            </h2>
            <img
              data-player-photo
              src={`/assets/squad/p${p.index}.webp`}
              alt={p.name}
              onError={(e) => (e.currentTarget.style.display = 'none')}
              className="absolute right-[10vw] bottom-0 z-10 h-[88vh] object-contain object-bottom
                         [filter:grayscale(1)_sepia(0.22)_contrast(1.08)_brightness(1.02)]
                         transition-[filter] duration-500 group-hover:[filter:none]"
            />
            {/* legenda-ficha da foto (mesma voz das molduras do Legacy) */}
            <p className="absolute bottom-6 right-[10vw] z-20 text-[10px] tracking-[0.3em] opacity-50">
              № {p.number} — {p.nationality.toUpperCase()}
            </p>
            <div className="relative z-20 self-start mt-[16vh]">
              <p className="font-display text-[2vw] text-gold">{p.index}</p>
              <p className="mt-1 text-sm tracking-[0.4em] opacity-60">{p.position}</p>
            </div>
            {/* stats ancorados na base — visíveis quando o slide assenta */}
            <div data-player-stats className="absolute bottom-[10vh] left-[8vw] z-20 max-w-md opacity-0">
              <div className="flex gap-10 border-t border-gold/40 pt-4">
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
              <p className="mt-6 text-sm tracking-[0.3em] border-b border-gold/60 pb-1 inline-block">VIEW PLAYER →</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
