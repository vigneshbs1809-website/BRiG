"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SceneBrigHaus() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Warm amber particles swirling around the house structure
  const particleCount = 180;
  const particleData = useMemo(() => {
    const list = [];
    for (let i = 0; i < particleCount; i++) {
      list.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 2.8 + 0.8,
        speed: Math.random() * 0.01 + 0.004,
        yOffset: (Math.random() - 0.5) * 3.5,
      });
    }
    return list;
  }, []);

  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate the entire house scene slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.08;
    }

    // Spin and pulse the inner core "creative engine" crystal
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.3;
      coreRef.current.rotation.y = time * 0.4;
      const pulse = 1.0 + Math.sin(time * 2.0) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Animate swarming particles
    particleData.forEach((p, i) => {
      p.angle += p.speed;
      // Drift up and down
      p.yOffset += Math.sin(time * 0.5 + i) * 0.002;

      particlePositions[i * 3] = Math.cos(p.angle) * p.radius;
      particlePositions[i * 3 + 1] = p.yOffset;
      particlePositions[i * 3 + 2] = Math.sin(p.angle) * p.radius;
    });

    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -36, 0]} ref={groupRef}>
      {/* Warm Volumetric Lights */}
      <pointLight position={[0, 0, 0]} distance={15} intensity={14} color="#ffa500" />
      <pointLight position={[-3, 3, 2]} distance={12} intensity={6} color="#ff3b00" />
      <pointLight position={[3, -3, -2]} distance={12} intensity={6} color="#ffddaa" />

      {/* ABSTRACT WIREFRAME HOUSE STRUCTURE */}
      <group scale={1.2}>
        {/* House Base Cylindrical Pillars */}
        {/* Floor Base */}
        <mesh position={[0, -1.0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[2.0, 0.06, 2.0]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} wireframe />
        </mesh>
        
        {/* Columns / Pillars */}
        {/* Back-left */}
        <mesh position={[-1.0, 0, -1.0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Back-right */}
        <mesh position={[1.0, 0, -1.0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Front-left */}
        <mesh position={[-1.0, 0, 1.0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Front-right */}
        <mesh position={[1.0, 0, 1.0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Ceiling beams */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[2.0, 0.04, 2.0]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} wireframe />
        </mesh>

        {/* PITCHED ROOF TRUSSES */}
        {/* Ridge beam */}
        <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Rafters - Front pitch left */}
        <mesh position={[-0.5, 1.4, 1.0]} rotation={[0, 0, -Math.PI / 4.7]}>
          <cylinderGeometry args={[0.02, 0.02, 1.42, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Rafters - Front pitch right */}
        <mesh position={[0.5, 1.4, 1.0]} rotation={[0, 0, Math.PI / 4.7]}>
          <cylinderGeometry args={[0.02, 0.02, 1.42, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Rafters - Back pitch left */}
        <mesh position={[-0.5, 1.4, -1.0]} rotation={[0, 0, -Math.PI / 4.7]}>
          <cylinderGeometry args={[0.02, 0.02, 1.42, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Rafters - Back pitch right */}
        <mesh position={[0.5, 1.4, -1.0]} rotation={[0, 0, Math.PI / 4.7]}>
          <cylinderGeometry args={[0.02, 0.02, 1.42, 8]} />
          <meshStandardMaterial color="#1a120c" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* CORE GLOWING CRYSTAL ENGINE (Creative Spark) */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshPhysicalMaterial
          color="#ffaa00"
          transparent
          opacity={0.9}
          emissive="#ff5500"
          emissiveIntensity={2.5}
          transmission={0.5}
          ior={1.7}
          roughness={0.1}
          thickness={0.8}
        />
      </mesh>

      {/* Floating particles (ambient warm dust embers) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#ffa500"
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
