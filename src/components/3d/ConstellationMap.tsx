import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useMemo, useRef } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Inner component — must render inside Canvas
function ConstellationScene({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // Create nodes (articles)
  const nodes = useMemo(() => {
    const items = [];
    const count = 15;
    for (let i = 0; i < count; i++) {
      const theta = i * Math.PI * 2.39996;
      const r = Math.pow(i / count, 0.5) * 8;
      const x = r * Math.cos(theta);
      const y = (Math.random() - 0.5) * 4;
      const z = r * Math.sin(theta);
      const isHub = i % 4 === 0;
      items.push({
        position: new THREE.Vector3(x, y, z),
        color: isHub ? '#4f8cff' : '#06b6d4',
        size: isHub ? 0.3 : 0.15,
        id: i,
      });
    }
    return items;
  }, []);

  // Create connections
  const lines = useMemo(() => {
    const l: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      const distances = nodes
        .map((n, idx) => ({ idx, dist: n.position.distanceTo(nodes[i].position) }))
        .sort((a, b) => a.dist - b.dist);
      l.push([nodes[i].position, nodes[distances[1].idx].position]);
      if (distances.length > 2)
        l.push([nodes[i].position, nodes[distances[2].idx].position]);
    }
    return l;
  }, [nodes]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={isMobile ? 1000 : 3000} factor={4} saturation={0} fade speed={1} />
      <group ref={groupRef}>
        {nodes.map((node, i) => (
          <Float key={i} speed={2} floatIntensity={2} rotationIntensity={0}>
            <mesh position={node.position}>
              <sphereGeometry args={[node.size, 16, 16]} />
              <meshBasicMaterial color={node.color} />
            </mesh>
            <mesh position={node.position}>
              <sphereGeometry args={[node.size * 2, 16, 16]} />
              <meshBasicMaterial color={node.color} transparent opacity={0.2} />
            </mesh>
          </Float>
        ))}
        {lines.map((points, i) => (
          <Line
            key={`line-${i}`}
            points={[points[0], points[1]]}
            color="#4f8cff"
            opacity={0.15}
            transparent
            lineWidth={1}
          />
        ))}
      </group>
      {!isMobile && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
        </EffectComposer>
      )}
    </>
  );
}

export function ConstellationMap({ isMobile }: { isMobile: boolean }) {
  return (
    <WebGLErrorBoundary
      fallback={
        <div
          className="w-full h-full"
          style={{ background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #050816 80%)' }}
        />
      }
    >
      <Canvas camera={{ position: [0, 5, 15], fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={['#050816']} />
        <Suspense fallback={null}>
          <ConstellationScene isMobile={isMobile} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
      </Canvas>
    </WebGLErrorBoundary>
  );
}
