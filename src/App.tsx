import { useEffect } from 'react'
import DesktopGate from './components/DesktopGate'
import Hero from './sections/Hero/Hero'
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
      </main>
    </>
  )
}
