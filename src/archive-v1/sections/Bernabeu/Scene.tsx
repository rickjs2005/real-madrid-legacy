import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import type { MutableRefObject } from 'react'

// Reflexos de ambiente (estúdio) para os materiais metálicos da fachada e da
// cobertura — embutido no three, sem rede (gravação offline segura).
function StudioEnv() {
  const { gl, scene } = useThree()
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.25
  }, [gl, scene])
  return null
}

// Estádio próprio estilizado, direção "noite de jogo": gramado com marcações
// reais (textura procedural em canvas — zero assets), arquibancada em dois
// anéis, fachada com bandas de LED emissivas (assinatura do Bernabéu renovado)
// e refletores com cones volumétricos + bloom. Upgrade consciente da opção
// "low-poly cinematográfico" — não tenta ser fotorreal (isso seria Google 3D
// Tiles, decisão registrada em docs/superpowers/specs).

function makePitchTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 664
  const g = c.getContext('2d')!
  // listras de corte do gramado
  const stripes = 12
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 ? '#0b3a20' : '#0e4527'
    g.fillRect((i * c.width) / stripes, 0, c.width / stripes, c.height)
  }
  // marcações (proporções aproximadas de um campo 105x68)
  g.strokeStyle = 'rgba(245,244,240,0.8)'
  g.lineWidth = 4
  const cx = c.width / 2
  const cy = c.height / 2
  g.strokeRect(22, 22, c.width - 44, c.height - 44)
  g.beginPath()
  g.moveTo(cx, 22)
  g.lineTo(cx, c.height - 22)
  g.stroke()
  g.beginPath()
  g.arc(cx, cy, 88, 0, Math.PI * 2)
  g.stroke()
  // grandes áreas e pequenas áreas
  g.strokeRect(22, cy - 195, 158, 390)
  g.strokeRect(c.width - 180, cy - 195, 158, 390)
  g.strokeRect(22, cy - 88, 53, 176)
  g.strokeRect(c.width - 75, cy - 88, 53, 176)
  const t = new THREE.CanvasTexture(c)
  t.anisotropy = 4
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// ——— Geometria do Bernabéu renovado ———
// O estádio real é um retângulo arredondado envelopado em lâminas metálicas
// horizontais, com telão 360° interno e cobertura plana — tudo construível
// por extrusão de anéis de retângulo arredondado.

function roundedRectContour<T extends THREE.Shape | THREE.Path>(hw: number, hd: number, r: number, target: T): T {
  target.moveTo(-hw + r, -hd)
  target.lineTo(hw - r, -hd)
  target.absarc(hw - r, -hd + r, r, -Math.PI / 2, 0, false)
  target.lineTo(hw, hd - r)
  target.absarc(hw - r, hd - r, r, 0, Math.PI / 2, false)
  target.lineTo(-hw + r, hd)
  target.absarc(-hw + r, hd - r, r, Math.PI / 2, Math.PI, false)
  target.lineTo(-hw, -hd + r)
  target.absarc(-hw + r, -hd + r, r, Math.PI, Math.PI * 1.5, false)
  return target
}

type RectSpec = [hw: number, hd: number, r: number]

function makeRing(outer: RectSpec, inner: RectSpec, depth: number): THREE.ExtrudeGeometry {
  const shape = roundedRectContour(outer[0], outer[1], outer[2], new THREE.Shape())
  shape.holes.push(roundedRectContour(inner[0], inner[1], inner[2], new THREE.Path()))
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 20 })
  g.rotateX(-Math.PI / 2) // extrusão vira altura (Y)
  return g
}

// SDF de retângulo arredondado (negativo = dentro) — distribui torcida/cidade
function sdRoundRect(x: number, z: number, hw: number, hd: number, r: number) {
  const qx = Math.abs(x) - (hw - r)
  const qz = Math.abs(z) - (hd - r)
  const ax = Math.max(qx, 0)
  const az = Math.max(qz, 0)
  return Math.hypot(ax, az) + Math.min(Math.max(qx, qz), 0) - r
}

const CONE_SOURCES: [number, number, number][] = [
  [-6.2, 4.6, -4.2],
  [6.2, 4.6, -4.2],
  [-6.2, 4.6, 4.2],
  [6.2, 4.6, 4.2],
]

