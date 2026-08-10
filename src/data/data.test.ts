import { describe, it, expect } from 'vitest'
import { nextMatch, lastResults } from './match'
import { players } from './squad'
import { eras } from './legacy'
import { trophies } from './trophies'
import { headline, secondary } from './news'

describe('data snapshot', () => {
  it('próximo jogo tem data ISO válida e futura em relação ao snapshot', () => {
    expect(Number.isNaN(Date.parse(nextMatch.dateISO))).toBe(false)
    expect(Date.parse(nextMatch.dateISO)).toBeGreaterThan(Date.parse('2026-08-10'))
  })
  it('squad: 6+ jogadores, números únicos e válidos', () => {
    expect(players.length).toBeGreaterThanOrEqual(6)
    const numbers = players.map((p) => p.number)
    expect(new Set(numbers).size).toBe(numbers.length)
    numbers.forEach((n) => expect(n).toBeGreaterThan(0))
  })
  it('legacy: eras em ordem cronológica começando em 1902', () => {
    expect(eras[0].year).toBe('1902')
    const years = eras.map((e) => parseInt(e.year))
    for (let i = 1; i < years.length; i++) expect(years[i]).toBeGreaterThan(years[i - 1])
  })
  it('trophies: números oficiais do clube', () => {
    const byName = Object.fromEntries(trophies.map((t) => [t.name, t.count]))
    expect(byName['EUROPEAN CUPS']).toBe(15)
    expect(byName['LA LIGA']).toBe(36)
    expect(byName['COPA DEL REY']).toBe(20)
  })
  it('news: 1 manchete + 3 secundárias', () => {
    expect(headline.title.length).toBeGreaterThan(0)
    expect(secondary.length).toBe(3)
  })
  it('nenhum resultado vazio', () => {
    lastResults.forEach((r) => expect(r.score).toMatch(/^\d+–\d+$/))
  })
})
