import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Arco de luz: dia → entardecer → noite → amanhecer (ver spec, "Arco de luz")
export const PHASES = [
  { at: 0.0, color: '#f5f4f0' }, // Hero (dia)
  { at: 0.18, color: '#f5f4f0' }, // Matchday ainda dia
  { at: 0.32, color: '#2a2d3a' }, // Squad (entardecer)
  { at: 0.45, color: '#05070f' }, // Legacy (noite)
  { at: 0.68, color: '#05070f' }, // Trophies/Bernabéu (noite)
  { at: 0.82, color: '#8a8676' }, // Latest (amanhecer)
  { at: 1.0, color: '#f5f4f0' }, // Shop/Madridista/Footer (dia)
]

// gsap.utils.interpolate entre cores retorna "rgba(r,g,b,a)"; normalizamos para hex.
// Nos extremos (progress exatamente 0 ou 1) o gsap retorna a própria cor de origem/destino
// já em hex (sem passar por rgba) — nesse caso não há o que converter.
function toHex(color: string): string {
  if (color.startsWith('#')) return color.toLowerCase()
  const m = color.match(/\d+/g)
  if (!m) return color.toLowerCase()
  return (
    '#' +
    m.slice(0, 3)
      .map((n) => Number(n).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function arcColor(progress: number): string {
  const p = gsap.utils.clamp(0, 1, progress)
  for (let i = 1; i < PHASES.length; i++) {
    if (p <= PHASES[i].at) {
      const a = PHASES[i - 1]
      const b = PHASES[i]
      const local = (p - a.at) / (b.at - a.at)
      return toHex(gsap.utils.interpolate(a.color, b.color, local))
    }
  }
  return PHASES[PHASES.length - 1].color
}

export function mountLightArc(): void {
  ScrollTrigger.create({
    trigger: '#page',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      document.documentElement.style.background = arcColor(self.progress)
    },
  })
}
