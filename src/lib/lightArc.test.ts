import { describe, it, expect } from 'vitest'
import { arcColor, PHASES } from './lightArc'

describe('arcColor', () => {
  it('começa no dia e termina no dia', () => {
    expect(arcColor(0).toLowerCase()).toBe('#f5f4f0')
    expect(arcColor(1).toLowerCase()).toBe('#f5f4f0')
  })
  it('está na noite no meio do arco (fase Trophies/Bernabéu)', () => {
    expect(arcColor(0.55).toLowerCase()).toBe('#05070f')
  })
  it('interpola entre fases (nem dia nem noite)', () => {
    const mid = arcColor(0.3).toLowerCase()
    expect(mid).not.toBe('#f5f4f0')
    expect(mid).not.toBe('#05070f')
  })
  it('fases cobrem 0..1 em ordem', () => {
    expect(PHASES[0].at).toBe(0)
    expect(PHASES[PHASES.length - 1].at).toBe(1)
    for (let i = 1; i < PHASES.length; i++) expect(PHASES[i].at).toBeGreaterThan(PHASES[i - 1].at)
  })
})
