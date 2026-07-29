"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PodConfig {
  pos: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  type: "prism" | "lens";
}

export default function Scene6Testimonials() {
  const groupRef = useRef<THREE.Group>(null);
  const podsRef = useRef<THREE.Mesh[]>([]);

  // Configure orbital glass prism elements
  const podData = useMemo<PodConfig[]>(() => [
    { pos: [-3.2, 1.0, 0], scale: 1.1, speed: 0.28, phase: 0, type: "prism" }, // Triangular prism
    { pos: [3.0, -1.0, 0], scale: 1.3, speed: 0.22, phase: Math.PI / 2, type: "lens" },  // Convex lens
    { pos: [-2.0, -2.0, 0], scale: 0.9, speed: 0.35, phase: Math.PI, type: "prism" },    // Triangular prism
    { pos: [2.2, 2.0, 0], scale: 1.0, speed: 0.25, phase: Math.PI * 1.5, type: "lens" } // Convex lens
  ], []);

  const prismColors = ["#ffa500", "#00f0ff", "#ff007f", "#7000ff"];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Slow orbital rotation of the group container
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.02;
    }

    // Animate circular orbits for the optical glass prisms
    podsRef.current.forEach((pod, index) => {
      if (!pod) return;
      const data = podData[index];
      
      // Orbit paths in X and Z
      const angle = time * data.speed + data.phase;
      const radiusX = Math.abs(data.pos[0]);
      const radiusZ = 1.8;

      pod.position.x = Math.sin(angle) * radiusX;
      pod.position.z = Math.cos(angle) * radiusZ;
      pod.position.y = data.pos[1] + Math.sin(time * 0.9 + index) * 0.15; // Vertical sway
      
      // Spin the glass elements on their local axes
      pod.rotation.y = time * 0.4 + index;
      pod.rotation.x = time * 0.2 + index * 0.5;
    });
  });

  return (
    <group position={[0, -62, 0]} ref={groupRef}>
      {podData.map((data, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) podsRef.current[index] = el;
          }}
          position={new THREE.Vector3(...data.pos)}
        >
          {data.type === "prism" ? (
            // 3-sided Cylinder creates a triangular prism!
            <cylinderGeometry args={[0.7 * data.scale, 0.7 * data.scale, 1.4 * data.scale, 3]} />
          ) : (
            // 24-sided Cylinder represents a bi-convex lens element
            <group rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.8 * data.scale, 0.8 * data.scale, 0.3 * data.scale, 24]} />
            </group>
          )}
          
          {/* High-end glass material with chromatic dispersion */}
          <meshPhysicalMaterial
            transmission={0.94}
            thickness={1.5}
            roughness={0.03}
            ior={1.65} // Optical silicate glass
            clearcoat={1.0}
            clearcoatRoughness={0.01}
            color={prismColors[index]}
            emissive={prismColors[index]}
            emissiveIntensity={0.15}
            reflectivity={1.0}
          />
        </mesh>
      ))}

      {/* Shifting warm studio amber and pink lighting */}
      <pointLight position={[-4, 4, -2]} distance={15} intensity={8} color="#ff007f" />
      <pointLight position={[4, -4, -2]} distance={15} intensity={8} color="#ffa500" />
    </group>
  );
}
