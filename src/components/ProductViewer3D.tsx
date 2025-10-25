import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

interface ProductViewer3DProps {
  productId: number;
}

// Simple 3D Box placeholder (in production, load actual GLB/GLTF models)
function ProductModel() {
  return (
    <mesh castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#8B4513" 
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

export function ProductViewer3D({ productId }: ProductViewer3DProps) {
  return (
    <div className="relative w-full aspect-square bg-gradient-craft rounded-lg overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1}
          castShadow
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.5}
        />
        <Suspense fallback={null}>
          <ProductModel />
          <ContactShadows 
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={1}
            far={4}
          />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
        <p className="text-xs text-muted-foreground">Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
}
