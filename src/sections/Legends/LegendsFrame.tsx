import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { MutableRefObject } from 'react'
import { getVelocity } from '../../lib/velocity'

// A moldura das lendas como quad WebGL: a transição entre fotografias é um
// displacement — a luminância de cada foto distorce a outra durante a troca.
// O tratamento por era (arquivo / flash) é aplicado no shader por `uEra`.

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
uniform float uP;
uniform float uA1;
uniform float uA2;
uniform float uPlane;
uniform float uEra;   // 0 = arquivo (50s/60s) · 1 = flash (90s/2000s)
uniform float uVel;
uniform float uTime;

vec2 coverUv(vec2 uv, float imgAspect, float planeAspect) {
  vec2 s = vec2(1.0);
  if (imgAspect > planeAspect) s.x = planeAspect / imgAspect;
  else s.y = imgAspect / planeAspect;
  return (uv - 0.5) * s + 0.5;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

vec3 archive(vec3 c) {
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  l = clamp((l - 0.5) * 0.92 + 0.5, 0.0, 1.0);
  l = pow(l, 1.08);
  return vec3(l) * vec3(1.04, 1.0, 0.9);
}
// era II: flash frontal, filme, contraste alto — P&B com brancos estourados
vec3 flash(vec3 c) {
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  l = pow(l, 0.62);
  l = (l - 0.5) * 1.35 + 0.56;
  l = clamp(l, 0.0, 1.0);
  l = smoothstep(0.0, 0.94, l);
  return vec3(l) * vec3(1.0, 0.99, 0.97);
}

void main() {
  vec2 uv = vUv;
  uv.y += uVel * 0.02 * sin(uv.x * 3.14);
  vec2 uv1 = coverUv(uv, uA1, uPlane);
  vec2 uv2 = coverUv(uv, uA2, uPlane);
  float p = smoothstep(0.0, 1.0, uP);
  float d1 = dot(texture2D(uTex1, uv1).rgb, vec3(0.333));
  float d2 = dot(texture2D(uTex2, uv2).rgb, vec3(0.333));
  vec2 off1 = vec2((d2 - 0.5) * 0.45 * p, (d2 - 0.5) * 0.18 * p);
  vec2 off2 = vec2(-(d1 - 0.5) * 0.45 * (1.0 - p), -(d1 - 0.5) * 0.18 * (1.0 - p));
  vec3 a = texture2D(uTex1, uv1 + off1).rgb;
  vec3 b = texture2D(uTex2, uv2 + off2).rgb;
  vec3 c = mix(a, b, smoothstep(0.25, 0.75, p));
  c = mix(archive(c), flash(c), uEra);
  // grain de arquivo mais forte na era I
  c += (hash(vUv * 1200.0 + fract(uTime)) - 0.5) * mix(0.09, 0.035, uEra);
  float vig = smoothstep(1.2, 0.3, length((vUv - 0.5) * vec2(1.1, 1.0)));
  c *= mix(0.6, 1.0, vig);
  gl_FragColor = vec4(c, 1.0);
}
`

function Panel({ pos, era, urls }: { pos: MutableRefObject<number>; era: MutableRefObject<number>; urls: string[] }) {
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
      uEra: { value: 0 },
      uVel: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (!mat.current) return
    const n = urls.length
    const p = Math.min(Math.max(pos.current, 0), n - 1)
    const i0 = Math.min(Math.floor(p), n - 1)
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
    u.uP.value = p - i0
    u.uPlane.value = size.width / size.height
    u.uEra.value = era.current
    u.uVel.value = getVelocity()
    u.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  )
}

export default function LegendsFrame({
  pos,
  era,
  urls,
}: {
  pos: MutableRefObject<number>
  era: MutableRefObject<number>
  urls: string[]
}) {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: false }}>
      <Panel pos={pos} era={era} urls={urls} />
    </Canvas>
  )
}
