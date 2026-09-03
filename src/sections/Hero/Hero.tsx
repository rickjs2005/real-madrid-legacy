import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from '../../lib/lenis'
import { supportsWebGL } from '../../lib/webgl'
import { mountHeroFilm, type HeroFilmHandle } from './HeroFilm'

gsap.registerPlugin(ScrollTrigger)

// CHAPTER 01 — MADRID.
// Intro automática (tensão): preto · 1902 · MADRID. Depois o scroll conduz a
// câmera pelo túnel até o gramado enquanto REAL MADRID emerge do fundo da
// arquitetura (release). THE ETERNAL CLUB. Silêncio. SCROLL TO ENTER.
export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const aerialRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const filmCanvas = canvas.current!
    const fallbackFilm: HeroFilmHandle = {
      setProgress: (progress) => {
        filmCanvas.style.transform = `scale(${1.08 - progress * 0.08})`
        filmCanvas.style.filter = `grayscale(1) contrast(1.2) brightness(${0.8 - progress * 0.35})`
      },
      dispose: () => {},
    }
    filmCanvas.style.background = "center / cover no-repeat url('/assets/film/pitch-reveal.webp')"

    let film = fallbackFilm
    if (supportsWebGL()) {
      try {
        film = mountHeroFilm(filmCanvas)
        filmCanvas.style.background = 'none'
      } catch {
        film = fallbackFilm
      }
    }
    const lenis = initSmoothScroll()

    const ctx = gsap.context(() => {
      // ——— intro (na carga, sem scroll) ———
      lenis.stop()
      window.scrollTo(0, 0)
      const aerial = aerialRef.current!
      gsap
        .timeline({
          defaults: { ease: 'power2.inOut' },
          onComplete: () => lenis.start(),
        })
        // 1902 · MADRID (tensão)
        .fromTo('[data-i-year]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1.4 }, 0.6)
        .fromTo('[data-i-city]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 1.4 }, 1.5)
        .to('[data-i-year],[data-i-city]', { opacity: 0, duration: 0.6, ease: 'power2.in' }, 3.6)
        // exterior: a câmera avança sobre o Bernabéu (filme aéreo, 6s)
        .call(() => void aerial.play().catch(() => {}), [], 3.9)
        .to('[data-aerial]', { opacity: 1, duration: 1.8 }, 3.9)
        .fromTo('[data-i-where]', { opacity: 0 }, { opacity: 1, duration: 1 }, 5.2)
        .to('[data-i-where]', { opacity: 0, duration: 0.6 }, 8.4)
        // corte para o escuro do túnel
        .to('[data-aerial]', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 9.2)
        .to('[data-veil]', { opacity: 0, duration: 1.8, ease: 'power2.inOut' }, 9.5)
        .fromTo('[data-i-hint]', { opacity: 0 }, { opacity: 1, duration: 1 }, 11)

      // ——— scroll: o filme ———
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=520%',
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          film.setProgress(self.progress)
          // o hint da intro só existe enquanto ninguém rolou
          gsap.set('[data-i-hint]', { opacity: self.progress > 0.01 ? 0 : undefined })
        },
      })

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: '+=520%', scrub: 0.6 } })
        // THE ETERNAL CLUB: entra quando o nome já está na frente do estádio
        .fromTo('[data-tag]', { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.08, ease: 'power4.out' }, 0.7)
        .fromTo('[data-meta]', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.76)
        .fromTo('[data-enter]', { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.82)
        // cut para o preto do próximo capítulo
        .to('[data-tag],[data-meta],[data-enter]', { opacity: 0, duration: 0.05 }, 0.93)
        .fromTo('[data-veil-out]', { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.94)

      gsap.to('[data-enter-line]', { scaleY: 0.25, transformOrigin: 'top', repeat: -1, yoyo: true, duration: 1.1, ease: 'power1.inOut' })

      return () => st.kill()
    }, root)

    return () => {
      ctx.revert()
      film.dispose()
    }
  }, [])

  return (
    <section ref={root} id="madrid" data-cursor-hide className="relative h-screen overflow-hidden bg-black text-white">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />

      {/* intro: exterior do Bernabéu (filme aéreo) sobre o véu preto */}
      <div data-veil className="pointer-events-none absolute inset-0 z-20 bg-black" />
      <div data-aerial className="pointer-events-none absolute inset-0 z-[25] opacity-0">
        <video
          ref={aerialRef}
          src="/assets/film/aerial.mp4"
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover [filter:contrast(1.12)_saturate(0.75)_brightness(0.9)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,8,0.75))]" />
        <div data-i-where className="absolute bottom-[8vh] left-[6vw] flex gap-10 opacity-0">
          <span className="t-label">SANTIAGO BERNABÉU</span>
          <span className="t-label">40.4531° N · 3.6883° W</span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-5">
        <p data-i-year className="t-serif text-[2.4vw] text-white opacity-0">
          1902
        </p>
        <p data-i-city className="t-label text-[11px] tracking-[0.6em] opacity-0">
          MADRID
        </p>
      </div>
      <p data-i-hint className="t-label absolute bottom-[6vh] left-1/2 z-30 -translate-x-1/2 opacity-0">
        SCROLL
      </p>

      {/* pós-reveal */}
      <p data-tag className="t-display-thin absolute left-1/2 top-[74vh] z-30 -translate-x-1/2 whitespace-nowrap text-[2.3vw] text-silver opacity-0">
        The Eternal Club
      </p>
      <div data-meta className="absolute bottom-[6vh] left-[6vw] z-30 flex gap-10 opacity-0">
        <span className="t-label">EST. 1902</span>
        <span className="t-label">MADRID, ESP</span>
        <span className="t-label">40.4531° N</span>
      </div>
      <p data-meta className="t-label absolute bottom-[6vh] right-[6vw] z-30 opacity-0">
        01 — MADRID
      </p>
      <div data-enter className="absolute bottom-[6vh] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0">
        <span className="t-label text-[10px]">SCROLL TO ENTER</span>
        <span data-enter-line className="block h-10 w-px bg-silver/70" />
      </div>

      <div data-veil-out className="pointer-events-none absolute inset-0 z-40 bg-black opacity-0" />
    </section>
  )
}
