import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Scene = lazy(() => import('./Scene'))

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!canvas.getContext('webgl2')
  } catch {
    return false
  }
}

// Foto aérea com tratamento noturno: o fallback precisa respeitar o arco de luz
// (a foto original é diurna — sem o filtro ela quebra a fase noite da página).
function FallbackImage() {
  return (
    <>
      <img
        src="/assets/bernabeu/aerial.webp"
        alt="Santiago Bernabéu"
        onError={(e) => (e.currentTarget.style.display = 'none')}
        className="h-full w-full object-cover opacity-50
                   [filter:grayscale(0.9)_sepia(0.25)_hue-rotate(180deg)_brightness(0.45)_contrast(1.15)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,7,15,0.9))]" />
    </>
  )
}

// Se a cena 3D falhar em runtime (contexto WebGL perdido, GPU por software,
// erro de shader), cai para a foto em vez de derrubar a árvore inteira.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error) {
    console.warn('[bernabeu] 3d scene failed, using photo fallback:', error.message)
  }
  render() {
    return this.state.failed ? <FallbackImage /> : this.props.children
  }
}

export default function Bernabeu() {
  const root = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [mount3d, setMount3d] = useState(false)
  const [inView, setInView] = useState(false)
  const [use3d] = useState(webglAvailable)

  useEffect(() => {
    if (!use3d) console.warn('[bernabeu] webgl2 unavailable, using photo fallback')
  }, [use3d])

  useEffect(() => {
    // lazy mount: só carrega o chunk 3D quando a seção se aproxima
    const mountIo = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.info('[bernabeu] mounting 3d scene')
          setMount3d(true)
        }
      },
      { rootMargin: '100% 0px' },
    )
    // frameloop: renderiza só com a seção visível (spec: WebGL pausado fora do viewport)
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
        // opacidade inicial só é forçada aqui (dentro do guard de motion): com
        // reduced-motion, a seção não roda a timeline e o subtítulo precisa
        // ficar visível estaticamente em vez de sumir para sempre.
        gsap.set('[data-bsub], [data-bquote]', { opacity: 0 })
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.4,
            onUpdate: (self) => (progress.current = self.progress),
          },
        })
          .fromTo('[data-btitle]', { opacity: 0, yPercent: 20 }, { opacity: 1, yPercent: 0, duration: 1 })
          .to('[data-btitle]', { opacity: 0, duration: 1 }, '+=1')
          .fromTo('[data-bsub]', { opacity: 0 }, { opacity: 1, duration: 0.8 })
          .to('[data-bsub]', { opacity: 0, duration: 0.8 }, '+=0.6')
          // payoff: a frase que define as noites europeias desta casa
          .fromTo('[data-bquote]', { opacity: 0, yPercent: 12 }, { opacity: 1, yPercent: 0, duration: 1 })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="bernabeu" className="relative h-screen overflow-hidden text-day">
      <div className="absolute inset-0">
        {use3d && mount3d ? (
          <SceneBoundary>
            <Suspense fallback={<FallbackImage />}>
              <Scene progress={progress} frameloop={inView ? 'always' : 'never'} />
            </Suspense>
          </SceneBoundary>
        ) : (
          <FallbackImage />
        )}
      </div>
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center">
        <p data-btitle className="font-display text-[8vw] leading-none text-center">
          SANTIAGO<br />BERNABÉU
        </p>
        <p data-bsub className="mt-4 text-sm tracking-[0.35em] opacity-70">
          05 — THE HOME OF LEGENDS
        </p>
        <div data-bquote className="absolute bottom-[14vh] text-center">
          <p className="font-display text-[2.4vw] text-gold">
            “90 minuti en el Bernabéu son molto longo.”
          </p>
          <p className="mt-3 text-xs tracking-[0.35em] opacity-50">JUANITO, 1985</p>
        </div>
      </div>
    </section>
  )
}
