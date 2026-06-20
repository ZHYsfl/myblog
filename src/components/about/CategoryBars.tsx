import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CATEGORIES } from '@/lib/constants';

interface BarProps {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
}

function Bar({ position, height, color, label }: BarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = useMemo(() => Math.max(0.2, height * 3), [height]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.1;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, targetScale / 2, 0]} scale={[1, 0.1, 1]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <Text position={[0, -0.6, 0]} fontSize={0.35} color="white" anchorX="center">
        {label}
      </Text>
    </group>
  );
}

interface CategoryBarsProps {
  counts: Record<string, number>;
}

export function CategoryBars({ counts }: CategoryBarsProps) {
  const active = CATEGORIES.filter((c) => (counts[c.id] || 0) > 0);
  const max = Math.max(...active.map((c) => counts[c.id] || 0), 1);

  return (
    <Canvas
      camera={{ position: [0, 4, 14], fov: 50 }}
      style={{ background: 'transparent' }}
      frameloop="demand"
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      {active.map((category, index) => {
        const offset = (index - active.length / 2) * 1.8;
        const height = (counts[category.id] || 0) / max;
        return (
          <Bar
            key={category.id}
            position={[offset, 0, 0]}
            height={height}
            color={category.color}
            label={category.name.zh}
          />
        );
      })}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
