import { useEffect } from 'react'
import DesktopGate from './components/DesktopGate'
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
      <main id="page" />
    </>
  )
}
