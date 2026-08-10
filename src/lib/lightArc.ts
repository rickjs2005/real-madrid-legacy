import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const DAY = '#f5f4f0'
export const DUSK = '#2a2d3a'
export const NIGHT = '#05070f'
export const DAWN = '#8a8676'

export interface ArcStop {
  at: number
  color: string
}

// Direção "Los Blancos": o site inteiro é branco monumental; a noite existe UMA
// vez — o mergulho no Bernabéu (estádio 3D aceso + Juanito) — e volta ao branco.
// Os stops abaixo são só o fallback estático (antes do 1º refresh, ou em teste);
// em runtime, mountLightArc() substitui pelas frações REAIS medidas a partir da
// posição de cada seção no documento (ver measureStops/deriveStops), porque os
// pin-spacers esticam a página e frações "chutadas" não acompanham isso.
export const PHASES: ArcStop[] = [
  { at: 0, color: DAY }, // hero → tudo branco até o estádio
  { at: 0.72, color: DAY }, // trophies ainda branco
  { at: 0.8, color: NIGHT }, // bernabeu — o único mergulho noturno
  { at: 0.9, color: DAY }, // latest — de volta ao branco
  { at: 1, color: DAY }, // shop/madridista/footer
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

// Pura: dado um progress 0..1 e uma lista de stops ORDENADA (at estritamente
// crescente, primeiro em 0 e último em 1), devolve a cor interpolada. `stops` é
// opcional pra permitir testar a interpolação isolada da medição de DOM (deriveStops).
export function arcColor(progress: number, stops: ArcStop[] = PHASES): string {
  const p = gsap.utils.clamp(0, 1, progress)
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i].at) {
      const a = stops[i - 1]
      const b = stops[i]
      const local = b.at === a.at ? 0 : (p - a.at) / (b.at - a.at)
      return toHex(gsap.utils.interpolate(a.color, b.color, local))
    }
  }
  return stops[stops.length - 1].color
}

export interface AnchorMeasurement {
  color: string
  /** posição da âncora em coordenadas de documento (rect.top + scrollY), mesma
   *  unidade de `start`/`end`. */
  top: number
}

// Pura: recebe as posições já medidas (sem tocar no DOM) e o intervalo de scroll
// do trigger principal (`start`/`end`, em px), e devolve stops normalizados 0..1.
// Testável sem jsdom porque não lê nada do documento — só faz a conta.
export function deriveStops(anchors: AnchorMeasurement[], start: number, end: number): ArcStop[] {
  const span = end - start
  if (!(span > 0) || anchors.length === 0) return PHASES

  const raw = anchors.map((a) => ({ color: a.color, at: gsap.utils.clamp(0, 1, (a.top - start) / span) }))
  // força as pontas em 0/1 mesmo que a 1ª/última âncora não caiam exatamente lá
  // (ex.: #hero não é o pixel 0 cravado, ou a última seção medida tem alguma margem).
  raw[0] = { ...raw[0], at: 0 }
  raw[raw.length - 1] = { ...raw[raw.length - 1], at: 1 }

  // descarta empates/retrocessos pra nunca dividir por zero (ou interpolar "pra trás")
  // em arcColor — não deveria acontecer com seções reais, mas é barato se proteger.
  const stops: ArcStop[] = []
  for (const s of raw) {
    const prev = stops[stops.length - 1]
    if (prev && s.at <= prev.at) continue
    stops.push(s)
  }
  return stops.length >= 2 ? stops : PHASES
}

// Ordem = ordem visual das seções em App.tsx. A cor de cada âncora é a cor que o
// fundo já deve ter chegado quando aquela seção COMEÇA — a transição pro próximo
// tom acontece ao longo do scroll da seção anterior (scroll da seção "b", entre
// b e c), nunca dentro da seção que precisa do contraste já resolvido.
const SECTION_ANCHORS: { id: string; color: string }[] = [
  { id: 'hero', color: DAY },
  { id: 'trophies', color: DAY }, // segura o branco até a porta do estádio
  { id: 'bernabeu', color: NIGHT }, // o único mergulho noturno
  { id: 'latest', color: DAY }, // saiu do estádio: branco de novo
  { id: 'madridista', color: DAY },
]

// Impura: lê a posição real de cada seção no documento. Chamada só a partir de
// onRefresh (ou logo após criar o trigger), quando os pin-spacers de
// Squad/Legacy/Trophies/Bernabéu já existem no DOM — por isso rect.top + scrollY
// já reflete o espaço extra que cada pin ocupa, independente da posição de scroll
// atual (o spacer tem altura fixa; só o conteúdo pinado é que "flutua" dentro dele).
function measureStops(self: ScrollTrigger): ArcStop[] {
  const scrollY = window.scrollY
  const anchors: AnchorMeasurement[] = []
  for (const { id, color } of SECTION_ANCHORS) {
    const el = document.getElementById(id)
    if (!el) continue
    // Squad/Legacy/Trophies/Bernabéu são pinadas: o GSAP tira o elemento do
    // fluxo normal e o translada com transform durante o pin, então quando um
    // ScrollTrigger.refresh() dispara NO MEIO do scroll (resize, window.load
    // tardio), rect.top do próprio elemento reflete a posição pinada/traduzida
    // do instante, não a posição real dele no documento — corrompendo o stop.
    // O pin-spacer que o GSAP injeta como parent, porém, sempre fica plantado
    // na posição documento correta (é ele que tem a altura do scroll pinado),
    // então medir o spacer é imune a isso.
    const box = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
    anchors.push({ color, top: box.getBoundingClientRect().top + scrollY })
  }
  return deriveStops(anchors, self.start, self.end)
}

let trigger: ScrollTrigger | null = null

export function mountLightArc(): void {
  // idempotente: em dev, StrictMode roda efeitos 2x, e sem isso sobrava um trigger
  // "zumbi" da montagem anterior competindo com o novo (dois onUpdate escrevendo o
  // html.style.background com stops diferentes/desatualizados).
  trigger?.kill()

  let stops = PHASES

  trigger = ScrollTrigger.create({
    trigger: '#page',
    start: 'top top',
    end: 'bottom bottom',
    onRefresh: (self) => {
      stops = measureStops(self)
    },
    onUpdate: (self) => {
      document.documentElement.style.background = arcColor(self.progress, stops)
    },
  })

  // primeira medição imediata: não espera o próximo refresh (fontes/load, disparado
  // em App.tsx) pra sair dos stops "chutados" do PHASES — o próprio ScrollTrigger.create
  // já calcula start/end sincronamente, então dá pra medir de cara.
  stops = measureStops(trigger)
}
