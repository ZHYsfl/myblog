import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  color: string;
  size: number;
  name: string;
  count: number;
  onClick?: () => void;
}

export function Planet({ position, color, size, name, count, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={hovered ? size * 1.2 : size}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <icosahedronGeometry args={[1, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.15}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      {hovered && (
        <Text
          position={[0, size + 0.8, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="bottom"
        >
          {`${name} (${count})`}
        </Text>
      )}
    </group>
  );
}
