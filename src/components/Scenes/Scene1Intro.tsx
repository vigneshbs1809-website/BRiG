"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Scene1Intro() {
  const barrelRef = useRef<THREE.Group>(null);
  const element1Ref = useRef<THREE.Mesh>(null);
  const element2Ref = useRef<THREE.Mesh>(null);
  const element3Ref = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Generate cinematic dust particles procedurally
  const dustPositions = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;     // X
      positions[i + 1] = (Math.random() - 0.5) * 30; // Y
      positions[i + 2] = (Math.random() - 0.5) * 30; // Z
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate camera lens focal zoom elements (sliding along Z axis)
    if (element1Ref.current) {
      element1Ref.current.position.z = 0.5 + Math.sin(time * 0.8) * 0.15;
      element1Ref.current.rotation.y = time * 0.18;
      element1Ref.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    
    if (element2Ref.current) {
      element2Ref.current.position.z = Math.cos(time * 0.6) * 0.1;
      element2Ref.current.rotation.y = -time * 0.25;
    }
    
    if (element3Ref.current) {
      element3Ref.current.position.z = -0.5 - Math.sin(time * 0.8) * 0.12;
      element3Ref.current.rotation.y = time * 0.32;
    }

    // Barrel subtle rotation
    if (barrelRef.current) {
      barrelRef.current.rotation.z = time * 0.08;
      barrelRef.current.rotation.y = Math.sin(time * 0.25) * 0.15;
      barrelRef.current.rotation.x = Math.cos(time * 0.2) * 0.1;
    }
    
    // Drifting cinematic dust field
    if (dustRef.current) {
      dustRef.current.rotation.y = time * 0.015;
      dustRef.current.rotation.z = Math.sin(time * 0.01) * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Volumetric Studio Backlights: Warm Amber & Cool Indigo */}
      <pointLight position={[2, 3, -3]} distance={15} intensity={14} color="#f79882" />
      <pointLight position={[-2, -3, 3]} distance={15} intensity={10} color="#0066ff" />
      
      {/* 3D Cinematic Lens Group */}
      <group ref={barrelRef}>
        {/* Outer Lens Barrel Rings */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.5, 0.08, 16, 64]} />
          <meshStandardMaterial color="#0b0b0f" metalness={0.9} roughness={0.1} />
        </mesh>
        
        <mesh position={[0, 0, 0.8]}>
          <torusGeometry args={[1.58, 0.04, 16, 64]} />
          <meshStandardMaterial color="#0b0b0f" metalness={0.9} roughness={0.1} />
        </mesh>

        <mesh position={[0, 0, -0.8]}>
          <torusGeometry args={[1.42, 0.04, 16, 64]} />
          <meshStandardMaterial color="#0b0b0f" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Focus ridges / barrel skeleton */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 1.6, 32, 1, true]} />
          <meshBasicMaterial color="#1a1a24" wireframe transparent opacity={0.15} />
        </mesh>

        {/* Lens Element 1: Curved Front Glass Dome */}
        <mesh ref={element1Ref} position={[0, 0, 0.5]}>
          <sphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            transmission={0.95}
            opacity={1.0}
            roughness={0.02}
            ior={1.62} // Flint glass
            thickness={0.6}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
            attenuationColor="#00f0ff"
            attenuationDistance={1}
          />
        </mesh>

        {/* Lens Element 2: Central Prism Cylinder */}
        <mesh ref={element2Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 0.3, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            transmission={0.9}
            opacity={1.0}
            roughness={0.05}
            ior={1.52} // Crown glass
            thickness={0.5}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            attenuationColor="#ff007f"
            attenuationDistance={0.8}
          />
        </mesh>

        {/* Lens Element 3: Rear Refractive Disk */}
        <mesh ref={element3Ref} position={[0, 0, -0.5]}>
          <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, Math.PI * 0.65, Math.PI * 0.35]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            transmission={0.95}
            opacity={1.0}
            roughness={0.01}
            ior={1.72} // Heavy flint glass
            thickness={0.4}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
            attenuationColor="#f79882"
            attenuationDistance={1.2}
          />
        </mesh>
      </group>

      {/* Floating cinematic dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#ffcc99" // Warm studio dust motes color
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
