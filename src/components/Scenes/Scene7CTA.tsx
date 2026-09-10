"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PortalMaterial } from "../Shaders/PortalMaterial";

interface ParticleState {
  angle: number;
  radius: number;
  speed: number;
  yOffset: number;
}

export default function Scene7CTA() {
  const portalRef = useRef<THREE.Mesh>(null);
  const gearRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Construct custom portal shader material and initialize with warm media studio colors
  const portalMaterial = useMemo(() => {
    const mat = new (PortalMaterial as any)();
    mat.transparent = true;
    mat.uColorStart = new THREE.Color("#ffa500"); // Warm Amber
    mat.uColorEnd = new THREE.Color("#f79882");   // Peach/Coral
    return mat;
  }, []);

  // Build coordinate data for light rays getting sucked into the lens aperture
  const count = 150;
  const particleData = useMemo<ParticleState[]>(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 4.0 + 1.0;
      list.push({
        angle,
        radius,
        speed: Math.random() * 0.02 + 0.008,
        yOffset: (Math.random() - 0.5) * 0.5
      });
    }
    return list;
  }, []);

  const positions = useMemo(() => new Float32Array(count * 3), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Swirl portal shader time updates
    portalMaterial.uTime = time;
    
    // Rotate portal disc
    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.18;
      
      // Pulse scale to mimic camera shutter breathe
      const scaleVal = 1.0 + Math.sin(time * 2.0) * 0.03;
      portalRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    }

    // Rotate outer camera focus ring gear in opposite direction
    if (gearRef.current) {
      gearRef.current.rotation.z = -time * 0.1;
    }

    // Orbit particles in a spiral pull towards lens focal center
    particleData.forEach((p, i) => {
      p.radius -= p.speed;
      p.angle += 0.035; // Accelerated swirling speed

      // Respawn at outer edge when sucked past focal point
      if (p.radius < 0.25) {
        p.radius = Math.random() * 2.5 + 2.0;
        p.angle = Math.random() * Math.PI * 2;
      }

      positions[i * 3] = Math.cos(p.angle) * p.radius;
      positions[i * 3 + 1] = p.yOffset;
      positions[i * 3 + 2] = Math.sin(p.angle) * p.radius;
    });

    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -72, 0]}>
      {/* Cinematic Aperture Portal */}
      <mesh ref={portalRef} rotation={[-Math.PI / 2.1, 0, 0]}>
        <planeGeometry args={[7.2, 7.2]} />
        <primitive object={portalMaterial} attach="material" />
      </mesh>

      {/* 3D Camera Lens Focus Gear Ring */}
      <mesh ref={gearRef} rotation={[-Math.PI / 2.1, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[3.2, 0.12, 12, 64]} />
        <meshStandardMaterial
          color="#0b0b0f"
          metalness={0.95}
          roughness={0.12}
          wireframe
        />
      </mesh>

      {/* Inner metal rim */}
      <mesh rotation={[-Math.PI / 2.1, 0, 0]} position={[0, -0.05, 0]}>
        <torusGeometry args={[3.05, 0.05, 8, 48]} />
        <meshBasicMaterial color="#1a1a24" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Trailing light rays/flares */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#ffaa00" // Golden-amber light flares
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Golden lighting */}
      <pointLight position={[0, 0, 0]} distance={15} intensity={14} color="#ffa500" />
      <pointLight position={[0, 1.5, 0]} distance={10} intensity={8} color="#f79882" />
    </group>
  );
}
