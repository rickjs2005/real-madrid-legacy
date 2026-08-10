import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { eras, yearsOfHistory } from '../../data/legacy'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

const LegacyShaderFrame = lazy(() => import('./LegacyShaderFrame'))

// Grain estático via SVG inline — custo de paint fixo, sem asset externo
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Tratamento de época: P&B, contraste alto, tom quente — dourado fica só nos acentos
const ERA_FILTER = '[filter:grayscale(1)_contrast(1.15)_sepia(0.3)_brightness(0.88)]'

const ERA_PHOTO_URLS = eras.map((e) => `/assets/legacy/${e.year}.webp`)

// se o shader falhar, a moldura cai para a foto DOM da era atual (primeira)
class FrameBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error) {
    console.warn('[legacy] shader frame failed, falling back to static photo:', error.message)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function Legacy() {
  const root = useRef<HTMLElement>(null)
  // posição contínua na linha das eras (0..n-1); a parte fracionária é o
  // progresso da transição de displacement no shader
  const eraPos = useRef(0)
  const [mountShader, setMountShader] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const mountIo = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setMountShader(true),
      { rootMargin: '100% 0px' },
    )
    const viewIo = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    if (root.current) {
      mountIo.observe(root.current)
      viewIo.observe(root.current)
    }
    return () => {
      mountIo.disconnect()
      viewIo.disconnect()
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-era]')
        const rail = gsap.utils.toArray<HTMLElement>('[data-rail]')
        const captions = gsap.utils.toArray<HTMLElement>('[data-era-caption]')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${slides.length * 80}%`,
            pin: true,
            scrub: 0.5,
          },
        })
        slides.forEach((slide, i) => {
          if (i === 0) return
          // disciplina de crossfade: fade-out completo ANTES do próximo entrar —
          // sobre fundo branco, estados sobrepostos viram texto fantasma legível
          tl.to(slides[i - 1], { opacity: 0, duration: 0.5 })
            .fromTo(slide, { opacity: 0 }, { opacity: 1, duration: 0.55 }, '>0.12')
          const lines = slide.querySelectorAll('[data-line]')
          if (lines.length) tl.fromTo(lines, { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, '<0.15')
          const eraIdx = i - 1
          if (i === 1) {
            // primeira era: a moldura-shader se revela por clip-path
            tl.fromTo(
              '[data-shader-frame]',
              { opacity: 1, clipPath: 'inset(0 0 100% 0)' },
              { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power2.out' },
              '<0.1',
            )
          } else if (eraIdx < eras.length) {
            // transição de displacement: a fração de eraPos dirige o shader
            tl.to(eraPos, { current: eraIdx, duration: 0.7, ease: 'power1.inOut' }, '<')
            // legenda acompanha a era
            tl.to(captions[eraIdx - 1], { opacity: 0, duration: 0.25 }, '<')
            tl.to(captions[eraIdx], { opacity: 1, duration: 0.25 }, '<0.3')
          }
          if (i === slides.length - 1) {
            // desfecho: a moldura cede o palco
            tl.to('[data-shader-frame]', { opacity: 0, duration: 0.4 }, '<')
          }
          // trilho: destaca o ano da era atual
          if (eraIdx >= 0 && eraIdx < rail.length) {
            if (eraIdx > 0) tl.to(rail[eraIdx - 1], { opacity: 0.35, color: '#0a0a0a', duration: 0.3 }, '<')
            tl.to(rail[eraIdx], { opacity: 1, color: '#a5802f', duration: 0.3 }, '<')
          }
        })
        // linha de progresso do trilho acompanha a travessia inteira
        gsap.fromTo(
          '[data-rail-line]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${slides.length * 80}%`,
              scrub: 0.5,
            },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="legacy" className="relative h-screen overflow-hidden">
      <SectionLabel n="03" title="THE LEGACY" className="absolute top-[8vh] left-[8vw] z-10" />

      <div className="absolute left-[4vw] top-1/2 z-10 -translate-y-1/2">
        <div className="absolute -left-3 top-0 h-full w-px bg-ink/15" />
        <div data-rail-line className="absolute -left-3 top-0 h-full w-px bg-gold" style={{ transform: 'scaleY(0)' }} />
        <ul className="flex flex-col gap-5">
          {eras.map((e) => (
            <li key={e.year} data-rail className="font-display text-[11px] tracking-[0.25em] opacity-35">
              {e.year}
            </li>
          ))}
        </ul>
      </div>

      {/* moldura persistente: quad WebGL com transição de displacement entre as
          fotos das eras — fica fora dos slides (só os textos crossfadam) */}
      <div
        data-shader-frame
        className="absolute right-[10vw] top-1/2 z-[5] h-[72vh] w-[30vw] -translate-y-1/2 overflow-hidden opacity-0"
      >
        {mountShader && (
          <FrameBoundary
            fallback={
              <img src={ERA_PHOTO_URLS[0]} alt="" className={`h-full w-full object-cover ${ERA_FILTER}`} />
            }
          >
            <Suspense fallback={null}>
              <LegacyShaderFrame eraPos={eraPos} urls={ERA_PHOTO_URLS} frameloop={inView ? 'always' : 'never'} />
            </Suspense>
          </FrameBoundary>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(245,244,240,0.35))]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/30" />
        {eras.map((era, i) => (
          <p
            key={era.year}
            data-era-caption
            className="absolute bottom-4 left-4 text-[10px] tracking-[0.3em] opacity-50"
            style={{ opacity: i === 0 ? undefined : 0 }}
          >
            {era.year} — {era.place}
          </p>
        ))}
      </div>

      <div data-era className="absolute inset-0 flex items-center justify-center">
        <img
          src="/assets/legacy/1902.webp"
          alt=""
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className={`absolute inset-0 h-full w-full object-cover opacity-20 ${ERA_FILTER}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(245,244,240,0.92))]" />
        <div className="relative text-center">
          <p className="text-xs tracking-[0.4em] opacity-50">FOUNDED 1902</p>
          <p className="font-display text-[9vw] leading-none mt-4">{yearsOfHistory} YEARS</p>
          <p className="font-display text-[2.4vw] text-gold mt-2">OF IMPOSSIBLE MOMENTS</p>
        </div>
      </div>

      {eras.map((era, i) => (
        <div
          key={era.year}
          data-era
          className="absolute inset-0 flex items-center pl-[12vw] pr-[44vw]"
          style={{ opacity: 0 }}
        >
          {/* sobreposição editorial: a era anterior espia por trás da moldura
              em alguns capítulos (spread de revista, não scrapbook) */}
          {[1, 5, 6].includes(i) && (
            <div className="absolute right-[34vw] top-[15vh] h-[34vh] w-[13vw] overflow-hidden opacity-60">
              <img
                src={`/assets/legacy/${eras[i - 1].year}.webp`}
                alt=""
                onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')}
                className={`h-full w-full object-cover ${ERA_FILTER} brightness-[0.6]`}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-gold/25" />
            </div>
          )}
          <div className="max-w-[42vw]">
            <p data-line className="font-display text-[15vw] leading-none">{era.year}</p>
            <p data-line className="font-display text-[2.2vw] text-gold mt-2">{era.title}</p>
            <p data-line className="mt-4 max-w-md text-sm opacity-70">{era.text}</p>
            <p data-line className="mt-6 text-xs tracking-[0.4em] opacity-50">{era.stat}</p>
          </div>
        </div>
      ))}

      <div data-era className="absolute inset-0 flex items-center justify-center text-center" style={{ opacity: 0 }}>
        <div>
          <p data-line className="font-display text-[16vw] leading-none text-gold">15</p>
          <p data-line className="font-display text-[3vw]">EUROPEAN CUPS</p>
          <p data-line className="mt-6 text-sm tracking-[0.3em] opacity-70">AND THE STORY IS STILL BEING WRITTEN.</p>
          <p data-line className="mt-10 text-2xl opacity-50">↓</p>
        </div>
      </div>
    </section>
  )
}
