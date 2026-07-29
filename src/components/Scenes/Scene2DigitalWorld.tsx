"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WaveMaterial } from "../Shaders/WaveMaterial";

export default function Scene2DigitalWorld() {
  const meshRef = useRef<THREE.Points>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Instantiate the material procedurally
  const waveMaterial = useMemo(() => {
    const mat = new (WaveMaterial as any)();
    mat.uColor = new THREE.Color("#f79882"); // Warm coral color for creative media feel
    mat.uSize = 16.0;
    return mat;
  }, []);
  
  // Build a 50x50 audio waveform particle grid
  const count = 50;
  const positions = useMemo(() => {
    const arr = [];
    for (let x = 0; x < count; x++) {
      for (let z = 0; z < count; z++) {
        const px = (x - count / 2) * 0.45;
        const pz = (z - count / 2) * 0.45;
        arr.push(px, -2.2, pz); // Audio spectrum plane slightly lowered
      }
    }
    return new Float32Array(arr);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Time-driven shader displacement
    waveMaterial.uTime = time;

    // Shift wave color dynamically (visualizer frequency simulation)
    const baseColor = new THREE.Color("#f79882");
    const shiftColor = new THREE.Color("#7000ff");
    waveMaterial.uColor.lerpColors(baseColor, shiftColor, (Math.sin(time * 1.5) + 1) / 2);

    // Animate concentric audio/shutter rings (opposing rotations)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.25;
      ring1Ref.current.rotation.x = Math.sin(time * 0.4) * 0.15;
      ring1Ref.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05); // Pulsing to beat
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.4;
      ring2Ref.current.rotation.z = time * 0.15;
      ring2Ref.current.scale.setScalar(1 + Math.cos(time * 2) * 0.04);
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = time * 0.15;
      ring3Ref.current.rotation.x = -Math.cos(time * 0.3) * 0.1;
    }
  });

  return (
    <group position={[0, -12, 0]}>
      {/* 3D Wavy grid particle field (Audio waves) */}
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <primitive object={waveMaterial} attach="material" />
      </points>

      {/* Spoked concentric media soundwave/iris rings */}
      <group position={[0, 0, 0]}>
        {/* Ring 1: Main outer iris ring */}
        <mesh ref={ring1Ref}>
          <cylinderGeometry args={[2.2, 2.2, 0.15, 32, 2, true]} />
          <meshBasicMaterial
            color="#ff007f"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Ring 2: Intermediate spoked wave ring */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.5, 0.08, 8, 48]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Ring 3: Center focus core ring */}
        <mesh ref={ring3Ref}>
          <cylinderGeometry args={[0.8, 0.8, 0.4, 24, 2, true]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.25}
          />
        </mesh>
      </group>

      {/* Cinema Lights focus */}
      <pointLight position={[-4, 2, -2]} distance={15} intensity={10} color="#ff007f" />
      <pointLight position={[4, -2, 2]} distance={15} intensity={10} color="#00f0ff" />
    </group>
  );
}
