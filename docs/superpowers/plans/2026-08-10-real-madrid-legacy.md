# Real Madrid — The Legacy · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One-page cinematográfica desktop-only do concept "Real Madrid — The Legacy", com 10 seções de linguagem própria costuradas por um arco de luz claro→escuro→claro, scroll a 60fps.

**Architecture:** Vite SPA com seções isoladas em `src/sections/`, cada uma registrando seus próprios ScrollTriggers. Lenis dirige o ticker do GSAP (um único RAF). Dados reais estáticos em `src/data/`. WebGL (R3F) existe apenas na seção Bernabéu, com lazy mount e fallback 2D.

**Tech Stack:** Vite + React 18 + TypeScript, Tailwind CSS v4, Lenis, GSAP/ScrollTrigger, React Three Fiber + drei (só Bernabéu), Vitest para lógica pura.

## Global Constraints

- Desktop-only: layout fixo para 1920×1080; aviso "Best experienced on desktop" abaixo de 1024px. Zero media queries mobile.
- Animações **somente** com `transform` e `opacity`. Nunca animar layout.
- Um único `requestAnimationFrame`: Lenis dentro do `gsap.ticker`. Nunca dois loops.
- WebGL apenas dentro de `src/sections/Bernabeu/`.
- Nenhum dado falso em tela: dados de `src/data/` são snapshots reais datados; onde este plano não pôde verificar, a task tem passo explícito de verificação no site oficial antes do commit.
- `prefers-reduced-motion`: scrubs/pins desligados via `gsap.matchMedia`.
- Disclaimer obrigatório no footer: "Unofficial concept for portfolio purposes. All imagery and trademarks belong to Real Madrid CF."
- Idioma da interface: inglês. Commits em inglês, convencionais (`feat:`, `chore:`...).
- Imagens em `public/assets/<secao>/`; AVIF/WebP preferidos.
- Code-splitting: **desvio consciente do spec** — só o chunk 3D (Bernabéu, ~centenas de KB de three.js) é lazy. As demais seções são DOM leve; dividi-las criaria waterfall de chunks durante o scroll, piorando exatamente o que o split deveria proteger.
- Fases do arco de luz (fundo interpolado continuamente, sem cortes): Hero/Matchday claro `#f5f4f0` → Squad entardecer → Legacy/Trophies/Bernabéu noite `#05070f` → Latest/Shop/Madridista/Footer retorno ao claro.

---

### Task 1: Scaffold Vite + Tailwind v4 + fontes + guarda de viewport

**Files:**
- Create: projeto Vite na raiz do repo (`package.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`)
- Create: `src/components/DesktopGate.tsx`

**Interfaces:**
- Produces: `App.tsx` renderizando `<DesktopGate>` + `<main id="page">` onde as seções serão empilhadas; tokens CSS `--color-day`, `--color-night`, `--color-gold`; fontes `font-display` (Anton) e `font-sans` (Space Grotesk).

- [ ] **Step 1: Scaffold e dependências**

```powershell
cd C:\Users\rickj\projetos\real-madrid-legacy
npm create vite@latest . -- --template react-ts
npm i tailwindcss @tailwindcss/vite lenis gsap
npm i @fontsource/anton @fontsource-variable/space-grotesk
npm i -D vitest
```

Se o `create vite` reclamar de pasta não-vazia (tem `docs/` e `.git`), escolha a opção "Ignore files and continue".

- [ ] **Step 2: Configurar Vite + Tailwind + scripts**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Em `package.json`, adicione ao bloco scripts: `"test": "vitest run"`.

- [ ] **Step 3: CSS global com tokens e fontes**

`src/index.css` (substituir conteúdo):

```css
@import 'tailwindcss';

@theme {
  --color-day: #f5f4f0;
  --color-dusk: #2a2d3a;
  --color-night: #05070f;
  --color-gold: #c9a24b;
  --color-ink: #0a0a0a;
  --font-display: 'Anton', sans-serif;
  --font-sans: 'Space Grotesk Variable', sans-serif;
}

html {
  background: var(--color-day);
}

body {
  font-family: var(--font-sans);
  color: var(--color-ink);
  overflow-x: hidden;
}
```

- [ ] **Step 4: App + DesktopGate**

`src/components/DesktopGate.tsx`:

```tsx
export default function DesktopGate() {
  return (
    <div className="fixed inset-0 z-50 hidden max-[1023px]:flex items-center justify-center bg-night text-day text-center p-8">
      <div>
        <p className="font-display text-4xl tracking-wide">REAL MADRID — THE LEGACY</p>
        <p className="mt-4 opacity-70">Best experienced on desktop.</p>
      </div>
    </div>
  )
}
```

`src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/anton'
import '@fontsource-variable/space-grotesk'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`src/App.tsx`:

```tsx
import DesktopGate from './components/DesktopGate'

export default function App() {
  return (
    <>
      <DesktopGate />
      <main id="page" />
    </>
  )
}
```

Apague `src/App.css` e qualquer boilerplate do template (logos, contador).

- [ ] **Step 5: Verificar dev server e build**

Run: `npm run dev` — página vazia clara, sem erros no console. `npm run build` — passa.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite + tailwind v4 + fonts + desktop gate"
```

---

### Task 2: Motor de scroll — Lenis ↔ GSAP + arco de luz (com teste)

**Files:**
- Create: `src/lib/lenis.ts`
- Create: `src/lib/lightArc.ts`
- Test: `src/lib/lightArc.test.ts`

**Interfaces:**
- Produces: `initSmoothScroll(): Lenis` (idempotente, um único RAF); `arcColor(progress: number): string` (cor hex interpolada para progress 0–1); `mountLightArc(): void` (ScrollTrigger global que aplica `arcColor` no background do `<html>`); `PHASES: { at: number; color: string }[]` exportado.

