import { useEffect } from 'react'
import DesktopGate from './components/DesktopGate'
import Hero from './sections/Hero/Hero'
import Matchday from './sections/Matchday/Matchday'
import Squad from './sections/Squad/Squad'
import Legacy from './sections/Legacy/Legacy'
import Trophies from './sections/Trophies/Trophies'
import { initSmoothScroll } from './lib/lenis'
import { mountLightArc } from './lib/lightArc'

export default function App() {
  useEffect(() => {
    initSmoothScroll()
    mountLightArc()
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
      </main>
    </>
  )
}
