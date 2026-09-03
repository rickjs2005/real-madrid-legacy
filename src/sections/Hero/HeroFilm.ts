import * as THREE from 'three'
import { getVelocity } from '../../lib/velocity'

// O filme do hero como quad WebGL: uma sequência de frames (túnel → gramado)
// scrubada pelo scroll, e a tipografia REAL MADRID vivendo "no fundo do túnel".
// Não há depth map: a luminância do próprio frame é o depth — as paredes pretas
// do túnel ocluem as letras, a boca clara revela. Conforme a câmera avança, a
// abertura cresce e o nome ganha a tela inteira na frente da arquitetura.

const FRAME_COUNT = 240
const framePath = (i: number) => `/assets/film/tunnel/f_${String(i).padStart(3, '0')}.webp`

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uFrame;
uniform sampler2D uFrameB;
uniform float uMixB;      // crossfade para o fallback de stills
uniform sampler2D uText;
uniform float uFrameAspect;
uniform float uPlane;
uniform float uScale;     // escala do nome (0.1 = longe, no fundo do túnel; 1 = na frente)
uniform float uFront;     // 0..1 força o nome para a frente de tudo
uniform float uVel;       // scroll velocity
uniform float uTime;
uniform float uDim;       // escurece a cena (tensão) 0..1