- [ ] **Step 1: Teste falhando do arco de luz**

`src/lib/lightArc.test.ts`:

```ts
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL — `lightArc` não existe.

- [ ] **Step 3: Implementar lightArc**

`src/lib/lightArc.ts`:

```ts
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

// gsap.utils.interpolate entre cores retorna "rgba(r,g,b,a)"; normalizamos para hex
function toHex(color: string): string {
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
```

- [ ] **Step 4: Rodar teste e ver passar**

Run: `npm test`
Expected: PASS (4 testes).

- [ ] **Step 5: Implementar lenis.ts (um único RAF)**

`src/lib/lenis.ts`:

```ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function initSmoothScroll(): Lenis {
  if (lenis) return lenis
  lenis = new Lenis({ autoRaf: false, duration: 1.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis!.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}
```

Em `src/App.tsx`, ligar o motor:

```tsx
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
```

- [ ] **Step 6: Verificação manual**

Adicione temporariamente dentro de `<main id="page">`: `<div style={{ height: '800vh' }} />`. Rode `npm run dev`, role a página: o fundo deve ir do claro ao escuro e voltar, suave. Remova o div temporário depois de verificar.

- [ ] **Step 7: Commit**

```bash
git add src/lib src/App.tsx
git commit -m "feat: smooth scroll engine (lenis+gsap single raf) and light arc"
```

---

### Task 3: Dados reais (snapshot 2026-08-10) + teste de integridade

**Files:**
- Create: `src/data/match.ts`, `src/data/squad.ts`, `src/data/legacy.ts`, `src/data/trophies.ts`, `src/data/news.ts`
- Test: `src/data/data.test.ts`

**Interfaces:**
- Produces (consumido pelas seções):
  - `match.ts`: `nextMatch: { home: string; away: string; dateISO: string; venue: string; competition: string }`, `lastResults: { opponent: string; score: string; home: boolean }[]`, `leagueNote: string`
  - `squad.ts`: `players: { index: string; name: string; position: string; number: number; nationality: string; stats: { label: string; value: string }[] }[]`
  - `legacy.ts`: `eras: { year: string; title: string; text: string; stat: string }[]`
  - `trophies.ts`: `trophies: { count: number; name: string }[]`
  - `news.ts`: `headline: { title: string; tag: string }`, `secondary: { title: string; tag: string }[]`

- [ ] **Step 1: VERIFICAR os dados no site oficial (obrigatório antes de escrever)**

Este plano foi escrito com o que foi observado em realmadrid.com em 2026-08-10 (amistoso vs Schalke 04 em 16/08; manchetes listadas abaixo). Antes de preencher `match.ts` e `squad.ts`, confirme com WebFetch/WebSearch em `https://www.realmadrid.com/en-US` (seções "Next Events" e "First Team"):
- Data, horário e estádio do próximo jogo.
- Elenco atual: escolha 6 jogadores confirmados na página oficial do primeiro time, com números de camisa corretos.
Corrija o código abaixo com os valores confirmados. **Não commitar valores não verificados.**

- [ ] **Step 2: Teste de integridade**

`src/data/data.test.ts`:

```ts
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
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL — módulos de data não existem.

- [ ] **Step 4: Escrever os dados (com valores verificados no Step 1)**

Todos os arquivos começam com: `// Snapshot real: 2026-08-10 — fonte: realmadrid.com (case gravado, não mantido vivo)`

`src/data/match.ts` (corrigir horário/estádio conforme Step 1):

```ts
export const nextMatch = {
  home: 'SCHALKE 04',
  away: 'REAL MADRID',
  dateISO: '2026-08-16T18:00:00+02:00',
  venue: 'Veltins-Arena, Gelsenkirchen',
  competition: 'PRE-SEASON FRIENDLY',
}

// Amistosos de pré-temporada (confirmar placares na seção de notícias/resultados)
export const lastResults = [
  { opponent: 'WSG Tirol', score: '3–0', home: false },
]

export const leagueNote = 'LA LIGA 2026-27 · SEASON STARTS AUGUST'
```

`src/data/squad.ts` (nomes/números conforme verificação — a lista abaixo é o ponto de partida observado):

```ts
export const players = [
  { index: '01', name: 'MBAPPÉ', position: 'FORWARD', number: 10, nationality: 'France', stats: [{ label: 'GOALS 25/26', value: '44' }] },
  { index: '02', name: 'VINÍCIUS JR', position: 'FORWARD', number: 7, nationality: 'Brazil', stats: [{ label: 'TROPHIES', value: '15' }] },
  { index: '03', name: 'BELLINGHAM', position: 'MIDFIELDER', number: 5, nationality: 'England', stats: [{ label: 'SINCE', value: '2023' }] },
  { index: '04', name: 'VALVERDE', position: 'MIDFIELDER', number: 8, nationality: 'Uruguay', stats: [{ label: 'APPS', value: '300+' }] },
  { index: '05', name: 'BERNARDO SILVA', position: 'MIDFIELDER', number: 20, nationality: 'Portugal', stats: [{ label: 'SIGNED', value: '2026' }] },
  { index: '06', name: 'COURTOIS', position: 'GOALKEEPER', number: 1, nationality: 'Belgium', stats: [{ label: 'CLEAN SHEETS', value: '150+' }] },
]
```

`src/data/legacy.ts`:

```ts
export const eras = [
  { year: '1902', title: 'THE FOUNDATION', text: 'Madrid Football Club is founded. A white shirt becomes an idea.', stat: 'YEAR ZERO' },
  { year: '1956', title: 'THE FIRST OF MANY', text: 'Di Stéfano leads Madrid to the first European Cup ever played.', stat: '1ST EUROPEAN CUP' },
  { year: '1998', title: 'LA SÉPTIMA', text: 'Thirty-two years of waiting end in Amsterdam.', stat: '7TH EUROPEAN CUP' },
  { year: '2002', title: 'THE GALÁCTICOS', text: 'Zidane volleys the most beautiful goal in a final. Glasgow, La Novena.', stat: '9TH EUROPEAN CUP' },
  { year: '2014', title: 'LA DÉCIMA', text: 'Ramos, minute 92:48. Lisbon. The obsession is over.', stat: '10TH EUROPEAN CUP' },
  { year: '2024', title: 'THE LEGACY CONTINUES', text: 'A fifteenth European Cup and a reborn Bernabéu.', stat: '15TH EUROPEAN CUP' },
]
```

`src/data/trophies.ts`:

```ts
export const trophies = [
  { count: 15, name: 'EUROPEAN CUPS' },
  { count: 36, name: 'LA LIGA' },
  { count: 20, name: 'COPA DEL REY' },
]
```

`src/data/news.ts` (manchetes reais observadas em 2026-08-10):

```ts
export const headline = {
  title: 'Real Madrid and adidas unveil the second jersey for the 2026-27 season',
  tag: 'CLUB',
}

export const secondary = [
  { title: 'Real Madrid is, for the fifth consecutive year, the most valuable club in the world', tag: 'CLUB' },
  { title: 'Real Madrid will play a friendly match against Schalke 04 on August 16', tag: 'MATCHES' },
  { title: 'Real Madrid Foundation: solidarity campaign with Venezuela', tag: 'FOUNDATION' },
]
```

- [ ] **Step 5: Rodar teste e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data
git commit -m "feat: real data snapshot (match, squad, legacy, trophies, news)"
```

---

### Task 4: Manifesto de assets + atmosferas base

**Files:**
- Create: `public/assets/ASSETS.md`
- Create: `public/assets/` subpastas por seção

**Interfaces:**
- Produces: convenção de paths que TODAS as seções usam: `/assets/<secao>/<nome>.(avif|webp|jpg)`. Seções renderizam com `onError` escondendo `<img>` quebada (fallback = atmosfera CSS), então a página funciona antes dos assets existirem.

- [ ] **Step 1: Criar estrutura e manifesto**

```powershell
New-Item -ItemType Directory -Force public/assets/hero, public/assets/matchday, public/assets/squad, public/assets/legacy, public/assets/trophies, public/assets/bernabeu, public/assets/shop
```

`public/assets/ASSETS.md`:

```markdown
# Assets — manifesto (preencher manualmente / via Higgsfield)

Tratamento padrão de fotos reais: duotone azul-noite (#05070f) → dourado (#c9a24b) + grain.
Fotos reais: imprensa/site oficial. IA (Higgsfield): SOMENTE texturas/atmosferas, nunca rostos.

| Path | Conteúdo | Fonte |
|---|---|---|
| hero/crest.webp | Escudo RM alto contraste | foto real tratada |
| squad/p01.webp … p06.webp | 1 foto por jogador de squad.ts, corpo inteiro, fundo removido | foto real tratada |
| legacy/1902.webp … 2024.webp | 1 foto histórica por era de legacy.ts | foto real tratada |
| trophies/european-cup.webp, la-liga.webp, copa-del-rey.webp | Troféu recortado, fundo transparente | foto real tratada |
| bernabeu/aerial.webp | Vista aérea noturna do Bernabéu (fallback 2D) | foto real tratada |
| bernabeu/stadium.glb | Modelo 3D (Sketchfab, licença CC) OU omitir → seção usa low-poly próprio | download |
| shop/kit-home.webp, kit-away.webp | Camisas 26/27 recortadas | foto real tratada |
| *(qualquer)/texture-*.webp | Grain, luz de estádio, atmosfera | IA Higgsfield |
```

- [ ] **Step 2: Commit**

```bash
git add public/assets
git commit -m "chore: asset folders and manifest"
```

---

### Task 5: Seção HERO

**Files:**
- Create: `src/sections/Hero/Hero.tsx`
- Modify: `src/App.tsx` (adicionar `<Hero />` dentro de `<main id="page">`)

**Interfaces:**
- Consumes: `nextMatch` de `src/data/match.ts`.
- Produces: seção com `id="hero"`; padrão de seção que as demais seguem: componente com `useRef` no root, `useEffect` cria `gsap.context(...)` no ref e `return () => ctx.revert()`.

- [ ] **Step 1: Implementar Hero**

`src/sections/Hero/Hero.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { nextMatch } from '../../data/match'
import { initSmoothScroll } from '../../lib/lenis'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-line]', {
        yPercent: 110,
        stagger: 0.12,
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.2,
      })
      gsap.to('[data-particle]', {
        y: -30,
        opacity: 0,
        stagger: { each: 0.4, repeat: -1 },
        duration: 3,
        ease: 'none',
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const scrollToMatch = () => {
    initSmoothScroll().scrollTo('#matchday')
  }

  const dateLabel = new Date(nextMatch.dateISO)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    .toUpperCase()

  return (
    <section ref={root} id="hero" className="relative h-screen overflow-hidden">
      <img
        src="/assets/hero/crest.webp"
        alt=""
        onError={(e) => (e.currentTarget.style.display = 'none')}
        className="absolute right-[8vw] top-1/2 w-[22vw] -translate-y-1/2 opacity-15"
      />
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          data-particle
          className="absolute size-1 rounded-full bg-gold/60"
          style={{ left: `${(i * 137) % 100}%`, top: `${(i * 61) % 100}%` }}
        />
      ))}
      <div className="flex h-full flex-col justify-center pl-[8vw]">
        <div className="overflow-hidden">
          <h1 data-line className="font-display text-[11vw] leading-[0.9] tracking-tight">REAL MADRID</h1>
        </div>
        <div className="overflow-hidden">
          <p data-line className="font-display text-[3.2vw] text-gold">THE LEGACY NEVER STOPS.</p>
        </div>
        <div className="overflow-hidden mt-6">
          <p data-line className="text-sm tracking-[0.3em] opacity-60">
            {nextMatch.competition} · {dateLabel}
          </p>
        </div>
      </div>
      <button
        onClick={scrollToMatch}
        className="absolute bottom-10 left-[8vw] text-sm tracking-[0.3em] border-b border-ink pb-1 hover:text-gold hover:border-gold transition-colors"
      >
        NEXT MATCH →
      </button>
    </section>
  )
}
```

Em `App.tsx`, importe e renderize `<Hero />` dentro de `<main id="page">`.

- [ ] **Step 2: Verificar**

Run: `npm run dev`. Título entra com stagger de baixo para cima, partículas douradas flutuam, botão presente. `npm run build` passa.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Hero src/App.tsx
git commit -m "feat: hero section"
```

