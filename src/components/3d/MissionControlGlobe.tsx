import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Float, Stars, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useMemo, useRef } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create abstract dots on the sphere
  const dots = useMemo(() => {
    const d = [];
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(-1 + (2 * i) / 200);
      const theta = Math.sqrt(200 * Math.PI) * phi;
      const x = 3 * Math.cos(theta) * Math.sin(phi);
      const y = 3 * Math.sin(theta) * Math.sin(phi);
      const z = 3 * Math.cos(phi);
      d.push(new THREE.Vector3(x, y, z));
    }
    return d;
  }, []);

  // Create connecting arcs
  const arcs = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 15; i++) {
      const start = dots[Math.floor(Math.random() * dots.length)];
      const end = dots[Math.floor(Math.random() * dots.length)];
      
      // Quadratic bezier curve points
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(4.5);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      lines.push(curve.getPoints(20));
    }
    return lines;
  }, [dots]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base dark sphere */}
      <Sphere args={[2.9, 32, 32]}>
        <meshBasicMaterial color="#000" transparent opacity={0.8} />
      </Sphere>
      
      {/* Dots on surface */}
      {dots.map((pos, i) => (
        <mesh key={`dot-${i}`} position={pos}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color="#4f8cff" />
        </mesh>
      ))}

      {/* Arcs */}
      {arcs.map((points, i) => (
        <Line key={`arc-${i}`} points={points} color="#06b6d4" opacity={0.3} transparent lineWidth={1} />
      ))}
      
      {/* Glow */}
      <Sphere args={[3.2, 32, 32]}>
        <meshBasicMaterial color="#4f8cff" transparent opacity={0.05} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </Sphere>
    </group>
  );
}

export function MissionControlGlobe({ isMobile }: { isMobile: boolean }) {
  return (
    <WebGLErrorBoundary fallback={<div className="w-full h-full" style={{background:'radial-gradient(ellipse at center, rgba(79,140,255,0.15) 0%, #050816 70%)'}} />}>
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050816']} />
      
      <Suspense fallback={null}>
        <Stars radius={50} depth={50} count={isMobile ? 1000 : 2000} factor={4} fade speed={1} />
        
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
          <Globe />
        </Float>

        {!isMobile && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
    </WebGLErrorBoundary>
  );
}
