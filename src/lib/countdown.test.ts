import { describe, it, expect } from 'vitest'
import { countdownParts } from './countdown'

describe('countdownParts', () => {
  it('calcula dias/horas/minutos com zero à esquerda', () => {
    const parts = countdownParts('2026-08-16T18:00:00+02:00', new Date('2026-08-10T18:00:00+02:00'))
    expect(parts).toEqual({ days: '06', hours: '00', minutes: '00' })
  })
  it('retorna null para data passada', () => {
    expect(countdownParts('2026-08-01T00:00:00Z', new Date('2026-08-10T00:00:00Z'))).toBeNull()
  })
})
