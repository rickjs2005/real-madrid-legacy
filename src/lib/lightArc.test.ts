import { describe, it, expect } from 'vitest'
import { arcColor, deriveStops, PHASES } from './lightArc'

describe('arcColor', () => {
  it('começa no branco e termina no branco (Los Blancos)', () => {
    expect(arcColor(0).toLowerCase()).toBe('#f5f4f0')
    expect(arcColor(1).toLowerCase()).toBe('#f5f4f0')
  })
  it('mergulha na noite apenas na fase do Bernabéu', () => {
    expect(arcColor(0.8).toLowerCase()).toBe('#05070f')
  })
  it('permanece branco antes do estádio (sem escurecer no meio do site)', () => {
    expect(arcColor(0.3).toLowerCase()).toBe('#f5f4f0')
    expect(arcColor(0.6).toLowerCase()).toBe('#f5f4f0')
  })
  it('fases cobrem 0..1 em ordem', () => {
    expect(PHASES[0].at).toBe(0)
    expect(PHASES[PHASES.length - 1].at).toBe(1)
    for (let i = 1; i < PHASES.length; i++) expect(PHASES[i].at).toBeGreaterThan(PHASES[i - 1].at)
  })
  it('aceita stops customizados (interpolação não fica presa ao PHASES fixo do app)', () => {
    const stops = [
      { at: 0, color: '#000000' },
      { at: 1, color: '#ffffff' },
    ]
    expect(arcColor(0, stops).toLowerCase()).toBe('#000000')
    expect(arcColor(1, stops).toLowerCase()).toBe('#ffffff')
    const mid = arcColor(0.5, stops).toLowerCase()
    expect(mid).toMatch(/^#[0-9a-f]{6}$/)
    expect(mid).not.toBe('#000000')
    expect(mid).not.toBe('#ffffff')
  })
})

// deriveStops transforma posições medidas de seção (que já embutem os
// pin-spacers) em stops 0..1 — a peça que mantém o mergulho noturno ancorado
// no Bernabéu REAL, não numa fração chutada.
describe('deriveStops', () => {
  const anchors = [
    { color: '#f5f4f0', top: 0 }, // hero
    { color: '#f5f4f0', top: 7200 }, // trophies (segura o branco)
    { color: '#05070f', top: 8130 }, // bernabeu — único mergulho
    { color: '#f5f4f0', top: 9300 }, // latest — branco de novo
    { color: '#f5f4f0', top: 9920 }, // madridista
  ]

  it('normaliza posições reais de seção (com pin-spacers) em frações 0..1', () => {
    const stops = deriveStops(anchors, 0, 10000)
    expect(stops[0].at).toBe(0)
    expect(stops[stops.length - 1].at).toBe(1)
    for (let i = 1; i < stops.length; i++) expect(stops[i].at).toBeGreaterThan(stops[i - 1].at)
  })

  it('está em noite exata na âncora do Bernabéu', () => {
    const stops = deriveStops(anchors, 0, 10000)
    expect(arcColor(0.813, stops).toLowerCase()).toBe('#05070f')
  })

  it('regressão: permanece branco puro até a âncora do Trophies (nada de escurecer no meio)', () => {
    const stops = deriveStops(anchors, 0, 10000)
    expect(arcColor(0.135, stops).toLowerCase()).toBe('#f5f4f0')
    expect(arcColor(0.5, stops).toLowerCase()).toBe('#f5f4f0')
    expect(arcColor(0.72, stops).toLowerCase()).toBe('#f5f4f0')
  })

  it('volta ao branco depois do estádio', () => {
    const stops = deriveStops(anchors, 0, 10000)
    expect(arcColor(0.95, stops).toLowerCase()).toBe('#f5f4f0')
  })

  it('cai pro PHASES padrão com range degenerado ou nenhuma âncora medida', () => {
    expect(deriveStops([], 0, 100)).toBe(PHASES)
    expect(deriveStops([{ color: '#000', top: 10 }], 100, 100)).toBe(PHASES)
  })

  it('descarta âncoras empatadas/fora de ordem pra nunca dividir por zero', () => {
    const tied = [
      { color: '#111111', top: 0 },
      { color: '#222222', top: 50 },
      { color: '#222222', top: 50 },
      { color: '#333333', top: 100 },
    ]
    const stops = deriveStops(tied, 0, 100)
    expect(stops.length).toBeLessThan(tied.length)
    for (let i = 1; i < stops.length; i++) expect(stops[i].at).toBeGreaterThan(stops[i - 1].at)
  })
})
