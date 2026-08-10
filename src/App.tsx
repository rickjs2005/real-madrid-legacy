import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DesktopGate from './components/DesktopGate'
import Hero from './sections/Hero/Hero'
import Matchday from './sections/Matchday/Matchday'
import Squad from './sections/Squad/Squad'
import Legacy from './sections/Legacy/Legacy'
import Trophies from './sections/Trophies/Trophies'
import Bernabeu from './sections/Bernabeu/Bernabeu'
import Latest from './sections/Latest/Latest'
import Shop from './sections/Shop/Shop'
import Madridista from './sections/Madridista/Madridista'
import Footer from './sections/Footer/Footer'
import { initSmoothScroll } from './lib/lenis'
import { mountLightArc } from './lib/lightArc'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    initSmoothScroll()
    mountLightArc()
    // pins (Squad, Bernabéu) dependem de medidas corretas do layout; fontes/imagens
    // que chegam depois do primeiro paint podem deslocar alturas, então recalculamos
    // os triggers quando fontes e o load completo do documento terminam.
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  }, [])
  return (
    <>
      <DesktopGate />
      {/* grain global muito sutil: textura cinematográfica que costura as fases
          do arco de luz — custo de paint fixo (SVG estático repetido) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <main id="page">
        <Hero />
        <Matchday />
        <Squad />
        <Legacy />
        <Trophies />
        <Bernabeu />
        <Latest />
        <Shop />
        <Madridista />
        <Footer />
      </main>
    </>
  )
}