---

### Task 6: Seção MATCHDAY (countdown com teste)

**Files:**
- Create: `src/lib/countdown.ts`
- Test: `src/lib/countdown.test.ts`
- Create: `src/sections/Matchday/Matchday.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `nextMatch`, `lastResults`, `leagueNote` de `src/data/match.ts`.
- Produces: `countdownParts(targetISO: string, now: Date): { days: string; hours: string; minutes: string } | null` (null se já passou); seção `id="matchday"` (alvo do scroll do Hero).

- [ ] **Step 1: Teste falhando do countdown**

`src/lib/countdown.test.ts`:

```ts
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npm test` — FAIL, módulo não existe.

- [ ] **Step 3: Implementar**

`src/lib/countdown.ts`:

```ts
export function countdownParts(targetISO: string, now: Date) {
  const diff = Date.parse(targetISO) - now.getTime()
  if (diff <= 0) return null
  const pad = (n: number) => String(n).padStart(2, '0')
  const minutes = Math.floor(diff / 60000)
  return {
    days: pad(Math.floor(minutes / 1440)),
    hours: pad(Math.floor((minutes % 1440) / 60)),
    minutes: pad(minutes % 60),
  }
}
```

- [ ] **Step 4: Rodar teste e ver passar**

Run: `npm test` — PASS.

- [ ] **Step 5: Implementar seção**

`src/sections/Matchday/Matchday.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextMatch, lastResults, leagueNote } from '../../data/match'
import { countdownParts } from '../../lib/countdown'

