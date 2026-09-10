"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Scene3Props {
  activeService: number | null;
}

export default function Scene3Services({ activeService }: Scene3Props) {
  const groupRef = useRef<THREE.Group>(null);
  const cardsRef = useRef<THREE.Group[]>([]);

  // Access the WebGL viewport size for responsive layout
  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 8;

  // Responsive positions for circular photographic gel filters
  const cardPositions = isMobile 
    ? [
        [-1.3, 1.6, 0],
        [1.3, 1.6, 0],
        [-1.3, -1.6, 0],
        [1.3, -1.6, 0]
      ]
    : [
        [-4.2, 0, 0],
        [-1.4, 0, 0.3],
        [1.4, 0, 0.3],
        [4.2, 0, 0]
      ];

  const filterColors = ["#f79882", "#00f0ff", "#7000ff", "#ffa500"];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mx = state.pointer.x;
    const my = state.pointer.y;

    cardsRef.current.forEach((cardGroup, index) => {
      if (!cardGroup) return;

      const isHovered = activeService === index;

      // Scale filter on active card hover
      const targetScale = isHovered ? 1.3 : 1.0;
      cardGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Parallax rotation towards cursor + soft organic gel floating drift
      const targetRotX = (my * 0.35) + Math.sin(time * 0.7 + index * 1.5) * 0.1;
      const targetRotY = (mx * 0.35) + Math.cos(time * 0.7 + index * 1.5) * 0.1;
      
      cardGroup.rotation.x = THREE.MathUtils.lerp(cardGroup.rotation.x, targetRotX, 0.1);
      cardGroup.rotation.y = THREE.MathUtils.lerp(cardGroup.rotation.y, targetRotY, 0.1);
      cardGroup.rotation.z = THREE.MathUtils.lerp(cardGroup.rotation.z, time * 0.1 + index, 0.05);

      // Lerp position to handle responsive transitions smoothly + vertical float
      const floatY = Math.sin(time * 0.8 + index * 2.2) * 0.15;
      const targetPos = new THREE.Vector3(
        cardPositions[index][0],
        cardPositions[index][1] + floatY,
        cardPositions[index][2]
      );
      cardGroup.position.lerp(targetPos, 0.08);
    });
  });

  return (
    <group position={[0, -24, 0]} ref={groupRef}>
      {cardPositions.map((_, index) => (
        <group
          key={index}
          ref={(el) => {
            if (el) cardsRef.current[index] = el as THREE.Group;
          }}
        >
          {/* Circular Glass Photographic Gel Filter */}
          <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 0.06, 32]} />
            <meshPhysicalMaterial
              transmission={0.92}
              thickness={0.8}
              roughness={0.05}
              ior={1.5}
              clearcoat={1.0}
              clearcoatRoughness={0.01}
              color={filterColors[index]}
              emissive={activeService === index ? filterColors[index] : "#080112"}
              emissiveIntensity={activeService === index ? 1.5 : 0.2}
              reflectivity={1.0}
            />
          </mesh>

          {/* Dark Metallic Lens Thread Mount Ring */}
          <mesh>
            <torusGeometry args={[1.02, 0.04, 12, 48]} />
            <meshStandardMaterial
              color="#0d0d12"
              metalness={0.95}
              roughness={0.12}
            />
          </mesh>

          {/* Inner thread ridges */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.98, 0.98, 0.08, 32, 1, true]} />
            <meshBasicMaterial color="#1a1a24" wireframe transparent opacity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Dynamic cinema studio lighting */}
      <pointLight position={[-4, 3, -1]} distance={15} intensity={8} color="#f79882" />
      <pointLight position={[4, -3, -1]} distance={15} intensity={8} color="#00f0ff" />
    </group>
  );
}
