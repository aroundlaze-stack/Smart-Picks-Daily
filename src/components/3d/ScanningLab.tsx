import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Float, Line, Environment } from '@react-three/drei';
import { EffectComposer, Scanline, Bloom } from '@react-three/postprocessing';
import { Suspense, useRef } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Represents a product being scanned
function ScannedProduct() {
  return (
    <group position={[0, -1, 0]}>
      {/* Base Pedestal */}
      <Cylinder args={[2, 2.2, 0.2, 32]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Glowing ring */}
      <Cylinder args={[1.9, 1.9, 0.22, 32]} position={[0, -0.1, 0]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} wireframe />
      </Cylinder>

      {/* Abstract Laptop Shape */}
      <Float speed={2} floatIntensity={0.5} rotationIntensity={0.1}>
        <group position={[0, 1, 0]} rotation={[0.2, -0.4, 0]}>
          <Box args={[2.5, 0.1, 1.8]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
          </Box>
          <Box args={[2.5, 1.5, 0.05]} position={[0, 0.75, -0.9]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
          </Box>
          {/* Screen content */}
          <Box args={[2.4, 1.4, 0.06]} position={[0, 0.75, -0.89]} rotation={[-0.1, 0, 0]}>
            <meshBasicMaterial color="#000" />
          </Box>
          {/* Holographic grid on screen */}
          <mesh position={[0, 0.75, -0.85]} rotation={[-0.1, 0, 0]}>
            <planeGeometry args={[2.3, 1.3]} />
            <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// Scanning beam that sweeps across
function ScannerBeam() {
  const beamRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    const y = Math.sin(clock.getElapsedTime() * 2) * 1.5 + 1;
    if (beamRef.current) {
      beamRef.current.position.y = y;
    }
    if (lineRef.current) {
      lineRef.current.position.y = y;
    }
  });

  return (
    <group>
      <mesh ref={beamRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <group ref={lineRef}>
        <Line points={[[-3, 0, -3], [3, 0, -3], [3, 0, 3], [-3, 0, 3], [-3, 0, -3]]} color="#06b6d4" lineWidth={2} />
      </group>
    </group>
  );
}

export function ScanningLab({ isMobile }: { isMobile: boolean }) {
  return (
    <WebGLErrorBoundary fallback={<div className="w-full h-full" style={{background:'linear-gradient(180deg,#050816 0%,#06b6d410 50%,#050816 100%)'}} />}>
    <Canvas camera={{ position: [5, 4, 5], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050816']} />
      
      <ambientLight intensity={0.2} />
      <spotLight position={[0, 10, 0]} intensity={2} color="#4f8cff" angle={0.6} penumbra={1} castShadow />
      <spotLight position={[-5, 5, -5]} intensity={1} color="#7c3aed" />

      <Suspense fallback={null}>
        <ScannedProduct />
        <ScannerBeam />
        
        {/* Background Grid */}
        <gridHelper args={[20, 20, '#111', '#111']} position={[0, -1, 0]} />
        
        <Environment preset="night" environmentIntensity={0.2} />

        {!isMobile && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1} />
            <Scanline density={2} opacity={0.1} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2.5} />
    </Canvas>
    </WebGLErrorBoundary>
  );
}