gsap.registerPlugin(ScrollTrigger)

export default function Matchday() {
  const root = useRef<HTMLElement>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-club]', {
        scrollTrigger: { trigger: root.current, start: 'top 60%' },
        xPercent: (i) => (i === 0 ? -40 : 40),
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.from('[data-meta]', {
        scrollTrigger: { trigger: root.current, start: 'top 50%' },
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const cd = countdownParts(nextMatch.dateISO, now)
  const kickoff = new Date(nextMatch.dateISO)

  return (
    <section ref={root} id="matchday" className="min-h-screen py-[12vh] px-[8vw]">
      <p className="text-sm tracking-[0.4em] opacity-50">01 — MATCHDAY</p>
      <div className="mt-[8vh] flex items-center justify-between">
        <h2 data-club className="font-display text-[6.5vw] leading-none">{nextMatch.home}</h2>
        <span className="font-display text-[3vw] text-gold">VS</span>
        <h2 data-club className="font-display text-[6.5vw] leading-none text-right">{nextMatch.away}</h2>
      </div>
      <div className="mt-[8vh] grid grid-cols-4 gap-8 border-t border-current/15 pt-8">
        <div data-meta>
          <p className="text-xs tracking-[0.3em] opacity-50">KICK-OFF</p>
          <p className="font-display text-3xl mt-2">
            {kickoff.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()} —{' '}
            {kickoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div data-meta>
          <p className="text-xs tracking-[0.3em] opacity-50">VENUE</p>
          <p className="font-display text-3xl mt-2">{nextMatch.venue}</p>
        </div>
        <div data-meta>
          <p className="text-xs tracking-[0.3em] opacity-50">COMPETITION</p>
          <p className="font-display text-3xl mt-2">{nextMatch.competition}</p>
        </div>
        <div data-meta>
          <p className="text-xs tracking-[0.3em] opacity-50">COUNTDOWN</p>
          <p className="font-display text-3xl mt-2 text-gold">
            {cd ? `${cd.days}D ${cd.hours}H ${cd.minutes}M` : 'MATCHDAY'}
          </p>
        </div>
      </div>
      <div className="mt-[6vh] flex items-end justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] opacity-50">LAST RESULTS</p>
          {lastResults.map((r) => (
            <p key={r.opponent} className="mt-2 font-display text-xl">
              {r.home ? 'RMA' : r.opponent.slice(0, 3).toUpperCase()} {r.score}{' '}
              {r.home ? r.opponent.slice(0, 3).toUpperCase() : 'RMA'}
            </p>
          ))}
        </div>
        <p className="text-sm tracking-[0.3em] opacity-50">{leagueNote}</p>
      </div>
    </section>
  )
}
```

Adicionar `<Matchday />` após `<Hero />` em `App.tsx`.

- [ ] **Step 6: Verificar**

`npm run dev`: clicar em `NEXT MATCH →` no hero rola suave até a seção; escudos/nomes entram dos lados; countdown mostra valores reais. `npm test` e `npm run build` passam.

- [ ] **Step 7: Commit**

```bash
git add src/lib/countdown.ts src/lib/countdown.test.ts src/sections/Matchday src/App.tsx
git commit -m "feat: matchday section with real countdown"
```

---

### Task 7: Seção THE SQUAD (editorial horizontal pinado)

**Files:**
- Create: `src/sections/Squad/Squad.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `players` de `src/data/squad.ts`.
- Produces: seção `id="squad"` pinada; painéis horizontais movidos por scrub.

- [ ] **Step 1: Implementar**

`src/sections/Squad/Squad.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { players } from '../../data/squad'

gsap.registerPlugin(ScrollTrigger)

export default function Squad() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = root.current!.querySelector('[data-track]') as HTMLElement
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="squad" className="overflow-hidden text-day">
      <div data-track className="flex h-screen w-max">
        {players.map((p) => (
          <article key={p.index} className="group relative flex h-screen w-screen shrink-0 items-center px-[8vw]">
            <img
              src={`/assets/squad/p${p.index}.webp`}
              alt={p.name}
              onError={(e) => (e.currentTarget.style.display = 'none')}
              className="absolute right-[10vw] bottom-0 h-[88vh] object-contain object-bottom
                         [filter:grayscale(1)_sepia(0.3)_hue-rotate(190deg)_saturate(2)_brightness(0.8)]
                         transition-[filter] duration-500 group-hover:[filter:none]"
            />
            <div className="relative">
              <p className="font-display text-[2vw] text-gold">{p.index}</p>
              <h2 className="font-display text-[9vw] leading-[0.9]">{p.name}</h2>
              <p className="mt-2 text-sm tracking-[0.4em] opacity-60">{p.position}</p>
              <div className="mt-8 max-w-xs opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="flex gap-10 border-t border-day/20 pt-4">
                  <div>
                    <p className="text-xs tracking-[0.3em] opacity-50">NUMBER</p>
                    <p className="font-display text-4xl text-gold">{p.number}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.3em] opacity-50">NATION</p>
                    <p className="font-display text-2xl">{p.nationality}</p>
                  </div>
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs tracking-[0.3em] opacity-50">{s.label}</p>
                      <p className="font-display text-2xl">{s.value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm tracking-[0.3em] border-b border-day/40 pb-1 inline-block">VIEW PLAYER →</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
```

Adicionar `<Squad />` em `App.tsx` após `<Matchday />`.

Nota: a numeração de assets usa `p${p.index}` → `p01.webp`…`p06.webp`, casando com o manifesto da Task 4.

- [ ] **Step 2: Verificar**

`npm run dev`: seção pina, scroll vertical vira deslocamento horizontal, um jogador por tela; hover revela stats e `VIEW PLAYER →`. Com fotos ausentes, tipografia segura a cena (sem buraco visual). `npm run build` passa.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Squad src/App.tsx
git commit -m "feat: squad section (pinned horizontal editorial)"
```

---

### Task 8: Seção THE LEGACY (timeline scrub)

**Files:**
- Create: `src/sections/Legacy/Legacy.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `eras` de `src/data/legacy.ts`.
- Produces: seção `id="legacy"` pinada com scrub trocando eras.

- [ ] **Step 1: Implementar**

`src/sections/Legacy/Legacy.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { eras } from '../../data/legacy'

gsap.registerPlugin(ScrollTrigger)

export default function Legacy() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-era]')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${slides.length * 90}%`,
            pin: true,
            scrub: 0.5,
          },
        })
        slides.forEach((slide, i) => {
          if (i === 0) return
          tl.to(slides[i - 1], { opacity: 0, scale: 0.96, duration: 1 })
            .fromTo(slide, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1 }, '<0.3')
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="legacy" className="relative h-screen overflow-hidden text-day">
      <p className="absolute top-[8vh] left-[8vw] z-10 text-sm tracking-[0.4em] opacity-50">03 — THE LEGACY</p>
      {eras.map((era, i) => (
        <div
          key={era.year}
          data-era
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <img
            src={`/assets/legacy/${era.year}.webp`}
            alt=""
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="absolute inset-0 h-full w-full object-cover opacity-25
                       [filter:grayscale(1)_sepia(0.4)_hue-rotate(190deg)]"
          />
          <div className="relative text-center">
            <p className="font-display text-[18vw] leading-none">{era.year}</p>
            <p className="font-display text-[2vw] text-gold mt-2">{era.title}</p>
            <p className="mx-auto mt-4 max-w-md text-sm opacity-70">{era.text}</p>
            <p className="mt-6 text-xs tracking-[0.4em] opacity-50">{era.stat}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
```

Adicionar `<Legacy />` em `App.tsx`.

- [ ] **Step 2: Verificar**

`npm run dev`: seção pina; scroll cruza 1902 → 2024 com crossfade + leve zoom; fundo global já está escuro nessa altura (arco de luz). `npm run build` passa.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Legacy src/App.tsx
git commit -m "feat: legacy section (era timeline scrub)"
```

---

### Task 9: Seção TROPHIES (monumental)

**Files:**
- Create: `src/sections/Trophies/Trophies.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `trophies` de `src/data/trophies.ts`.
- Produces: seção `id="trophies"` pinada; número gigante com contador + troféu por slide.

- [ ] **Step 1: Implementar**

`src/sections/Trophies/Trophies.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { trophies } from '../../data/trophies'

gsap.registerPlugin(ScrollTrigger)

const ASSET: Record<string, string> = {
  'EUROPEAN CUPS': 'european-cup',
  'LA LIGA': 'la-liga',
  'COPA DEL REY': 'copa-del-rey',
}

export default function Trophies() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-trophy]')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${slides.length * 100}%`,
            pin: true,
            scrub: 0.5,
          },
        })
        slides.forEach((slide, i) => {
          const counter = slide.querySelector('[data-count]') as HTMLElement
          const target = Number(counter.dataset.count)
          if (i > 0) {
            tl.to(slides[i - 1], { opacity: 0, yPercent: -8, duration: 1 })
            tl.fromTo(slide, { opacity: 0, yPercent: 8 }, { opacity: 1, yPercent: 0, duration: 1 }, '<0.3')
          }
          tl.fromTo(
            counter,
            { innerText: 0 },
            { innerText: target, snap: { innerText: 1 }, duration: 1.2, ease: 'power1.out' },
            i === 0 ? 0 : '<0.2',
          )
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="trophies" className="relative h-screen overflow-hidden text-day">
      <p className="absolute top-[8vh] left-[8vw] z-10 text-sm tracking-[0.4em] opacity-50">04 — TROPHIES</p>
      {trophies.map((t, i) => (
        <div
          key={t.name}
          data-trophy
          className="absolute inset-0 flex items-center justify-between px-[10vw]"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <div>
            <p data-count={t.count} className="font-display text-[24vw] leading-none text-gold">0</p>
            <p className="font-display text-[3vw]">{t.name}</p>
          </div>
          <img
            src={`/assets/trophies/${ASSET[t.name]}.webp`}
            alt={t.name}
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="h-[70vh] object-contain drop-shadow-[0_0_80px_rgba(201,162,75,0.25)]"
          />
        </div>
      ))}
    </section>
  )
}
```

Adicionar `<Trophies />` em `App.tsx`.

- [ ] **Step 2: Verificar**

`npm run dev`: 15 → 36 → 20 com contadores subindo no scrub, troféu à direita. `npm run build` passa.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Trophies src/App.tsx
git commit -m "feat: trophies section (monumental counters)"
```

