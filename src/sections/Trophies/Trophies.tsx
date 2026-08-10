import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { trophies } from '../../data/trophies'
import SectionLabel from '../../components/SectionLabel'

gsap.registerPlugin(ScrollTrigger)

// A sala de troféus como faixa escura entre listras douradas (o vocabulário do
// hero): a fotografia do museu fica escura como é de verdade, os números
// monumentais atravessam a faixa por cima, e o final da seção é a cerimônia do
// apagar das luzes — o véu noturno que entrega a página ao Bernabéu.
export default function Trophies() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-trophy]')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${slides.length * 100 + 60}%`,
            pin: true,
            scrub: 0.5,
          },
        })
        slides.forEach((slide, i) => {
          const counter = slide.querySelector('[data-count]') as HTMLElement
          const target = Number(counter.dataset.count)
          if (i > 0) {
            // disciplina de crossfade: o anterior SOME por completo antes do
            // próximo entrar — sem estados fantasmas sobre o branco
            tl.to(slides[i - 1], { opacity: 0, duration: 0.45 })
            tl.fromTo(slide, { opacity: 0, yPercent: 4 }, { opacity: 1, yPercent: 0, duration: 0.5 }, '>0.12')
          }
          tl.fromTo(
            counter,
            { innerText: 0 },
            { innerText: target, snap: { innerText: 1 }, duration: 1, ease: 'power1.out' },
            i === 0 ? 0 : '<0.15',
          )
        })
        // cerimônia: as luzes se apagam — véu noturno + linha dourada
        tl.to('[data-trophy]', { opacity: 0, duration: 0.4 }, '+=0.3')
        tl.fromTo('[data-nightveil]', { opacity: 0 }, { opacity: 1, duration: 0.7 }, '<0.1')
        tl.fromTo('[data-nightline]', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '<0.25')
        // parallax do fundo: a sala atravessa a faixa mais devagar que os números
        gsap.fromTo(
          '[data-room]',
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${slides.length * 100 + 60}%`,
              scrub: 0.6,
            },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="trophies" className="relative h-screen overflow-hidden">
      {/* faixa escura da sala de troféus entre listras douradas */}
      <div className="absolute left-0 right-0 top-[26vh] h-[46vh] overflow-hidden border-y border-gold/50 bg-night">
        <img
          data-room
          src="/assets/trophies/room.webp"
          alt="Real Madrid trophy room"
          onError={(e) => (e.currentTarget.style.display = 'none')}
          className="h-full w-full scale-110 object-cover
                     [filter:grayscale(0.5)_sepia(0.25)_contrast(1.15)_brightness(0.8)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/70 via-transparent to-night/40" />
      </div>
      <SectionLabel n="04" title="TROPHIES" className="absolute top-[8vh] left-[8vw] z-10" />
      {trophies.map((t, i) => (
        <div key={t.name} data-trophy className="absolute inset-0 z-10 px-[8vw]" style={{ opacity: i === 0 ? 1 : 0 }}>
          {/* número monumental atravessando a faixa; nome ancorado abaixo dela */}
          <p data-count={t.count} className="absolute top-[9vh] font-display text-[30vh] leading-none text-gold-bright drop-shadow-[0_2px_18px_rgba(5,7,15,0.45)]">
            {t.count}
          </p>
          <p className="absolute top-[74vh] font-display text-[3vw] leading-none">{t.name}</p>
        </div>
      ))}
      {/* véu do apagar das luzes — entrega a página à noite do Bernabéu */}
      <div data-nightveil className="pointer-events-none absolute inset-0 z-20 bg-night opacity-0">
        <div data-nightline className="absolute left-[20vw] right-[20vw] top-1/2 h-px bg-gold-bright/70" style={{ transform: 'scaleX(0)' }} />
      </div>
    </section>
  )
}
