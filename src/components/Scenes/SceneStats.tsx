"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SceneStats() {
  const groupRef = useRef<THREE.Group>(null);
  const cardsRef = useRef<THREE.Group[]>([]);

  // Generate coordinate offsets for 3 floating stats panel rigs
  const panelPositions = [
    [-3.2, 0.5, 0],  // Left Panel
    [0.0, -0.2, 0.5], // Center Panel (slightly forward)
    [3.2, 0.3, 0],   // Right Panel
  ];

  const materials = useMemo(() => {
    return {
      glass: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.25,
        transmission: 0.95,
        ior: 1.5,
        roughness: 0.05,
        thickness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
      }),
      crimsonTrim: new THREE.MeshStandardMaterial({
        color: "#800000", // Dark Crimson
        roughness: 0.2,
        metalness: 0.9,
      }),
      neonRedLed: new THREE.MeshStandardMaterial({
        color: "#ff1d1d",
        emissive: "#ff1d1d",
        emissiveIntensity: 1.5,
      }),
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Ambient floating drift for the entire section group
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
    }

    // Individual floating and rotation movements for each card panel
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const floatOffset = Math.sin(time * 1.0 + index * 2.0) * 0.15;
      card.position.y = panelPositions[index][1] + floatOffset;
      card.rotation.x = Math.sin(time * 0.6 + index) * 0.03;
      card.rotation.y = Math.cos(time * 0.5 + index) * 0.04;
    });
  });

  return (
    <group position={[0, -12, 0]} ref={groupRef}>
      {/* Volumetric Red Backlighting */}
      <pointLight position={[-4, 2, -2]} distance={15} intensity={10} color="#ff1d1d" />
      <pointLight position={[0, -2, -1]} distance={12} intensity={8} color="#800000" />
      <pointLight position={[4, 2, -2]} distance={15} intensity={10} color="#ff1d1d" />

      {/* Floating 3D Stats Glass Panels */}
      {panelPositions.map((pos, index) => (
        <group
          key={index}
          position={[pos[0], pos[1], pos[2]]}
          ref={(el) => {
            if (el) cardsRef.current[index] = el as THREE.Group;
          }}
        >
          {/* Main Glass Panel slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.2, 3.0, 0.08]} />
            <primitive object={materials.glass} attach="material" />
          </mesh>

          {/* Crimson Red Metal Bezel Trim */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.24, 3.04, 0.04]} />
            <primitive object={materials.crimsonTrim} attach="material" wireframe />
          </mesh>

          {/* Tiny glowing LEDs at the corners of the panels */}
          {/* Top-left LED */}
          <mesh position={[-1.0, 1.4, 0.05]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <primitive object={materials.neonRedLed} attach="material" />
          </mesh>
          {/* Top-right LED */}
          <mesh position={[1.0, 1.4, 0.05]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <primitive object={materials.neonRedLed} attach="material" />
          </mesh>
          {/* Bottom-left LED */}
          <mesh position={[-1.0, -1.4, 0.05]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <primitive object={materials.neonRedLed} attach="material" />
          </mesh>
          {/* Bottom-right LED */}
          <mesh position={[1.0, -1.4, 0.05]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <primitive object={materials.neonRedLed} attach="material" />
          </mesh>

          {/* Tech decorative wire mesh grid floating inside the glass */}
          <mesh position={[0, 0, -0.01]} scale={[0.9, 0.9, 1]}>
            <planeGeometry args={[2.0, 2.8]} />
            <meshBasicMaterial color="#ff1d1d" wireframe transparent opacity={0.06} />
          </mesh>
        </group>
      ))}

      {/* Background starfields/particles floating around the numbers */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 60 }).flatMap(() => [
                  (Math.random() - 0.5) * 15,
                  (Math.random() - 0.5) * 8,
                  (Math.random() - 0.5) * 10,
                ])
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#ff1d1d"
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
