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
