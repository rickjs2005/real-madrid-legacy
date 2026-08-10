import { Canvas, useFrame } from '@react-three/fiber'
import type { MutableRefObject } from 'react'

// Estádio próprio em geometria low-poly. Se um dia surgir um stadium.glb decente
// (Sketchfab, licença CC — ver public/assets/ASSETS.md), trocar este grupo por
// useGLTF('/assets/bernabeu/stadium.glb') mantendo a mesma coreografia de câmera
// em <Rig>. Isso exige reinstalar @react-three/drei (removido daqui por estar
// sem uso — nenhum helper dele é importado neste arquivo).
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
