import gsap from 'gsap'
import { initSmoothScroll } from './lenis'

// Scroll velocity como parte da interface: Lenis reporta a velocidade em px/frame;
// normalizamos (-1..1), suavizamos e publicamos em --vel para o CSS (skew/stretch
// em headlines) e num getter para os shaders (distorção de imagem).
let vel = 0
let target = 0

export function getVelocity() {
  return vel
}

export function mountVelocity() {
  const lenis = initSmoothScroll()
  const onScroll = (e: { velocity: number }) => {
    target = gsap.utils.clamp(-1, 1, e.velocity / 60)
  }
  lenis.on('scroll', onScroll)
  const root = document.documentElement
  const update = () => {
    // volta rápido ao repouso: scroll lento estabiliza tudo
    vel += (target - vel) * 0.12
    target *= 0.9
    root.style.setProperty('--vel', vel.toFixed(4))
  }
  gsap.ticker.add(update)

  return () => {
    lenis.off('scroll', onScroll)
    gsap.ticker.remove(update)
    vel = 0
    target = 0
    root.style.setProperty('--vel', '0')
  }
}
