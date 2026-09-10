"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NodeData {
  pos: THREE.Vector3;
  basePos: THREE.Vector3;
  speed: number;
  phase: number;
  currentPos?: THREE.Vector3;
}

export default function Scene5Stats() {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const sphereRefs = useRef<THREE.Mesh[]>([]);

  // Generate 28 nodes in a high-fidelity 3D double-helix configuration
  const nodeCount = 28;
  const nodes = useMemo<NodeData[]>(() => {
    const list = [];
    for (let i = 0; i < nodeCount; i++) {
      // Helix math: alternate between two strands
      const strand = i % 2 === 0 ? 1 : -1;
      const angle = (i / nodeCount) * Math.PI * 4; // Two complete turns
      const radius = 2.2;
      
      const x = Math.sin(angle) * radius * strand;
      const y = ((i / nodeCount) - 0.5) * 5.5; // Spread vertically
      const z = Math.cos(angle) * radius * strand;

      const basePos = new THREE.Vector3(x, y, z);

      list.push({
        pos: basePos.clone(),
        basePos: basePos,
        speed: Math.random() * 0.5 + 0.3,
        phase: angle
      });
    }
    return list;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Constant slow rotation of the soundwave helix
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15;
      groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.05;
    }

    // Animate audio expansion and contraction (visualizer simulation)
    nodes.forEach((node, index) => {
      // Pulsing scale factor based on time and vertical position (phase)
      const pulseSpeed = 2.5;
      const waveOffset = Math.sin(time * pulseSpeed + node.phase) * 0.25;
      const currentRadiusMultiplier = 1.0 + waveOffset;

      const currentPos = new THREE.Vector3(
        node.basePos.x * currentRadiusMultiplier,
        node.basePos.y + Math.cos(time * 0.8 + index) * 0.06, // subtle vertical jitter
        node.basePos.z * currentRadiusMultiplier
      );
      node.currentPos = currentPos;

      if (sphereRefs.current[index]) {
        sphereRefs.current[index].position.copy(currentPos);
      }
    });

    // Rebuild line connections between neighboring helix nodes
    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const p1 = nodes[i].currentPos || nodes[i].pos;
        const p2 = nodes[j].currentPos || nodes[j].pos;
        
        const dist = p1.distanceTo(p2);
        // Connect strands and consecutive helix nodes
        if (dist < 2.5) {
          linePoints.push(p1, p2);
        }
      }
    }

    if (lineRef.current) {
      lineRef.current.geometry.setFromPoints(linePoints);
    }
  });

  return (
    <group position={[0, -50, 0]} ref={groupRef}>
      {/* Helix Wave Nodes */}
      {nodes.map((node, index) => {
        // Alternating strand colors (Coral and Amber)
        const nodeColor = index % 2 === 0 ? "#f79882" : "#ffaa00";
        return (
          <mesh
            key={index}
            ref={(el) => {
              if (el) sphereRefs.current[index] = el;
            }}
            position={node.pos}
          >
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color={nodeColor} />
          </mesh>
        );
      })}

      {/* Dynamic soundwave connection cage */}
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Warm volumetric lighting */}
      <pointLight position={[0, 0, 0]} distance={10} intensity={6} color="#f79882" />
      <pointLight position={[2, -2, -2]} distance={8} intensity={3} color="#ffaa00" />
    </group>
  );
}
