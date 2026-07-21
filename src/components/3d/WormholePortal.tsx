import { Canvas } from '@react-three/fiber';
import { OrbitControls, Tube } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useMemo, useRef } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Wormhole() {
  const tunnelRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Custom shader for the wormhole effect
  const shader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color("#4f8cff") },
        color2: { value: new THREE.Color("#7c3aed") }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        
        // Simple noise function
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          // Flowing UVs
          vec2 p = vUv;
          p.y -= time * 0.5; // Flow forward
          
          // Pattern
          float n = noise(floor(p * vec2(20.0, 40.0)));
          float rings = sin(p.y * 50.0) * 0.5 + 0.5;
          float lines = sin(p.x * 20.0) * 0.5 + 0.5;
          
          // Combine patterns
          float pattern = n * rings * lines;
          
          // Color mix based on depth
          vec3 finalColor = mix(color1, color2, vUv.y);
          
          // Glow intensity
          float alpha = pattern * vUv.y * 2.0; // Fade out near camera
          
          gl_FragColor = vec4(finalColor * alpha * 2.0, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z -= 0.001;
    }
  });

  // Create a curved path for the tube
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 5),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, -5),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, -20)
    ]);
  }, []);

  return (
    <group ref={tunnelRef}>
      <Tube args={[curve, 64, 2, 32, false]}>
        <primitive object={shader} ref={materialRef} attach="material" />
      </Tube>
    </group>
  );
}

export function WormholePortal({ isMobile }: { isMobile: boolean }) {
  return (
    <WebGLErrorBoundary fallback={<div className="w-full h-full" style={{background:'radial-gradient(ellipse at center, rgba(124,58,237,0.3) 0%, rgba(79,140,255,0.1) 40%, #050816 70%)'}} />}>
    <Canvas camera={{ position: [0, 0, 4], fov: 60 }} dpr={[1, 2]}>
      <color attach="background" args={['#050816']} />
      
      <Suspense fallback={null}>
        <Wormhole />

        {!isMobile && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.1} mipmapBlur intensity={2} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI/2} minPolarAngle={Math.PI/2} />
    </Canvas>
    </WebGLErrorBoundary>
  );
}
