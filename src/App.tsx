import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './sections/Hero/Hero'
import Bernabeu from './sections/Bernabeu/Bernabeu'
import Legends from './sections/Legends/Legends'
import Dominance from './sections/Dominance/Dominance'
import Kings from './sections/Kings/Kings'
import NinetyMinutes from './sections/NinetyMinutes/NinetyMinutes'
import Present from './sections/Present/Present'
import Eternal from './sections/Eternal/Eternal'
import { initSmoothScroll } from './lib/lenis'
import { mountVelocity } from './lib/velocity'
import { mountCursor } from './lib/cursor'

gsap.registerPlugin(ScrollTrigger)

// Oito capítulos de um filme, não sections. A progressão alterna tensão,
// impacto, silêncio e release; o dourado só aparece quando a história entrega
// glória.
export default function App() {
  useEffect(() => {
    initSmoothScroll()
    const unmountVelocity = mountVelocity()
    const unmountCursor = mountCursor()
    let active = true
    const refresh = () => active && ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh, { once: true })
    return () => {
      active = false
      window.removeEventListener('load', refresh)
      unmountVelocity()
      unmountCursor()
    }
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
        <Dominance />
        <Kings />
        <NinetyMinutes />
        <Present />
        <Eternal />
      </main>
    </>
  )
}
