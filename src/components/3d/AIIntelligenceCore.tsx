import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';

// ────────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────────

function CoreMesh({ hovered }: { hovered: boolean }) {
  const solidRef = useRef<THREE.Mesh>(null);
  const wireRef  = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (solidRef.current) {
      solidRef.current.rotation.x += delta * 0.28;
      solidRef.current.rotation.y += delta * 0.45;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.18;
      wireRef.current.rotation.y -= delta * 0.30;
    }
  });

  return (
    <group>
      {/* Solid core */}
      <mesh ref={solidRef}>
        <icosahedronGeometry args={[0.68, 1]} />
        <meshStandardMaterial
          color="#4f8cff"
          emissive="#1a3a8a"
          emissiveIntensity={hovered ? 3.5 : 1.4}
          metalness={0.9}
          roughness={0.08}
        />
      </mesh>
      {/* Counter-rotating wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[0.74, 1]} />
        <meshBasicMaterial
          color="#4f8cff"
          wireframe
          transparent
          opacity={hovered ? 0.55 : 0.22}
        />
      </mesh>
      {/* Holographic sphere */}
      <mesh>
        <sphereGeometry args={[1.02, 32, 32]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#3a1a8a"
          emissiveIntensity={0.35}
          transparent
          opacity={hovered ? 0.1 : 0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function NeuralRings({ hovered }: { hovered: boolean }) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const sp = hovered ? 2 : 1;
    if (r1.current) r1.current.rotation.z += delta * 0.40 * sp;
    if (r2.current) r2.current.rotation.x += delta * 0.28 * sp;
    if (r3.current) r3.current.rotation.y += delta * 0.50 * sp;
  });

  return (
    <>
      <mesh ref={r1}>
        <torusGeometry args={[1.28, 0.016, 8, 100]} />
        <meshStandardMaterial color="#4f8cff" emissive="#4f8cff" emissiveIntensity={hovered ? 2.4 : 0.9} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.52, 0.013, 8, 100]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={hovered ? 2.2 : 0.7} />
      </mesh>
      <mesh ref={r3} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.72, 0.009, 8, 100]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={hovered ? 1.8 : 0.5} />
      </mesh>
    </>
  );
}

function OrbitParticles() {
  const pts = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const count = 130;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.55 + Math.random() * 0.9;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (pts.current) {
      pts.current.rotation.y += delta * 0.09;
      pts.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <points ref={pts} geometry={geo}>
      <pointsMaterial color="#4f8cff" size={0.024} transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Main scene — mouse parallax wrapper
// ────────────────────────────────────────────────────────────────────────────────

function Scene({
  mousePos,
  isMobile,
}: {
  mousePos: { x: number; y: number };
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x +=
      (mousePos.y * 0.22 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.y +=
      (mousePos.x * 0.38 - groupRef.current.rotation.y) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {/* Floating animation layer */}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.4}>
        <group
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <CoreMesh hovered={hovered} />
        </group>
      </Float>

      <NeuralRings hovered={hovered} />
      <OrbitParticles />

      <Sparkles
        count={isMobile ? 18 : 38}
        scale={4.2}
        size={hovered ? 3.5 : 1.8}
        speed={hovered ? 0.55 : 0.14}
        color="#4f8cff"
      />

      {/* Lighting rig */}
      <ambientLight intensity={0.35} />
      <pointLight color="#4f8cff" intensity={hovered ? 5 : 2.2} distance={7} />
      <pointLight color="#7c3aed" intensity={1.2} distance={5.5} position={[2.2, 1, 0]} />
      <pointLight color="#06b6d4" intensity={0.9} distance={5}   position={[-2, -1, 1.2]} />
    </group>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// WebGL capability probe (runs once, synchronously)
// ────────────────────────────────────────────────────────────────────────────────

function probeWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// Animated CSS fallback shown when WebGL is unavailable
// ────────────────────────────────────────────────────────────────────────────────

function GlowFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none select-none">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute w-64 h-64 rounded-full border border-primary/15 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-52 h-52 rounded-full border border-secondary/20 animate-ping" style={{ animationDuration: '2.3s', animationDelay: '0.5s' }} />
        {/* Core glow */}
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 via-secondary/15 to-transparent border border-primary/25 animate-pulse" style={{ animationDuration: '2s' }} />
        {/* Inner bright spot */}
        <div className="absolute w-16 h-16 rounded-full bg-primary/40 blur-xl animate-pulse" />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Public export
// ────────────────────────────────────────────────────────────────────────────────

export function AIIntelligenceCore({ isMobile }: { isMobile: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Probe WebGL support on first render — static for the component lifetime
  const [webglAvailable] = useState<boolean>(() => probeWebGL());

  useEffect(() => {
    if (!webglAvailable) return;
    const handler = (e: MouseEvent) => {
      setMousePos({
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [webglAvailable]);

  if (!webglAvailable) {
    return <GlowFallback />;
  }

  return (
    <WebGLErrorBoundary fallback={<GlowFallback />}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 4.6], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
          style={{ background: 'transparent' }}
          dpr={[1, isMobile ? 1.5 : 2]}
        >
          <Scene mousePos={mousePos} isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </WebGLErrorBoundary>
  );
}