---

### Task 10: Seção THE BERNABÉU (R3F lazy + fallback)

**Files:**
- Create: `src/sections/Bernabeu/Bernabeu.tsx` (wrapper lazy + fallback)
- Create: `src/sections/Bernabeu/Scene.tsx` (Canvas R3F — único arquivo com WebGL)
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: nada de outras tasks (seção autônoma).
- Produces: seção `id="bernabeu"` pinada; `Scene` recebe prop `progress: React.MutableRefObject<number>` (0–1 do scrub) e move a câmera; wrapper decide 3D vs fallback.

- [ ] **Step 1: Instalar dependências 3D**

```powershell
npm i three @react-three/fiber @react-three/drei
npm i -D @types/three
```

- [ ] **Step 2: Implementar Scene (low-poly estilizado por padrão)**

`src/sections/Bernabeu/Scene.tsx` — geometria própria low-poly (anel de arquibancada + gramado + mastros de luz). Se `public/assets/bernabeu/stadium.glb` existir e tiver qualidade, trocar o grupo `<StadiumLowPoly />` por `useGLTF('/assets/bernabeu/stadium.glb')` mantendo a mesma coreografia de câmera.

```tsx
import { Canvas, useFrame } from '@react-three/fiber'
import type { MutableRefObject } from 'react'

function StadiumLowPoly() {
  return (
    <group>
      {/* gramado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.5, 6.8]} />
        <meshStandardMaterial color="#0c2f1c" />
      </mesh>
      {/* anel de arquibancada (toro achatado) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.2, 0]} scale={[1.4, 1, 1]}>
        <torusGeometry args={[7, 2.2, 4, 48]} />
        <meshStandardMaterial color="#151a26" flatShading />
      </mesh>
      {/* fachada */}
      <mesh position={[0, 2.8, 0]} scale={[1.4, 1, 1]}>
        <cylinderGeometry args={[9.4, 9.6, 3.2, 48, 1, true]} />
        <meshStandardMaterial color="#3a4152" flatShading side={2} />
      </mesh>
      {/* luzes de estádio */}
      {[[-6, 4.5, -4], [6, 4.5, -4], [-6, 4.5, 4], [6, 4.5, 4]].map((p, i) => (
        <pointLight key={i} position={p as [number, number, number]} intensity={30} color="#e8dcc0" />
      ))}
    </group>
  )
}

function Rig({ progress }: { progress: MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progress.current
    // aérea (alto/longe) → aproximação → nível do gramado
    camera.position.set(
      Math.sin(p * Math.PI * 0.5) * 14 * (1 - p * 0.8),
      22 - p * 20.5,
      22 - p * 14,
    )
    camera.lookAt(0, 1 - p, 0)
  })
  return null
}

export default function Scene({
  progress,
  frameloop,
}: {
  progress: MutableRefObject<number>
  frameloop: 'always' | 'never'
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 40, position: [0, 22, 22] }}
      frameloop={frameloop}
      onCreated={({ gl }) => gl.setClearColor('#05070f')}
    >
      <ambientLight intensity={0.15} />
      <StadiumLowPoly />
      <Rig progress={progress} />
      <fog attach="fog" args={['#05070f', 25, 55]} />
    </Canvas>
  )
}
```