// Cone alinhado do refletor (apex) ao ponto do gramado (base): a geometria do
// cone tem o apex em +Y/2, então rotacionamos (0,-1,0) para a direção from→to.
function LightCone({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const { position, quaternion, length } = useMemo(() => {
    const f = new THREE.Vector3(...from)
    const t = new THREE.Vector3(...to)
    const dir = t.clone().sub(f)
    const length = dir.length()
    return {
      position: f.clone().add(dir.clone().multiplyScalar(0.5)),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.clone().normalize()),
      length,
    }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion}>
      <coneGeometry args={[0.55, length, 20, 1, true]} />
      <meshBasicMaterial color="#d9b25f" transparent opacity={0.03} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

// Torcida como pontos de luz nas arquibancadas: escala humana no estádio.
// ~4200 pontos estáticos (sem update por frame) — custo de GPU desprezível.
function Crowd({ progress }: { progress: MutableRefObject<number> }) {
  const mat = useRef<THREE.PointsMaterial>(null)
  useFrame(() => {
    // de perto os pontos virariam quadrados sobre o gramado — a torcida
    // desvanece quando a câmera desce ao nível do campo
    if (mat.current) {
      const p = progress.current
      const fade = p < 0.72 ? 1 : Math.max(0, 1 - (p - 0.72) / 0.2)
      mat.current.opacity = 0.95 * fade
    }
  })
  const { positions, colors } = useMemo(() => {
    const N = 4200
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const gold = new THREE.Color('#c9a24b')
    const dim = new THREE.Color('#39415a')
    const bright = new THREE.Color('#cdd5e8')
    let i = 0
    while (i < N) {
      // amostra na banda das arquibancadas do retângulo arredondado; a altura
      // acompanha a profundidade na banda (quanto mais fundo, mais alto o anel)
      const x = (Math.random() * 2 - 1) * 9.6
      const z = (Math.random() * 2 - 1) * 7.0
      const d = sdRoundRect(x, z, 9.4, 6.8, 2.5)
      if (d > -0.3 || d < -3.4) continue
      const t = (-d - 0.3) / 3.1
      pos[i * 3] = x
      pos[i * 3 + 1] = 0.35 + t * 2.6 + Math.random() * 0.15
      pos[i * 3 + 2] = z
      const roll = Math.random()
      // raros flashes dourados/claros no meio da massa escura (celulares na arquibancada)
      const c = roll < 0.02 ? gold : roll < 0.06 ? bright : dim
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      i++
    }
    return { positions: pos, colors: col }
  }, [])
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={mat} size={0.05} vertexColors sizeAttenuation depthWrite={false} transparent />
    </points>
  )
}

// A cidade ao redor: grade esparsa de luzes no plano do chão, fora do bowl —
// referência das fotos noturnas do Bernabéu (o estádio nunca aparece sozinho).
function CityLights() {
  const { positions, colors } = useMemo(() => {
    const N = 1600
    const pos: number[] = []
    const col: number[] = []
    const warm = new THREE.Color('#8a7a55')
    const cool = new THREE.Color('#5a6478')
    while (pos.length / 3 < N) {
      // snap em grade + jitter = quarteirões
      const x = (Math.floor(Math.random() * 44) - 22) * 1.5 + (Math.random() - 0.5) * 0.6
      const z = (Math.floor(Math.random() * 44) - 22) * 1.5 + (Math.random() - 0.5) * 0.6
      if (sdRoundRect(x, z, 11.5, 8.5, 3) < 1.2) continue // fora do estádio
      pos.push(x, 0.05, z)
      const c = Math.random() < 0.75 ? warm : cool
      col.push(c.r, c.g, c.b)
    }
    return { positions: new Float32Array(pos), colors: new Float32Array(col) }
  }, [])
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors sizeAttenuation depthWrite={false} fog={false} />
    </points>
  )
}

// Céu estrelado sutil sobre a cena
function Stars() {
  const positions = useMemo(() => {
    const N = 900
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2
      const elev = 0.15 + Math.random() * 1.35 // só hemisfério superior
      const r = 34 + Math.random() * 10
      pos[i * 3] = Math.cos(a) * Math.cos(elev) * r
      pos[i * 3 + 1] = Math.sin(elev) * r
      pos[i * 3 + 2] = Math.sin(a) * Math.cos(elev) * r
    }
    return pos
  }, [])
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#aeb6c6" sizeAttenuation depthWrite={false} fog={false} transparent opacity={0.7} />
    </points>
  )
}

// Feixe de première varrendo o céu do estádio, bem lento
function LightSweep() {
  const g = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (g.current) g.current.rotation.y += delta * 0.12
  })
  return (
    <group ref={g}>
      <mesh position={[3, 4.2, 0]} rotation={[0, 0, Math.PI / 4.5]}>
        <coneGeometry args={[0.7, 8, 20, 1, true]} />
        <meshBasicMaterial color="#d9b25f" transparent opacity={0.035} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  )
}

