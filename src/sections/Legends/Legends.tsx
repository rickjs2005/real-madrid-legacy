import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ChapterMark from '../../components/ChapterMark'
import LegendsFrame from './LegendsFrame'

gsap.registerPlugin(ScrollTrigger)

// CHAPTER 03 — BUILT BY LEGENDS (preview: eras I e II).
// Cena A (silêncio, branco): A CLUB IS NOTHING WITHOUT MEMORY.
// Cena B (travessia do tempo): um ano fixo no centro acelera pelas décadas; as
// fotografias passam por displacement e o contador para em cada lenda.
// Cena C (Zidane): preto · 2002 · GLASGOW · a bola desce · PERFECTION LASTS ONE SECOND.

type Stop = {
  year: number
  name: [string, string]
  role: string
  fact: string
  img: string
  era: 0 | 1
}

const stops: Stop[] = [
  { year: 1956, name: ['Di', 'Stéfano'], role: 'LA SAETA RUBIA', fact: '5 EUROPEAN CUPS · 1956 — 1960', img: '/assets/legends/di-stefano.webp', era: 0 },
  { year: 1960, name: ['Ferenc', 'Puskás'], role: 'CAÑONCITO PUM', fact: '4 GOALS · HAMPDEN PARK · 7 — 3', img: '/assets/legends/puskas.webp', era: 0 },
  { year: 1966, name: ['Paco', 'Gento'], role: 'LA GALERNA DEL CANTÁBRICO', fact: '6 EUROPEAN CUPS · STILL UNMATCHED', img: '/assets/legends/gento.webp', era: 0 },
  { year: 1998, name: ['Raúl', 'González'], role: 'EL CAPITÁN', fact: 'NO. 7 · 741 GAMES · LA SÉPTIMA', img: '/assets/legends/raul.webp', era: 1 },
  { year: 2002, name: ['Roberto', 'Carlos'], role: 'EL HOMBRE BALA', fact: 'NO. 3 · 527 GAMES · 4 LIGAS · 3 CHAMPIONS', img: '/assets/legends/roberto-carlos.webp', era: 1 },
]

// posição no scroll (0..1) em que cada parada "assenta"
const stopAt = stops.map((_, i) => 0.1 + (i / (stops.length - 1)) * 0.8)
const HOLD = 0.055 // janela de silêncio em cada parada

