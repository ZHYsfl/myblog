import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { StarField } from './StarField';
import { Planet } from './Planet';
import { CATEGORIES } from '@/lib/constants';
import { useTheme } from '@/lib/useTheme';

interface GalaxySceneProps {
  counts: Record<string, number>;
  onCategoryClick?: (categoryId: string) => void;
  theme?: 'light' | 'dark';
}

export function GalaxyScene({ counts, onCategoryClick, theme: themeProp }: GalaxySceneProps) {
  const activeTheme = useTheme();
  const theme = themeProp ?? activeTheme;
  const activeCategories = CATEGORIES.filter((c) => (counts[c.id] || 0) > 0);
  const starColor = theme === 'dark' ? '#ffffff' : '#2563eb';
  const bgColor = theme === 'dark' ? '#0a0a0f' : '#f7f7f5';

  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 60 }}
      style={{ background: bgColor }}
      frameloop="demand"
      dpr={1}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
      <StarField count={500} color={starColor} />
      {activeCategories.map((category, index) => {
        const angle = (index / activeCategories.length) * Math.PI * 2;
        const radius = 6 + Math.sin(index * 1.5) * 1.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.6;
        const z = Math.sin(index) * 2;
        return (
          <Planet
            key={category.id}
            position={[x, y, z]}
            color={category.color}
            size={0.6 + Math.min((counts[category.id] || 0) * 0.08, 1.2)}
            name={category.name.en}
            count={counts[category.id] || 0}
            onClick={() => onCategoryClick?.(category.id)}
          />
        );
      })}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </Canvas>
  );
}