- [ ] **Step 3: Implementar wrapper com lazy mount, pin e fallback**

`src/sections/Bernabeu/Bernabeu.tsx`:

```tsx
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Scene = lazy(() => import('./Scene'))

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!canvas.getContext('webgl2')
  } catch {
    return false
  }
}

export default function Bernabeu() {
  const root = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [mount3d, setMount3d] = useState(false)
  const [inView, setInView] = useState(false)
  const [use3d] = useState(webglAvailable)

  useEffect(() => {
    // lazy mount: só carrega o chunk 3D quando a seção se aproxima
    const mountIo = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setMount3d(true),
      { rootMargin: '100% 0px' },
    )
    // frameloop: renderiza só com a seção visível (spec: WebGL pausado fora do viewport)
    const viewIo = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    if (root.current) {
      mountIo.observe(root.current)
      viewIo.observe(root.current)
    }
    return () => {
      mountIo.disconnect()
      viewIo.disconnect()
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.4,
            onUpdate: (self) => (progress.current = self.progress),
          },
        })
          .fromTo('[data-btitle]', { opacity: 0, yPercent: 20 }, { opacity: 1, yPercent: 0, duration: 1 })
          .to('[data-btitle]', { opacity: 0, duration: 1 }, '+=1')
          .fromTo('[data-bsub]', { opacity: 0 }, { opacity: 1, duration: 1 })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="bernabeu" className="relative h-screen overflow-hidden text-day">
      <div className="absolute inset-0">
        {use3d && mount3d ? (
          <Suspense fallback={null}>
            <Scene progress={progress} frameloop={inView ? 'always' : 'never'} />
          </Suspense>
        ) : (
          <img
            src="/assets/bernabeu/aerial.webp"
            alt="Santiago Bernabéu aerial view"
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="h-full w-full object-cover opacity-60"
          />
        )}
      </div>
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center">
        <p data-btitle className="font-display text-[8vw] leading-none text-center">
          SANTIAGO<br />BERNABÉU
        </p>
        <p data-bsub className="mt-4 text-sm tracking-[0.4em] opacity-70" style={{ opacity: 0 }}>
          05 — THE HOME OF LEGENDS
        </p>
      </div>
    </section>
  )
}
```

