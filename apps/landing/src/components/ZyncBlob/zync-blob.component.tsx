import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Color, Depth, Fresnel, LayerMaterial, Noise } from 'lamina/vanilla';
import { useMemo, useState } from 'react';
import * as THREE from 'three';

const colorA = new THREE.Color('#2032A5').convertSRGBToLinear();
const colorB = new THREE.Color('#0F1C4D').convertSRGBToLinear();
const fresnel = new THREE.Color('#E7B473').convertSRGBToLinear();
const material = new LayerMaterial({
  layers: [
    new Color({ color: colorA }),
    new Depth({
      colorA: colorA,
      colorB: colorB,
      alpha: 0.5,
      mode: 'normal',
      near: 0,
      far: 2,
      origin: [1, 1, 1],
    }),
    new Depth({
      colorA: 'purple',
      colorB: colorB,
      alpha: 0.5,
      mode: 'add',
      near: 3,
      far: 2,
      origin: [1, 1, 1],
    }),
    new Fresnel({
      mode: 'add',
      color: fresnel,
      intensity: 0.3,
      power: 2.5,
      bias: 0.0,
    }),
    new Noise({
      mapping: 'local',
      type: 'simplex',
      scale: 1000,
      colorA: '#ffaf40',
      colorB: 'black',
      mode: 'overlay',
    }),
  ],
});

export function ZyncBlob() {
  const { viewport, camera } = useThree();
  const { nodes } = useGLTF('/models/zync-blob.glb');
  console.log(nodes, 'NODES');
  const [speed] = useState(() => 0.1 + Math.random() / 10);
  const position = useMemo(() => {
    const z = Math.random() * -30;
    const bounds = viewport.getCurrentViewport(camera, [0, 0, z]);
    return [
      THREE.MathUtils.randFloatSpread(bounds.width),
      THREE.MathUtils.randFloatSpread(bounds.height * 0.75),
      z,
    ];
  }, [camera, viewport]);
  return <mesh />;
}

useGLTF.preload('/models/zync-blob.glb');
