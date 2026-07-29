"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SceneFAQ() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Calm, slow rotation of the parent group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.03;
    }

    // Ripple concentric rings vertically using sine waves
    if (ring1Ref.current) {
      ring1Ref.current.position.y = Math.sin(time * 0.6) * 0.2;
      ring1Ref.current.rotation.x = Math.sin(time * 0.2) * 0.05;
      ring1Ref.current.rotation.y = time * 0.05;
    }

    if (ring2Ref.current) {
      ring2Ref.current.position.y = Math.cos(time * 0.5) * 0.15;
      ring2Ref.current.rotation.z = Math.cos(time * 0.25) * 0.05;
      ring2Ref.current.rotation.y = -time * 0.07;
    }

    if (ring3Ref.current) {
      ring3Ref.current.position.y = Math.sin(time * 0.7 + 1.0) * 0.18;
      ring3Ref.current.rotation.x = -Math.cos(time * 0.3) * 0.05;
      ring3Ref.current.rotation.y = time * 0.04;
    }
  });

  return (
    <group position={[0, -60, 0]} ref={groupRef}>
      {/* Calm, dim, soft studio lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 4, 2]} distance={15} intensity={5} color="#800000" />
      <pointLight position={[-4, -2, -2]} distance={12} intensity={4} color="#001122" />

      {/* Ripple Rings */}
      {/* Outer Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.6, 0.04, 8, 64]} />
        <meshBasicMaterial
          color="#ff1d1d"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Intermediate Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.03, 8, 48]} />
        <meshBasicMaterial
          color="#800000"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* Inner Ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.4, 0.02, 8, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>

      {/* Soft drifting dust field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 80 }).flatMap(() => [
                  (Math.random() - 0.5) * 12,
                  (Math.random() - 0.5) * 6,
                  (Math.random() - 0.5) * 8,
                ])
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#ffa500"
          transparent
          opacity={0.25}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