Adicionar `<Bernabeu />` em `App.tsx`.

- [ ] **Step 4: Verificar**

`npm run dev`: seção pina por 250% de scroll; câmera desce da vista aérea ao gramado conforme scroll; título entra e sai. DevTools → Network: chunk do Scene só carrega perto da seção. Teste o fallback forçando `use3d = false` temporariamente. `npm run build` passa.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Bernabeu src/App.tsx package.json package-lock.json
git commit -m "feat: bernabeu section (lazy r3f scene with 2d fallback)"
```

---

### Task 11: Seções LATEST + SHOP

**Files:**
- Create: `src/sections/Latest/Latest.tsx`
- Create: `src/sections/Shop/Shop.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `headline`, `secondary` de `src/data/news.ts`.
- Produces: seções `id="latest"` e `id="shop"`.

- [ ] **Step 1: Implementar Latest**

`src/sections/Latest/Latest.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { headline, secondary } from '../../data/news'

gsap.registerPlugin(ScrollTrigger)

export default function Latest() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-news]', {
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="latest" className="min-h-screen py-[14vh] px-[8vw]">
      <p className="text-sm tracking-[0.4em] opacity-50">06 — LATEST</p>
      <article data-news className="mt-[6vh] border-b border-current/15 pb-10">
        <p className="text-xs tracking-[0.3em] text-gold">{headline.tag}</p>
        <h2 className="font-display text-[4.5vw] leading-tight mt-3 max-w-[70vw]">{headline.title}</h2>
      </article>
      <div className="grid grid-cols-3 gap-10 mt-10">
        {secondary.map((n) => (
          <article data-news key={n.title}>
            <p className="text-xs tracking-[0.3em] text-gold">{n.tag}</p>
            <h3 className="font-display text-2xl mt-2 leading-snug">{n.title}</h3>
          </article>
        ))}
      </div>
      <p className="mt-10 text-xs opacity-40">Headlines snapshot — realmadrid.com, 10 Aug 2026</p>
    </section>
  )
}
```

- [ ] **Step 2: Implementar Shop**

`src/sections/Shop/Shop.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = ['HOME KIT', 'AWAY KIT', 'TRAINING', 'LIFESTYLE']

export default function Shop() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-kit]',
        { scale: 1.15, yPercent: 6 },
        {
          scale: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 0.5 },
        },
      )
      gsap.from('[data-cat]', {
        scrollTrigger: { trigger: '[data-cats]', start: 'top 80%' },
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="shop" className="min-h-screen py-[14vh] px-[8vw]">
      <p className="text-sm tracking-[0.4em] opacity-50">07 — SHOP</p>
      <div className="mt-[6vh] grid grid-cols-2 items-center gap-16">
        <div>
          <h2 className="font-display text-[7vw] leading-[0.9]">THE NEW<br />KIT</h2>
          <p className="mt-6 max-w-sm text-sm opacity-70">The 2026-27 second jersey, by adidas.</p>
          <p className="mt-8 inline-block border-b border-current pb-1 text-sm tracking-[0.3em] hover:text-gold hover:border-gold transition-colors cursor-pointer">
            EXPLORE COLLECTION →
          </p>
        </div>
        <div className="overflow-hidden">
          <img
            data-kit
            src="/assets/shop/kit-away.webp"
            alt="Real Madrid 2026-27 away kit"
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="w-full object-contain"
          />
        </div>
      </div>
      <div data-cats className="mt-[10vh] grid grid-cols-4 border-t border-current/15">
        {CATEGORIES.map((c) => (
          <p key={c} data-cat className="py-8 font-display text-2xl tracking-wide border-r border-current/15 last:border-r-0 pl-6 hover:text-gold transition-colors cursor-pointer">
            {c}
          </p>
        ))}
      </div>
    </section>
  )
}
```

Adicionar `<Latest />` e `<Shop />` em `App.tsx`.

- [ ] **Step 3: Verificar**

`npm run dev`: Latest com 1 manchete + 3 secundárias em hierarquia; Shop com kit em zoom-out no scroll e trilha de categorias. Sem preços em lugar nenhum. `npm run build` passa.

- [ ] **Step 4: Commit**

```bash
git add src/sections/Latest src/sections/Shop src/App.tsx
git commit -m "feat: latest (editorial news) and shop (premium kit) sections"
```

---

### Task 12: MADRIDISTA + FOOTER + disclaimer

**Files:**
- Create: `src/sections/Madridista/Madridista.tsx`
- Create: `src/sections/Footer/Footer.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: fecho da página; links do footer são âncoras para os `id`s das seções (`#hero`, `#squad`, `#matchday`, `#legacy`, `#bernabeu`, `#shop`) via `initSmoothScroll().scrollTo(...)`.

