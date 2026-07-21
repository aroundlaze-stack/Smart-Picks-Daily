import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, ContactShadows, Billboard } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useRef } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Abstract meshes for orbiting objects
function Laptop({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} ref={ref}>
      {/* Base */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#222" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1, -1]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Glowing screen display */}
      <mesh position={[0, 1, -0.94]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshBasicMaterial color="#4f8cff" toneMapped={false} />
      </mesh>
    </group>
  );
}

function OrbitingItem({ 
  radius, 
  speed, 
  yOffset, 
  color,
  label,
  geometry,
  scale = 1
}: { 
  radius: number; 
  speed: number; 
  yOffset: number; 
  color: string;
  label: string;
  geometry: React.ReactNode;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const offset = Math.random() * Math.PI * 2;

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * speed + offset;
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.z = Math.sin(t) * radius;
      groupRef.current.position.y = Math.sin(t * 2) * 0.5 + yOffset;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group scale={scale}>
          {geometry}
          <Billboard position={[0, 1.5, 0]}>
            <Text
              fontSize={0.3}
              color={color}
              font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkGpu8PNMs46E64x2vM.woff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000"
            >
              {label}
            </Text>
          </Billboard>
        </group>
      </Float>
      {/* Orbit path line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -yOffset, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function SpaceFallback() {
  return (
    <div className="w-full h-full" style={{background:'radial-gradient(ellipse at 50% 60%, #0d0d2b 0%, #050816 70%)', overflow:'hidden', position:'relative'}}>
      {[...Array(60)].map((_, i) => (
        <div key={i} style={{position:'absolute', width: Math.random()*2+1+'px', height: Math.random()*2+1+'px', borderRadius:'50%', background:'#fff', opacity: Math.random()*0.7+0.1, top: Math.random()*100+'%', left: Math.random()*100+'%', animation:`pulse ${Math.random()*3+2}s ease-in-out infinite`, animationDelay: Math.random()*3+'s'}} />
      ))}
      <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'120px', height:'120px', borderRadius:'50%', background:'radial-gradient(circle, rgba(79,140,255,0.3) 0%, transparent 70%)', boxShadow:'0 0 60px rgba(79,140,255,0.4)'}} />
      {[80,130,180].map((r,i) => (
        <div key={i} style={{position:'absolute', top:'50%', left:'50%', width:r*2+'px', height:r*2+'px', marginLeft:-r+'px', marginTop:-r+'px', borderRadius:'50%', border:'1px solid rgba(79,140,255,0.15)', animation:`spin ${20+i*8}s linear infinite`}} />
      ))}
    </div>
  );
}

export function SolarSystem({ isMobile }: { isMobile: boolean }) {
  return (
    <WebGLErrorBoundary fallback={<SpaceFallback />}>
    <Canvas camera={{ position: [0, 5, 12], fov: 45 }} dpr={[1, 2]}>
      <color attach="background" args={['#050816']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4f8cff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />

      <Suspense fallback={null}>
        <Stars 
          radius={50} 
          depth={50} 
          count={isMobile ? 1000 : 4000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />

        <group position={[0, -1, 0]}>
          <Laptop position={[0, 0, 0]} />
          
          {/* Keyboard */}
          <OrbitingItem 
            radius={4} 
            speed={0.2} 
            yOffset={0.5} 
            color="#4f8cff" 
            label="Keyboards"
            scale={0.5}
            geometry={
              <mesh ref={useRef<THREE.Mesh>(null)}>
                <boxGeometry args={[2, 0.2, 0.8]} />
                <meshStandardMaterial color="#222" emissive="#4f8cff" emissiveIntensity={0.2} />
              </mesh>
            }
          />

          {/* Mouse */}
          <OrbitingItem 
            radius={5.5} 
            speed={0.15} 
            yOffset={-0.2} 
            color="#06b6d4" 
            label="Mice"
            scale={0.4}
            geometry={
              <mesh ref={useRef<THREE.Mesh>(null)}>
                <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
                <meshStandardMaterial color="#333" emissive="#06b6d4" emissiveIntensity={0.2} />
              </mesh>
            }
          />

          {/* Headphones */}
          <OrbitingItem 
            radius={7} 
            speed={0.1} 
            yOffset={1} 
            color="#7c3aed" 
            label="Audio"
            scale={0.6}
            geometry={
              <mesh ref={useRef<THREE.Mesh>(null)}>
                <torusGeometry args={[0.6, 0.2, 16, 32, Math.PI]} />
                <meshStandardMaterial color="#222" emissive="#7c3aed" emissiveIntensity={0.2} />
              </mesh>
            }
          />

          {/* Monitor */}
          <OrbitingItem 
            radius={8.5} 
            speed={0.08} 
            yOffset={-0.5} 
            color="#f0f4ff" 
            label="Displays"
            scale={0.7}
            geometry={
              <mesh ref={useRef<THREE.Mesh>(null)}>
                <boxGeometry args={[1.6, 1, 0.1]} />
                <meshStandardMaterial color="#111" emissive="#f0f4ff" emissiveIntensity={0.1} />
              </mesh>
            }
          />
        </group>

        <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={20} blur={2} far={4} />

        {!isMobile && (
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          </EffectComposer>
        )}
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 2.2} 
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
    </WebGLErrorBoundary>
  );
}
