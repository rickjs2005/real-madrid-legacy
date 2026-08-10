import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import type { MutableRefObject } from 'react'

// A joia da seção (princípio do site do Dembélé: UM objeto 3D impecável):
// a taça dos "big ears" modelada proceduralmente — lathe do corpo + alças —
// em cromo físico com reflexos de estúdio (RoomEnvironment: embutido no three,
// zero rede — gravação offline segura).

function StudioEnv() {
  const { gl, scene } = useThree()
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  }, [gl, scene])
  return null
}

const CHROME = new THREE.MeshPhysicalMaterial({
  color: '#e9eaee',
  metalness: 1,
  roughness: 0.14,
  clearcoat: 0.6,
  clearcoatRoughness: 0.2,
})

function BigEarsTrophy({ progress }: { progress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const profile = useMemo(
    () =>
      [
        [0.0, 0.0], [0.6, 0.0], [0.6, 0.07], [0.3, 0.11], [0.26, 0.18],
        [0.21, 0.24], [0.15, 0.32], [0.13, 0.44], [0.17, 0.54],
        [0.33, 0.64], [0.43, 0.8], [0.465, 0.97], [0.445, 1.14],
        [0.395, 1.3], [0.375, 1.4], [0.415, 1.46], [0.455, 1.5], [0.435, 1.52],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  )
  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.35
    // o scroll aproxima sutilmente a taça (respiro, não montanha-russa)
    const p = progress.current
    group.current.position.y = -0.75 + Math.sin(p * Math.PI) * 0.06
    group.current.scale.setScalar(1 + p * 0.12)
  })
  return (
    <group ref={group} position={[0, -0.75, 0]}>
      <mesh geometry={useMemo(() => new THREE.LatheGeometry(profile, 64), [profile])} material={CHROME} />
      {/* as orelhas: arcos laterais */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          material={CHROME}
          position={[side * 0.52, 1.05, 0]}
          rotation={[0, 0, side * -0.25]}
        >
          <torusGeometry args={[0.3, 0.045, 14, 40, Math.PI * 1.25]} />
        </mesh>
      ))}
      {/* plinto escuro */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.66, 0.7, 0.12, 48]} />
        <meshStandardMaterial color="#12151f" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  )
}

export default function TrophyScene({
  progress,
  frameloop,
}: {
  progress: MutableRefObject<number>
  frameloop: 'always' | 'never'
}) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 32, position: [0, 0.35, 3.2] }} frameloop={frameloop} gl={{ alpha: true }}>
      <StudioEnv />
      <ambientLight intensity={0.25} />
      {/* luz dourada lateral: a assinatura do site tocando o cromo */}
      <pointLight position={[2.2, 1.6, 1.6]} intensity={22} color="#d9b25f" />
      <pointLight position={[-2.4, 0.8, -1]} intensity={10} color="#aeb6c6" />
      <BigEarsTrophy progress={progress} />
    </Canvas>
  )
}
