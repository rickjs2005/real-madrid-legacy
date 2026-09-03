import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { MutableRefObject } from 'react'

// A moldura do Legacy como quad WebGL: a transição entre eras é um shader de
// displacement — a luminância de cada fotografia distorce a outra enquanto o
// mix acontece (a assinatura visual dos sites premiados). O tratamento P&B
// quente é aplicado NO shader, então as texturas carregam cruas.

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
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform float uP;        // 0..1 progresso da transição
uniform float uA1;       // aspecto da foto 1
uniform float uA2;       // aspecto da foto 2
uniform float uPlane;    // aspecto da moldura

vec2 coverUv(vec2 uv, float imgAspect, float planeAspect) {
  vec2 s = vec2(1.0);
  if (imgAspect > planeAspect) s.x = planeAspect / imgAspect;
  else s.y = imgAspect / planeAspect;
  return (uv - 0.5) * s + 0.5;
}

// P&B quente do projeto: grayscale + contraste + sépia leve
vec3 treat(vec3 c) {
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  l = clamp((l - 0.5) * 1.12 + 0.52, 0.0, 1.0);
  return vec3(l) * vec3(1.05, 1.0, 0.88);
}

void main() {
  vec2 uv1 = coverUv(vUv, uA1, uPlane);
  vec2 uv2 = coverUv(vUv, uA2, uPlane);
  float p = smoothstep(0.0, 1.0, uP);
  // a luminância de cada foto desloca a OUTRA durante a troca
  float d1 = dot(texture2D(uTex1, uv1).rgb, vec3(0.333));
  float d2 = dot(texture2D(uTex2, uv2).rgb, vec3(0.333));
  vec2 off1 = vec2((d2 - 0.5) * 0.4 * p, (d2 - 0.5) * 0.15 * p);
  vec2 off2 = vec2(-(d1 - 0.5) * 0.4 * (1.0 - p), -(d1 - 0.5) * 0.15 * (1.0 - p));
  vec3 a = treat(texture2D(uTex1, uv1 + off1).rgb);
  vec3 b = treat(texture2D(uTex2, uv2 + off2).rgb);
  vec3 c = mix(a, b, smoothstep(0.25, 0.75, p));
  gl_FragColor = vec4(c, 1.0);
}
`

function Panel({ eraPos, urls }: { eraPos: MutableRefObject<number>; urls: string[] }) {
  const { size } = useThree()
  const textures = useRef<(THREE.Texture | null)[]>([])
  const mat = useRef<THREE.ShaderMaterial>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    urls.forEach((url, i) => {
      loader.load(url, (t) => {
        t.colorSpace = THREE.SRGBColorSpace
        textures.current[i] = t
      })
    })
    const snapshot = textures.current
    return () => snapshot.forEach((t) => t?.dispose())
  }, [urls])

  const uniforms = useMemo(
    () => ({
      uTex1: { value: null as THREE.Texture | null },
      uTex2: { value: null as THREE.Texture | null },
      uP: { value: 0 },
      uA1: { value: 1 },
      uA2: { value: 1 },
      uPlane: { value: 1 },
    }),
    [],
  )

  useFrame(() => {
    if (!mat.current) return
    const n = urls.length
    const pos = Math.min(Math.max(eraPos.current, 0), n - 1)
    const i0 = Math.min(Math.floor(pos), n - 1)
    const i1 = Math.min(i0 + 1, n - 1)
    const t1 = textures.current[i0]
    const t2 = textures.current[i1] ?? t1
    if (!t1 || !t2) return
    const aspectOf = (t: THREE.Texture) => {
      const img = t.image as { width?: number; height?: number } | undefined
      return img?.width && img?.height ? img.width / img.height : 1
    }
    const u = mat.current.uniforms
    u.uTex1.value = t1
    u.uTex2.value = t2
    u.uA1.value = aspectOf(t1)
    u.uA2.value = aspectOf(t2)
    u.uP.value = pos - i0
    u.uPlane.value = size.width / size.height
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  )
}

export default function LegacyShaderFrame({
  eraPos,
  urls,
  frameloop,
}: {
  eraPos: MutableRefObject<number>
  urls: string[]
  frameloop: 'always' | 'never'
}) {
  return (
    <Canvas dpr={[1, 1.5]} frameloop={frameloop} gl={{ antialias: false }}>
      <Panel eraPos={eraPos} urls={urls} />
    </Canvas>
  )
}
