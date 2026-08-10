import { Suspense, lazy, useEffect, useRef, useState } from 'react'
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

export default function Bernabeu() {
  const root = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [mount3d, setMount3d] = useState(false)
  const [inView, setInView] = useState(false)
  const [use3d] = useState(webglAvailable)

  useEffect(() => {
    // lazy mount: só carrega o chunk 3D quando a seção se aproxima
    const mountIo = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setMount3d(true),
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
        gsap.set('[data-bsub]', { opacity: 0 })
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
          .fromTo('[data-bsub]', { opacity: 0 }, { opacity: 1, duration: 1 })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="bernabeu" className="relative h-screen overflow-hidden text-day">
      <div className="absolute inset-0">
        {use3d && mount3d ? (
          <Suspense fallback={null}>
            <Scene progress={progress} frameloop={inView ? 'always' : 'never'} />
          </Suspense>
        ) : (
          <img
            src="/assets/bernabeu/aerial.webp"
            alt="Santiago Bernabéu aerial view"
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="h-full w-full object-cover opacity-60"
          />
        )}
      </div>
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center">
        <p data-btitle className="font-display text-[8vw] leading-none text-center">
          SANTIAGO<br />BERNABÉU
        </p>
        <p data-bsub className="mt-4 text-sm tracking-[0.4em] opacity-70">
          05 — THE HOME OF LEGENDS
        </p>
      </div>
    </section>
  )
}
