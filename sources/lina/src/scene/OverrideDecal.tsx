import { useTexture } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { SRGBColorSpace } from 'three'
import { assetUrl } from '../assetUrl'
import type { DecalSpec } from './decalSpecs'

const ALPHA_TEST = 0.5

/**
 * 单张门贴花覆盖层：当 editStore 为该人物贴纸提供了新图时，
 * 从图集 InstancedMesh 里摘掉原实例，改用这张独立平面。
 */
export default function OverrideDecal({
  spec,
  src,
  width,
  height,
  layer = 0,
}: {
  spec: DecalSpec
  src: string
  width: number
  height: number
  layer?: number
}) {
  const texture = useTexture(assetUrl(src))
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace
    texture.needsUpdate = true
  }, [texture])

  const { w, h, x, y, rot } = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined
    const aspect = img?.width && img?.height ? img.width / img.height : 1
    const w = spec.width * width
    const h = w / aspect
    return {
      w,
      h,
      x: (spec.left + spec.width / 2) * width - width / 2,
      y: height / 2 - (spec.top * height + h / 2),
      rot: ((spec.rot ?? 0) * Math.PI) / 180,
    }
  }, [texture, spec, width, height])

  return (
    <mesh
      name={`OverrideDecal_${spec.id}`}
      position={[x, y, 0.0012 + layer * 0.0008]}
      rotation={[0, 0, rot]}
    >
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        map={texture}
        transparent={false}
        alphaTest={ALPHA_TEST}
        alphaToCoverage
        depthWrite
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  )
}
