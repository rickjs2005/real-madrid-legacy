import { describe, it, expect } from 'vitest'
import { arcColor, deriveStops, PHASES } from './lightArc'

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

// deriveStops é a peça que corrige o bug real: transforma posições medidas de seção
// (que já embutem os pin-spacers de Squad/Legacy/Trophies/Bernabéu) em stops 0..1,
// em vez de frações "chutadas" que não acompanhavam o layout pinado.
describe('deriveStops', () => {
  it('normaliza posições reais de seção (com pin-spacers) em frações 0..1', () => {
    // números na mesma proporção do que foi medido ao vivo (squad ~13.5% do scroll,
    // legacy ~46%, bernabeu ~81%, latest ~93%, shop ~96%) — não são um "chute".
    const anchors = [
      { color: '#f5f4f0', top: 0 }, // hero
      { color: '#f5f4f0', top: 300 }, // matchday
      { color: '#2a2d3a', top: 1350 }, // squad
      { color: '#05070f', top: 4640 }, // legacy
      { color: '#05070f', top: 8130 }, // bernabeu
      { color: '#8a8676', top: 9300 }, // latest
      { color: '#f5f4f0', top: 9610 }, // shop
      { color: '#f5f4f0', top: 9920 }, // madridista
    ]
    const stops = deriveStops(anchors, 0, 10000)
    expect(stops[0].at).toBe(0)
    expect(stops[stops.length - 1].at).toBe(1)
    for (let i = 1; i < stops.length; i++) expect(stops[i].at).toBeGreaterThan(stops[i - 1].at)
  })

  it('regressão: no início real do Squad, o fundo já está escuro (não mais dia sob texto claro)', () => {
    const anchors = [
      { color: '#f5f4f0', top: 0 },
      { color: '#f5f4f0', top: 300 },
      { color: '#2a2d3a', top: 1350 },
      { color: '#05070f', top: 4640 },
      { color: '#05070f', top: 8130 },
      { color: '#8a8676', top: 9300 },
      { color: '#f5f4f0', top: 9610 },
      { color: '#f5f4f0', top: 9920 },
    ]
    const stops = deriveStops(anchors, 0, 10000)
    // fração real de início do Squad medida ao vivo: ~0.135
    expect(arcColor(0.135, stops).toLowerCase()).not.toBe('#f5f4f0')
  })

  it('mantém noite constante ao longo de legacy→trophies→bernabeu (sem drift no meio das seções escuras)', () => {
    const anchors = [
      { color: '#f5f4f0', top: 0 },
      { color: '#f5f4f0', top: 300 },
      { color: '#2a2d3a', top: 1350 },
      { color: '#05070f', top: 4640 }, // legacy
      { color: '#05070f', top: 8130 }, // bernabeu
      { color: '#8a8676', top: 9300 },
      { color: '#f5f4f0', top: 9610 },
      { color: '#f5f4f0', top: 9920 },
    ]
    const stops = deriveStops(anchors, 0, 10000)
    // ponto no meio de legacy/trophies (entre as âncoras legacy e bernabeu): ainda noite exata
    expect(arcColor(0.6, stops).toLowerCase()).toBe('#05070f')
  })

  it('cai pro PHASES padrão com range degenerado ou nenhuma âncora medida', () => {
    expect(deriveStops([], 0, 100)).toBe(PHASES)
    expect(deriveStops([{ color: '#000', top: 10 }], 100, 100)).toBe(PHASES)
  })

  it('descarta âncoras empatadas/fora de ordem pra nunca dividir por zero', () => {
    const anchors = [
      { color: '#111111', top: 0 },
      { color: '#222222', top: 50 },
      { color: '#222222', top: 50 },
      { color: '#333333', top: 100 },
    ]
    const stops = deriveStops(anchors, 0, 100)
    expect(stops.length).toBeLessThan(anchors.length)
    for (let i = 1; i < stops.length; i++) expect(stops[i].at).toBeGreaterThan(stops[i - 1].at)
  })
})
