import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useMemo, useRef } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function NebulaParticle({ position, color, size, speed, offset }: any) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + offset;
      ref.current.position.y += Math.sin(t) * 0.005;
      ref.current.position.x += Math.cos(t * 0.5) * 0.005;
      ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// Glowing orb representing a resource
function ResourceOrb({ position, color }: any) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <Sphere args={[0.5, 32, 32]}>
          <meshBasicMaterial color={color} />
        </Sphere>
        <Sphere args={[0.7, 32, 32]}>
          <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
    </Float>
  );
}

export function NebulaCloud({ isMobile }: { isMobile: boolean }) {
  const particles = useMemo(() => {
    const items = [];
    const colors = ["#4f8cff", "#7c3aed", "#06b6d4", "#050816"];
    const count = isMobile ? 30 : 80;
    
    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 10
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        offset: Math.random() * Math.PI * 2
      });
    }
    return items;
  }, [isMobile]);

  const orbs = [
    { position: [-3, 1, 2], color: "#4f8cff" },
    { position: [2, -1, 1], color: "#7c3aed" },
    { position: [0, 2, -2], color: "#06b6d4" },
    { position: [-2, -2, -1], color: "#f0f4ff" }
  ];

  return (
    <WebGLErrorBoundary fallback={<div className="w-full h-full" style={{background:'radial-gradient(ellipse at 30% 60%, rgba(124,58,237,0.2) 0%, #050816 60%)'}} />}>
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
      <color attach="background" args={['#050816']} />
      
      <Suspense fallback={null}>
        <Stars radius={50} depth={50} count={isMobile ? 500 : 1500} factor={4} saturation={0} fade speed={1} />
        
        <group>
          {particles.map((p, i) => (
            <NebulaParticle key={`p-${i}`} {...p} />
          ))}
          
          {orbs.map((o, i) => (
            <ResourceOrb key={`o-${i}`} {...o} />
          ))}
        </group>

        {!isMobile && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
    </WebGLErrorBoundary>
  );
}
