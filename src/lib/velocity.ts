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
  lenis.on('scroll', (e: { velocity: number }) => {
    target = gsap.utils.clamp(-1, 1, e.velocity / 60)
  })
  const root = document.documentElement
  gsap.ticker.add(() => {
    // volta rápido ao repouso: scroll lento estabiliza tudo
    vel += (target - vel) * 0.12
    target *= 0.9
    root.style.setProperty('--vel', vel.toFixed(4))
  })
}