function Stadium({ progress }: { progress: MutableRefObject<number> }) {
  const pitch = useMemo(makePitchTexture, [])
  // escala global: o bowl inteiro precisa caber no enquadramento aéreo
  // (fov 40 a ~30 de distância enxerga ~22 de altura; diâmetro bruto era 27)
  return (
    <group scale={0.55}>
      {/* gramado com marcações */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.5, 6.8]} />
        <meshStandardMaterial map={pitch} roughness={0.9} />
      </mesh>
      {/* entorno do campo (piso técnico) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[26, 20]} />
        <meshStandardMaterial color="#0a0d16" roughness={1} />
      </mesh>
      {/* arquibancadas: três anéis retangulares-arredondados em degrau */}
      {(
        [
          [[7.6, 5.4, 1.8], [5.6, 3.7, 1.2], 1.1, 0],
          [[8.6, 6.2, 2.2], [6.6, 4.6, 1.5], 1.2, 1.0],
          [[9.6, 7.0, 2.6], [7.4, 5.2, 1.8], 1.3, 2.1],
        ] as [RectSpec, RectSpec, number, number][]
      ).map(([outer, inner, depth, y], k) => (
        <mesh key={k} position={[0, y, 0]} geometry={makeRing(outer, inner, depth)}>
          <meshStandardMaterial color="#161b29" roughness={0.95} />
        </mesh>
      ))}
      {/* telão 360° — o anel de luz interno do Bernabéu renovado */}
      <mesh position={[0, 3.35, 0]} geometry={makeRing([7.5, 5.3, 1.8], [7.3, 5.1, 1.7], 0.5)}>
        <meshStandardMaterial color="#8fa8ff" emissive="#8fa8ff" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      {/* fachada: seis lâminas metálicas horizontais (a pele do estádio) */}
      {Array.from({ length: 6 }).map((_, k) => (
        <mesh
          key={k}
          position={[0, 0.35 + k * 0.72, 0]}
          scale={1 + k * 0.008}
          geometry={makeRing([10.4, 7.6, 2.9], [10.05, 7.25, 2.8], 0.55)}
        >
          <meshStandardMaterial color="#454c5e" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* bandas de LED douradas entre as lâminas */}
      {[1.78, 3.94].map((y) => (
        <mesh key={y} position={[0, y, 0]} geometry={makeRing([10.46, 7.66, 2.9], [10.33, 7.53, 2.85], 0.07)}>
          <meshStandardMaterial color="#d9b25f" emissive="#d9b25f" emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      ))}
      {/* cobertura plana com abertura sobre o gramado */}
      <mesh position={[0, 4.75, 0]} geometry={makeRing([11.0, 8.1, 3.1], [6.8, 4.7, 1.6], 0.28)}>
        <meshStandardMaterial color="#3d4557" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* linha de refletores na borda interna da cobertura */}
      <mesh position={[0, 4.6, 0]} geometry={makeRing([6.9, 4.8, 1.62], [6.75, 4.66, 1.58], 0.07)}>
        <meshStandardMaterial color="#e6c477" emissive="#e6c477" emissiveIntensity={2.8} toneMapped={false} />
      </mesh>
      {/* cones volumétricos dos refletores (apex na cobertura, base no gramado) */}
      {CONE_SOURCES.map((from, i) => (
        <LightCone key={i} from={from} to={[from[0] * 0.25, 0, from[2] * 0.25]} />
      ))}
      <Crowd progress={progress} />
      <CityLights />
      <Stars />
      <LightSweep />
      {/* iluminação real do campo — spotlights miram a origem por padrão */}
      <ambientLight intensity={0.12} />
      {[[-6, 6, -4], [6, 6, -4], [-6, 6, 4], [6, 6, 4]].map((p, i) => (
        <spotLight key={i} position={p as [number, number, number]} angle={0.65} penumbra={0.6} intensity={140} color="#ffeecf" />
      ))}
    </group>
  )
}

function Rig({ progress }: { progress: MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progress.current
    // aérea (alto/longe) → aproximação → dentro da abertura da cobertura
    camera.position.set(
      Math.sin(p * Math.PI * 0.5) * 14 * (1 - p * 0.85),
      22 - p * 20.3, // termina em y=1.7
      22 - p * 19.6, // termina em z=2.4: dentro da abertura (meia-profundidade ~2.6)
    )
    camera.lookAt(0, 0.8 - p * 0.5, 0)
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
      <StudioEnv />
      <Stadium progress={progress} />
      <Rig progress={progress} />
      <fog attach="fog" args={['#05070f', 20, 48]} />
      <EffectComposer>
        {/* threshold mais baixo para o dourado (menos luminante que branco) florescer */}
        <Bloom intensity={0.75} luminanceThreshold={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}
