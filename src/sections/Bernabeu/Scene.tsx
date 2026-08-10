import { useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { MutableRefObject } from 'react'

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

const CONE_SOURCES: [number, number, number][] = [
  [-7.7, 4.4, -4.5],
  [7.7, 4.4, -4.5],
  [-7.7, 4.4, 4.5],
  [7.7, 4.4, 4.5],
  [0, 4.4, -6],
  [0, 4.4, 6],
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
      <coneGeometry args={[1.5, length, 24, 1, true]} />
      <meshBasicMaterial color="#ffedc0" transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

function Stadium() {
  const pitch = useMemo(makePitchTexture, [])
  return (
    <group>
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
      {/* arquibancada inferior e superior (dois anéis) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.9, 0]} scale={[1.4, 1, 0.55]}>
        <torusGeometry args={[6.6, 1.9, 4, 64]} />
        <meshStandardMaterial color="#131826" flatShading roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.1, 0]} scale={[1.4, 1, 0.75]}>
        <torusGeometry args={[7.6, 2.0, 4, 64]} />
        <meshStandardMaterial color="#0f141f" flatShading roughness={0.95} />
      </mesh>
      {/* fachada envolvente */}
      <mesh position={[0, 2.9, 0]} scale={[1.4, 1, 1]}>
        <cylinderGeometry args={[9.5, 9.8, 3.4, 64, 1, true]} />
        <meshStandardMaterial color="#2b3140" flatShading side={THREE.DoubleSide} roughness={0.6} metalness={0.35} />
      </mesh>
      {/* bandas de LED da fachada — o brilho que o bloom pega */}
      {[1.9, 2.9, 3.9].map((y) => (
        <mesh key={y} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} scale={[1.4, 1, 1]}>
          <torusGeometry args={[9.66, 0.045, 8, 96]} />
          <meshStandardMaterial color="#f0e6d0" emissive="#f0e6d0" emissiveIntensity={2.6} toneMapped={false} />
        </mesh>
      ))}
      {/* anel de cobertura com linha de refletores */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.7, 0]} scale={[1.4, 1, 0.4]}>
        <torusGeometry args={[8.6, 1.15, 4, 64]} />
        <meshStandardMaterial color="#1a2030" flatShading roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4.45, 0]} scale={[1.4, 1, 1]}>
        <torusGeometry args={[7.5, 0.06, 8, 96]} />
        <meshStandardMaterial color="#fff7e0" emissive="#fff7e0" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>
      {/* cones volumétricos dos refletores (apex na cobertura, base no gramado) */}
      {CONE_SOURCES.map((from, i) => (
        <LightCone key={i} from={from} to={[from[0] * 0.25, 0, from[2] * 0.25]} />
      ))}
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
      <Stadium />
      <Rig progress={progress} />
      <fog attach="fog" args={['#05070f', 26, 60]} />
      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.55} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}