vec2 coverUv(vec2 uv, float imgAspect, float planeAspect) {
  vec2 s = vec2(1.0);
  if (imgAspect > planeAspect) s.x = planeAspect / imgAspect;
  else s.y = imgAspect / planeAspect;
  return (uv - 0.5) * s + 0.5;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 uv = vUv;
  // distorção por velocidade: a imagem "estica" quando o scroll acelera
  uv.y += uVel * 0.03 * sin(uv.x * 3.1416);
  vec2 fuv = coverUv(uv, uFrameAspect, uPlane);
  vec3 scene = texture2D(uFrame, fuv).rgb;
  if (uMixB > 0.0) scene = mix(scene, texture2D(uFrameB, fuv).rgb, uMixB);

  // tratamento: contraste alto, pretos profundos, leve dessaturação fria
  float l = dot(scene, vec3(0.299, 0.587, 0.114));
  scene = mix(vec3(l), scene, 0.78);
  scene = (scene - 0.5) * 1.18 + 0.47;
  scene = max(scene, 0.0);
  scene *= 1.0 - uDim * 0.85;

  // nome: textura centrada, escalada
  vec2 tuv = (vUv - 0.5) / uScale + 0.5;
  float inside = step(0.0, tuv.x) * step(tuv.x, 1.0) * step(0.0, tuv.y) * step(tuv.y, 1.0);
  float t = texture2D(uText, tuv).a * inside;

  // profundidade por luminância: o nome só existe onde a cena está aberta/clara
  float open = smoothstep(0.16, 0.34, l);
  float vis = max(open, uFront);
  // borda das letras recebe um fio de luz do estádio quando ainda estão no fundo
  vec3 ink = mix(vec3(0.92, 0.92, 0.9), vec3(1.0), uFront);
  vec3 col = mix(scene, ink, t * vis);

  // vinheta + grain
  float vig = smoothstep(1.25, 0.35, length((vUv - 0.5) * vec2(1.15, 1.0)));
  col *= mix(0.55, 1.0, vig);
  col += (hash(vUv * 1400.0 + uTime) - 0.5) * 0.045;
  gl_FragColor = vec4(col, 1.0);
}
`

export type HeroFilmHandle = {
  setProgress: (p: number) => void
  dispose: () => void
}

function makeTextTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = 1152
  const g = c.getContext('2d')!
  g.clearRect(0, 0, c.width, c.height)
  g.fillStyle = '#fff'
  g.textAlign = 'center'
  g.textBaseline = 'alphabetic'
  // Archivo variável: 'expanded' = wdth 125 — o mesmo corte das headlines DOM
  g.font = "800 expanded 400px 'Archivo Variable'"
  const track = -0.045 * 400
  const draw = (text: string, y: number) => {
    // tracking manual (canvas não tem letter-spacing consistente)
    const widths = [...text].map((ch) => g.measureText(ch).width)
    const total = widths.reduce((a, b) => a + b, 0) + track * (text.length - 1)
    let x = c.width / 2 - total / 2
    g.textAlign = 'left'
    ;[...text].forEach((ch, i) => {
      g.fillText(ch, x, y)
      x += widths[i] + track
    })
  }
  draw('REAL', 520)
  draw('MADRID', 860)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.minFilter = THREE.LinearMipmapLinearFilter
  t.generateMipmaps = true
  t.anisotropy = 8
  return t
}

export function mountHeroFilm(canvas: HTMLCanvasElement): HeroFilmHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(window.innerWidth, window.innerHeight, false)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const frameTex = new THREE.Texture()
  frameTex.colorSpace = THREE.SRGBColorSpace
  frameTex.minFilter = THREE.LinearFilter
  frameTex.generateMipmaps = false
  const frameTexB = new THREE.Texture()
  frameTexB.colorSpace = THREE.SRGBColorSpace
  frameTexB.minFilter = THREE.LinearFilter
  frameTexB.generateMipmaps = false

  const uniforms = {
    uFrame: { value: frameTex },
    uFrameB: { value: frameTexB },
    uMixB: { value: 0 },
    uText: { value: makeTextTexture() },
    uFrameAspect: { value: 16 / 9 },
    uPlane: { value: window.innerWidth / window.innerHeight },
    uScale: { value: 0.12 },
    uFront: { value: 0 },
    uVel: { value: 0 },
    uTime: { value: 0 },
    uDim: { value: 0 },
  }
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms })
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat))

  // fontes chegam depois do primeiro paint: redesenha o nome quando prontas
  document.fonts.ready.then(() => {
    uniforms.uText.value.dispose()
    uniforms.uText.value = makeTextTexture()
  })

  // ——— frames ———
  const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null)
  let useStills = false
  let stillA: HTMLImageElement | null = null
  let stillB: HTMLImageElement | null = null
  let currentIdx = -1

  const load = (src: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image()
      im.onload = () => res(im)
      im.onerror = rej
      im.src = src
    })

  load(framePath(1))
    .then(async (first) => {
      frames[0] = first
      // preload em ordem, em paralelo controlado
      const queue = Array.from({ length: FRAME_COUNT - 1 }, (_, i) => i + 2)
      const worker = async () => {
        while (queue.length) {
          const i = queue.shift()!
          try {
            frames[i - 1] = await load(framePath(i))
          } catch {
            /* frame ausente: o vizinho mais próximo cobre */
          }
        }
      }
      await Promise.all([worker(), worker(), worker(), worker()])
    })
    .catch(async () => {
      // sem sequência: dois stills (túnel → gramado) com crossfade e zoom
      useStills = true
      ;[stillA, stillB] = await Promise.all([load('/assets/film/tunnel.webp'), load('/assets/film/pitch-reveal.webp')])
      frameTex.image = stillA
      frameTex.needsUpdate = true
      frameTexB.image = stillB
      frameTexB.needsUpdate = true
      uniforms.uFrameAspect.value = stillA.width / stillA.height
    })

  const nearestLoaded = (i: number) => {
    for (let d = 0; d < FRAME_COUNT; d++) {
      if (frames[i - d]) return i - d
      if (frames[i + d]) return i + d
    }
    return -1
  }

  let progress = 0
  const setProgress = (p: number) => {
    progress = p
  }

  const ease = (x: number) => 1 - Math.pow(1 - x, 3)

  let raf = 0
  const clock = new THREE.Clock()
  const tick = () => {
    raf = requestAnimationFrame(tick)
    const p = progress
    // 0 → 0.62: a câmera atravessa o túnel (filme). Depois: o nome domina.
    const filmP = Math.min(p / 0.62, 1)
    if (useStills) {
      uniforms.uMixB.value = ease(filmP)
    } else {
      const idx = nearestLoaded(Math.round(filmP * (FRAME_COUNT - 1)))
      if (idx >= 0 && idx !== currentIdx) {
        currentIdx = idx
        const im = frames[idx]!
        frameTex.image = im
        frameTex.needsUpdate = true
        uniforms.uFrameAspect.value = im.width / im.height
      }
    }
    // o nome cresce do fundo do túnel até a viewport inteira
    uniforms.uScale.value = THREE.MathUtils.lerp(0.09, 1.0, ease(filmP))
    // depois de emergir, o nome vem para a frente do estádio
    uniforms.uFront.value = THREE.MathUtils.smoothstep(p, 0.58, 0.7)
    // silêncio final: a cena escurece e só o nome fica
    uniforms.uDim.value = THREE.MathUtils.smoothstep(p, 0.8, 0.97)
    uniforms.uVel.value = getVelocity()
    uniforms.uTime.value = clock.getElapsedTime()
    renderer.render(scene, camera)
  }
  tick()

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false)
    uniforms.uPlane.value = window.innerWidth / window.innerHeight
  }
  window.addEventListener('resize', onResize)

  return {
    setProgress,
    dispose: () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      frameTex.dispose()
      frameTexB.dispose()
      uniforms.uText.value.dispose()
      mat.dispose()
      renderer.dispose()
    },
  }
}
