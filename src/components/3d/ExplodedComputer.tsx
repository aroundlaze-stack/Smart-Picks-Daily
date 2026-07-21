import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useRef, useState } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Abstract representation of PC components
function ExplodedPC() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Refs for individual components to animate
  const caseRef = useRef<THREE.Group>(null);
  const moboRef = useRef<THREE.Group>(null);
  const cpuRef = useRef<THREE.Group>(null);
  const gpuRef = useRef<THREE.Group>(null);
  const ramRef = useRef<THREE.Group>(null);
  const psuRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    // Gentle hovering
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Case (Wireframe outline) */}
      <group ref={caseRef} position={[0, 0, 0]}>
        <Box args={[3, 5, 5]} position={[0, 2.5, 0]}>
          <meshBasicMaterial color="#333" wireframe transparent opacity={0.3} />
        </Box>
      </group>

      {/* Motherboard */}
      <group ref={moboRef} position={[-1.2, 2.5, 0]}>
        <Box args={[0.1, 4, 4]}>
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </Box>
        {/* Glow behind mobo */}
        <mesh position={[0.1, 0, 0]}>
          <planeGeometry args={[3.8, 3.8]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* CPU + Cooler */}
      <group ref={cpuRef} position={[-0.8, 3.5, 0]}>
        <Box args={[0.2, 0.8, 0.8]}>
          <meshStandardMaterial color="#333" metalness={1} roughness={0} />
        </Box>
        <Cylinder args={[0.6, 0.6, 0.4, 32]} position={[0.3, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#222" metalness={0.8} />
        </Cylinder>
        {/* RGB Fan Ring */}
        <Cylinder args={[0.62, 0.62, 0.1, 32]} position={[0.5, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <meshBasicMaterial color="#06b6d4" />
        </Cylinder>
      </group>

      {/* RAM Sticks */}
      <group ref={ramRef} position={[-0.8, 3.5, -1]}>
        <Box args={[0.1, 1.2, 0.3]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#222" />
        </Box>
        <Box args={[0.1, 1.2, 0.3]} position={[0, 0, 0.4]}>
          <meshStandardMaterial color="#222" />
        </Box>
        {/* RAM RGB */}
        <Box args={[0.12, 1.2, 0.05]} position={[0.05, 0, 0]}>
          <meshBasicMaterial color="#7c3aed" />
        </Box>
        <Box args={[0.12, 1.2, 0.05]} position={[0.05, 0, 0.4]}>
          <meshBasicMaterial color="#7c3aed" />
        </Box>
      </group>

      {/* GPU */}
      <group ref={gpuRef} position={[-0.5, 1.5, 0]}>
        <Box args={[0.6, 1, 3]}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </Box>
        {/* GPU accents */}
        <Box args={[0.65, 0.1, 2.8]} position={[0, -0.2, 0]}>
          <meshBasicMaterial color="#4f8cff" />
        </Box>
        {/* Fans */}
        <Cylinder args={[0.4, 0.4, 0.1, 16]} position={[0.35, -0.1, 0.8]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#000" />
        </Cylinder>
        <Cylinder args={[0.4, 0.4, 0.1, 16]} position={[0.35, -0.1, -0.8]} rotation={[0, 0, Math.PI/2]}>
          <meshStandardMaterial color="#000" />
        </Cylinder>
      </group>

      {/* PSU */}
      <group ref={psuRef} position={[-0.5, 0.6, 1.5]}>
        <Box args={[1.5, 1, 1.8]}>
          <meshStandardMaterial color="#111" />
        </Box>
        <mesh position={[0, 0, 0.91]}>
          <planeGeometry args={[1, 0.5]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
      </group>
    </group>
  );
}

export function ExplodedComputer({ isMobile }: { isMobile: boolean }) {
  return (
    <WebGLErrorBoundary fallback={<div className="w-full h-full" style={{background:'linear-gradient(135deg,#050816 0%,#0d0d2b 100%)'}} />}>
    <Canvas camera={{ position: [6, 4, 8], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050816']} />
      
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 10, 5]} intensity={2} color="#fff" penumbra={1} />
      <spotLight position={[-5, 5, -5]} intensity={1} color="#06b6d4" />
      <spotLight position={[5, -5, 5]} intensity={1} color="#7c3aed" />

      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <ExplodedPC />
        </Float>
        
        <Environment preset="studio" environmentIntensity={0.2} />

        {!isMobile && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
    </WebGLErrorBoundary>
  );
}
