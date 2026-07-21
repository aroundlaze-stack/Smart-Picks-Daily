import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text, ContactShadows, PresentationControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { Suspense, useRef, useState, useMemo } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';

// A single holographic product card in 3D
function HolographicCard({ 
  position, 
  rotation, 
  product, 
  onClick,
  active
}: { 
  position: [number, number, number];
  rotation: [number, number, number];
  product: any;
  onClick: () => void;
  active: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animate scale on hover
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered || active ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // If active, rotate slowly to face camera
      if (active) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.05);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 2, 0.05);
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation[1], 0.1);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, position[2], 0.1);
      }
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={position} 
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Glass Card */}
        <mesh>
          <boxGeometry args={[2.5, 3.5, 0.1]} />
          <meshPhysicalMaterial 
            color={hovered || active ? "#4f8cff" : "#111"}
            metalness={0.9}
            roughness={0.1}
            transmission={0.8}
            thickness={0.5}
            emissive={hovered || active ? "#4f8cff" : "#000"}
            emissiveIntensity={hovered || active ? 0.2 : 0}
          />
        </mesh>
        
        {/* Holographic glowing edges */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[2.4, 3.4, 0.01]} />
          <meshBasicMaterial 
            color={hovered || active ? "#06b6d4" : "#333"} 
            wireframe 
            transparent 
            opacity={0.5} 
          />
        </mesh>

        {/* Content */}
        <Text 
          position={[0, 1.2, 0.1]} 
          fontSize={0.2} 
          color="#fff" 
          anchorX="center" 
          maxWidth={2}
          font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8PNMs46E64x2vM.woff"
        >
          {product.name}
        </Text>
        <Text position={[0, 0.8, 0.1]} fontSize={0.12} color="#06b6d4" anchorX="center">
          {product.category}
        </Text>
        
        {/* Mock Product Image representation */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[1.5, 1, 0.05]} />
          <meshStandardMaterial color="#000" emissive={hovered ? "#4f8cff" : "#222"} emissiveIntensity={0.5} />
        </mesh>
        
        <Text position={[0, -0.8, 0.1]} fontSize={0.25} color="#4f8cff" anchorX="center" font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8PNMs46E64x2vM.woff">
          {product.price}
        </Text>
        
        {active && (
          <group position={[0, -1.3, 0.1]}>
            <mesh>
              <planeGeometry args={[1.5, 0.4]} />
              <meshBasicMaterial color="#4f8cff" />
            </mesh>
            <Text position={[0, 0, 0.01]} fontSize={0.15} color="#000" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8PNMs46E64x2vM.woff">
              VIEW DEAL
            </Text>
          </group>
        )}
      </Float>
    </group>
  );
}

// Arrange items in a curved shelf
function ShelfGroup({ products, activeIndex, setActiveIndex }: any) {
  const count = products.length;
  const radius = 6;
  
  return (
    <group position={[0, 0, -2]}>
      {products.map((prod: any, i: number) => {
        // Distribute along a curve
        const angle = (i - (count - 1) / 2) * 0.4;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius;
        
        return (
          <HolographicCard 
            key={prod.name}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
            product={prod}
            active={activeIndex === i}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
          />
        );
      })}
    </group>
  );
}

function ShelfFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{background:'linear-gradient(135deg, #050816 0%, #0d0d2b 100%)'}}>
      <div className="text-center text-white/40 text-sm">3D showcase loads in your browser</div>
    </div>
  );
}

export function HolographicShelf({ isMobile, products, activeIndex, setActiveIndex }: any) {
  return (
    <WebGLErrorBoundary fallback={<ShelfFallback />}>
    <Canvas
      camera={{ position: [0, 1, 8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0);
        scene.background = null;
      }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[0, 10, 0]} intensity={1} color="#4f8cff" penumbra={1} angle={0.5} />
      <spotLight position={[0, -10, 0]} intensity={1} color="#7c3aed" penumbra={1} angle={0.5} />

      <Suspense fallback={null}>
        <PresentationControls 
          global 
          rotation={[0, 0, 0]} 
          polar={[-Math.PI / 6, Math.PI / 6]} 
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <ShelfGroup products={products} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </PresentationControls>
        
        <ContactShadows position={[0, -3.5, 0]} opacity={0.5} scale={20} blur={2} far={5} color="#06b6d4" />
        
        {/* Minimal environment reflections */}
        <Environment preset="city" environmentIntensity={0.1} />

        {!isMobile && (
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.2} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
    </WebGLErrorBoundary>
  );
}
