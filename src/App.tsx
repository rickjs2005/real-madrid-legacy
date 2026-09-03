import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './sections/Hero/Hero'
import Bernabeu from './sections/Bernabeu/Bernabeu'
import Legends from './sections/Legends/Legends'
import { initSmoothScroll } from './lib/lenis'
import { mountVelocity } from './lib/velocity'
import { mountCursor } from './lib/cursor'

gsap.registerPlugin(ScrollTrigger)

// Oito capítulos de um filme, não sections. v0: 01 MADRID · 02 THE BERNABÉU ·
// 03 BUILT BY LEGENDS (preview). Os demais entram após validar a linguagem.
export default function App() {
  useEffect(() => {
    initSmoothScroll()
    mountVelocity()
    mountCursor()
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  }, [])
  return (
    <>
      {/* grain vivo global — costura os capítulos como um único rolo de filme */}
      <div
        aria-hidden
        className="grain grain-live pointer-events-none fixed -inset-[10%] z-[60] opacity-[0.06] mix-blend-overlay"
      />
      <main id="page">
        <Hero />
        <Bernabeu />
        <Legends />
      </main>
    </>
  )
}