- [ ] **Step 1: Implementar Madridista**

`src/sections/Madridista/Madridista.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Madridista() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-word]', {
        scrollTrigger: { trigger: root.current, start: 'top 60%' },
        yPercent: 110,
        stagger: 0.15,
        duration: 1,
        ease: 'power4.out',
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="madridista" className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="text-sm tracking-[0.4em] opacity-50">08 — MADRIDISTA</p>
      <div className="mt-8 overflow-hidden">
        <h2 data-word className="font-display text-[10vw] leading-none">MADRIDISTA</h2>
      </div>
      <div className="overflow-hidden">
        <p data-word className="font-display text-[2vw] text-gold mt-2">The club. The people. The legacy.</p>
      </div>
      <p className="mt-10 inline-block border-b border-current pb-1 text-sm tracking-[0.3em] hover:text-gold hover:border-gold transition-colors cursor-pointer">
        JOIN THE COMMUNITY →
      </p>
    </section>
  )
}
```

- [ ] **Step 2: Implementar Footer**

`src/sections/Footer/Footer.tsx`:

```tsx
import { initSmoothScroll } from '../../lib/lenis'

const LINKS = [
  { label: 'Club', target: '#hero' },
  { label: 'Matches', target: '#matchday' },
  { label: 'Squad', target: '#squad' },
  { label: 'History', target: '#legacy' },
  { label: 'Bernabéu', target: '#bernabeu' },
  { label: 'Shop', target: '#shop' },
]

export default function Footer() {
  return (
    <footer className="px-[8vw] pb-10 pt-[10vh]">
      <div className="flex items-start justify-between border-t border-current/15 pt-10">
        <p className="font-display text-3xl">REAL MADRID</p>
        <nav className="grid grid-cols-3 gap-x-16 gap-y-3">
          {LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => initSmoothScroll().scrollTo(l.target)}
              className="text-left text-sm opacity-70 hover:opacity-100 hover:text-gold transition-all"
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-16 flex items-end justify-between text-xs opacity-40">
        <p>Partners: Emirates · adidas</p>
        <p className="max-w-md text-right">
          Unofficial concept for portfolio purposes. All imagery and trademarks belong to Real Madrid CF.
        </p>
      </div>
    </footer>
  )
}
```

Adicionar `<Madridista />` e `<Footer />` em `App.tsx`. Ordem final em `<main id="page">`: Hero, Matchday, Squad, Legacy, Trophies, Bernabeu, Latest, Shop, Madridista, Footer.

- [ ] **Step 3: Verificar**

`npm run dev`: links do footer rolam suave até cada seção; disclaimer visível. `npm test` e `npm run build` passam.

- [ ] **Step 4: Commit**

```bash
git add src/sections/Madridista src/sections/Footer src/App.tsx
git commit -m "feat: madridista closing and minimalist footer with disclaimer"
```

---

### Task 13: Passe de performance + refresh de ScrollTrigger + README

**Files:**
- Modify: `src/App.tsx`
- Create: `README.md`

**Interfaces:**
- Consumes: tudo.
- Produces: página final estável; `ScrollTrigger.refresh()` após load de fontes/imagens (pins horizontais dependem de medidas corretas).

- [ ] **Step 1: Refresh após assets**

Em `src/App.tsx`, dentro do `useEffect` existente, adicionar após `mountLightArc()`:

```tsx
document.fonts.ready.then(() => ScrollTrigger.refresh())
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
```

(importar `ScrollTrigger` de `gsap/ScrollTrigger` e registrar no topo do arquivo).

- [ ] **Step 2: Auditoria de performance (manual, com evidência)**

Com `npm run dev` aberto em janela 1920×1080:
1. DevTools → Performance → gravar um scroll completo da página. Critério: sem frames longos (>32ms) fora do primeiro load do chunk 3D.
2. DevTools → Rendering → "Paint flashing": rolar e confirmar que seções fora do viewport não pintam.
3. Verificar no console que não há warnings do ScrollTrigger (pins aninhados/medidas).
Se houver jank: suspeitos na ordem — filtros CSS nos `<img>` do Squad/Legacy (pré-processar as imagens com o duotone e remover o filter), partículas do Hero, `scrub` muito baixo.

- [ ] **Step 3: README com o posicionamento do case**

`README.md`:

```markdown
# REAL MADRID — THE LEGACY

Unofficial concept · one-page cinematic experience · desktop-only (built for recording)

**Problem.** The official site works as an institutional news portal.
**Proposal.** Explore how the same brand could turn its history, football and stadium into an immersive digital experience.
**Result.** 10 sections, each with its own visual language, stitched by a continuous light arc (day → night → day), scrolling at 60fps.

Stack: Vite · React · TypeScript · Tailwind v4 · Lenis · GSAP ScrollTrigger · React Three Fiber (Bernabéu section only).

All imagery and trademarks belong to Real Madrid CF. Data is a dated snapshot (10 Aug 2026) — this is a recorded case, not a live product.

Dev: `npm run dev` · Test: `npm test` · Build: `npm run build`
```

- [ ] **Step 4: Verificação final**

Run: `npm test` (todos passam), `npm run build` (passa), scroll completo sem jank visível.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: performance pass, scrolltrigger refresh and case readme"
```

---

## Fora do plano (manual, pós-implementação)

- Curadoria dos assets reais (fotos de imprensa) e geração de texturas via Higgsfield, seguindo `public/assets/ASSETS.md`. A página funciona sem eles (fallbacks tipográficos), mas a gravação final precisa deles.
- Busca de modelo `stadium.glb` no Sketchfab (licença CC). O low-poly próprio já entrega a seção.
- Gravação do case em 1920×1080.