export default function Legends() {
  const root = useRef<HTMLElement>(null)
  const pos = useRef(0)
  const era = useRef(0)
  const yearEl = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ——— cena A ———
      gsap
        .timeline({ scrollTrigger: { trigger: '[data-memory]', start: 'top top', end: '+=200%', pin: true, scrub: 0.6 } })
        .fromTo('[data-mem-line]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.3, ease: 'power3.out' }, 0.05)
        .to('[data-memory]', { backgroundColor: '#080808', duration: 0.25, ease: 'power2.inOut' }, 0.72)
        .to('[data-mem-line]', { color: '#f5f5f2', duration: 0.25 }, 0.72)
        .to('[data-mem-line]', { opacity: 0, duration: 0.15 }, 0.9)

      // ——— cena B ———
      const timeline = { p: 0 }
      const yearFrom = 1953
      const setYear = (v: number) => {
        if (yearEl.current) yearEl.current.textContent = String(Math.round(v))
      }
      setYear(yearFrom)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-time]',
          start: 'top top',
          end: '+=900%',
          pin: true,
          scrub: 0.9,
          onUpdate: (self) => {
            const p = self.progress
            // contador de anos: entre paradas acelera (exponencial), na parada trava
            let y = yearFrom
            let idx = 0
            for (let i = 0; i < stops.length; i++) {
              const a = stopAt[i]
              const prevY = i === 0 ? yearFrom : stops[i - 1].year
              const prevEnd = i === 0 ? 0 : stopAt[i - 1] + HOLD
              if (p >= a) {
                y = stops[i].year
                idx = i
              } else if (p > prevEnd) {
                const t = (p - prevEnd) / (a - prevEnd)
                y = prevY + (stops[i].year - prevY) * (1 - Math.pow(1 - t, 3))
                idx = i - 1 + t
                break
              } else {
                break
              }
            }
            setYear(y)
            pos.current = Math.max(0, idx)
            // era: 0 nas três primeiras, 1 a partir de Raúl (mistura na travessia)
            const eraIdx = Math.max(0, idx)
            era.current = gsap.utils.clamp(0, 1, eraIdx - 2)
          },
        },
      })
      tl.to(timeline, { p: 1, ease: 'none' }, 0)

      // cada parada: nome entra em impacto, segura, sai em tensão
      stops.forEach((_, i) => {
        const at = stopAt[i]
        const sel = `[data-stop="${i}"]`
        tl.fromTo(
          `${sel} [data-name] .mask-line > span`,
          { yPercent: 110 },
          { yPercent: 0, stagger: 0.008, duration: 0.03, ease: 'expo.out' },
          at,
        )
          .fromTo(`${sel} [data-meta]`, { opacity: 0 }, { opacity: 1, duration: 0.015 }, at + 0.015)
          .fromTo(`${sel} [data-rule]`, { scaleX: 0 }, { scaleX: 1, duration: 0.03, ease: 'power3.inOut' }, at + 0.01)
          .to(`${sel}`, { opacity: 0, duration: 0.02, ease: 'power2.in' }, at + HOLD + 0.03)
      })
      // o ano sai grande e some antes da travessia final
      tl.to('[data-year]', { opacity: 0.22, duration: 0.03 }, stopAt[0])
      // ano em prata durante a travessia, dourado apenas quando a Europa chega (1956)
      tl.fromTo('[data-year]', { color: '#bfc1c4' }, { color: '#b89b5e', duration: 0.02 }, stopAt[0] - 0.02)
      tl.to('[data-year]', { color: '#bfc1c4', duration: 0.02 }, stopAt[0] + HOLD)

      // ——— cena C: Zidane ———
      gsap
        .timeline({ scrollTrigger: { trigger: '[data-zidane]', start: 'top top', end: '+=420%', pin: true, scrub: 0.7 } })
        .fromTo('[data-z-year]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.04)
        .fromTo('[data-z-city]', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.12)
        // a bola desce, lentamente, do topo ao centro (tensão)
        .fromTo('[data-ball]', { yPercent: -900, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: 'power1.in' }, 0.14)
        .to('[data-z-year],[data-z-city]', { opacity: 0, duration: 0.05 }, 0.4)
        // impacto: a bola some, ZIDANE.
        .to('[data-ball]', { scale: 0, duration: 0.02, ease: 'expo.in' }, 0.47)
        .fromTo('[data-z-name] .mask-line > span', { yPercent: 110 }, { yPercent: 0, duration: 0.05, ease: 'expo.out' }, 0.48)
        .fromTo('[data-z-photo]', { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.14, ease: 'power3.out' }, 0.52)
        .to('[data-z-name]', { opacity: 0, duration: 0.05 }, 0.68)
        .fromTo('[data-z-line]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.08, ease: 'power3.out' }, 0.7)
        .fromTo('[data-z-meta]', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.86)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="legends" className="relative text-white">
      {/* cena A — branco, silêncio */}
      <div data-memory className="relative flex h-screen items-center overflow-hidden bg-white text-black">
        <ChapterMark n="03" title="BUILT BY LEGENDS" right="1902 — ∞" tone="black" />
        <h2 className="t-serif ml-[6vw] text-[8.6vw] leading-[0.92]">
          <span data-mem-line className="block">A club</span>
          <span data-mem-line className="block">is nothing</span>
          <span data-mem-line className="block">without</span>
          <span data-mem-line className="block t-serif-i">memory.</span>
        </h2>
      </div>

      {/* cena B — travessia do tempo */}
      <div data-time data-cursor="view" className="relative h-screen overflow-hidden bg-black">
        <ChapterMark n="03" title="THE FOUNDATIONS" right="EUROPE · 1955 → 2002" />

        {/* o ano — tipografia como elemento gráfico, atrás da moldura */}
        <div data-year className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <span ref={yearEl} data-stretch className="t-num text-[36vw] text-silver opacity-60">
            1953
          </span>
        </div>

        {/* a moldura: retrato editorial, fixo à direita; a travessia acontece dentro dela */}
        <div className="absolute right-[7vw] top-[10vh] z-10 h-[80vh] w-[36vw]">
          <div className="absolute inset-0 overflow-hidden">
            <LegendsFrame pos={pos} era={era} urls={stops.map((s) => s.img)} />
          </div>
          <div className="rule-v absolute -left-6 top-0 h-full" />
          <p className="t-label absolute -bottom-8 left-0">ARCHIVE · FIG.</p>
          <p className="t-label absolute -bottom-8 right-0">WIKIMEDIA COMMONS · CC</p>
        </div>

        {stops.map((s, i) => (
          <div key={s.year} data-stop={i} className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute bottom-[10vh] left-[6vw] w-[52vw]">
              <p data-meta className="t-label mb-5 opacity-0">
                {s.year} · {s.role}
              </p>
              <h3 data-name className={s.era === 0 ? 't-serif text-[10.5vw] text-white' : 't-display text-[9.5vw] text-pure'}>
                <span className="mask-line block">
                  <span className="block">{s.name[0]}</span>
                </span>
                <span className="mask-line block">
                  <span className={`block ${s.era === 0 ? 't-serif-i' : ''}`}>{s.name[1]}</span>
                </span>
              </h3>
              <div data-rule className="rule mt-6 origin-left w-[40vw]" />
              <p data-meta className="t-label mt-4 opacity-0">
                {s.fact}
              </p>
            </div>
          </div>
        ))}

        <p className="t-label absolute bottom-[5vh] left-1/2 z-20 -translate-x-1/2 opacity-60">
          SCROLL THROUGH TIME
        </p>
      </div>

      {/* cena C — Zidane */}
      <div data-zidane data-cursor-hide className="relative h-screen overflow-hidden bg-black">
        <ChapterMark n="03" title="A MOMENT" right="15 · 05 · 2002 · HAMPDEN PARK" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
          <p data-z-year className="t-num text-[3vw] text-silver opacity-0">
            2002
          </p>
          <p data-z-city className="t-label tracking-[0.7em] opacity-0">
            GLASGOW
          </p>
          <span data-ball className="mt-6 block h-[3.2vw] w-[3.2vw] rounded-full border border-white/80 opacity-0" />
        </div>

        <div data-z-photo className="absolute inset-y-0 right-[6vw] w-[34vw] opacity-0">
          <img src="/assets/legends/zidane.webp" alt="Zinédine Zidane" className="img-flash h-full w-full object-cover object-top" />
          <div className="absolute inset-0 crt" />
        </div>

        <h2 data-z-name className="t-display absolute bottom-[8vh] left-[6vw] z-10 text-[18vw] text-pure mix-blend-difference">
          <span className="mask-line block">
            <span className="block">Zidane.</span>
          </span>
        </h2>

        <div className="absolute left-[6vw] top-[26vh] z-10">
          <p data-z-line className="t-serif-i text-[7vw] text-white opacity-0">
            Perfection
          </p>
          <p data-z-line className="t-serif-i text-[7vw] text-white opacity-0">
            lasts
          </p>
          <p data-z-line className="t-display text-[9vw] text-gold opacity-0">
            one second.
          </p>
        </div>
        <div data-z-meta className="absolute bottom-[6vh] left-[6vw] z-10 flex gap-10 opacity-0">
          <span className="t-label">45'</span>
          <span className="t-label">LEFT FOOT</span>
          <span className="t-label">LA NOVENA</span>
        </div>
      </div>
    </section>
  )
}
