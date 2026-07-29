"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import SceneController from "./SceneController";

function SkySphere() {
  const texture = useTexture("/assets/stars-bg.jpg");
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ camera }) => {
    if (ref.current) {
      // Pin the sky sphere to the camera position so the camera is always at the center
      ref.current.position.copy(camera.position);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[95, 60, 60]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

interface ThreeCanvasProps {
  activeProject: number | null;
  activeService: number | null;
}

export default function ThreeCanvas({ activeProject, activeService }: ThreeCanvasProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        backgroundColor: "#000000",
      }}
    >
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 1.8, 7.5] }}
        gl={{ 
          antialias: true, 
          alpha: false, 
          powerPreference: "high-performance",
        }}
      >
        {/* Set WebGL background color matching site color */}
        <color attach="background" args={["#000000"]} />
        
        {/* Animated Infinite Stars Background SkySphere */}
        <Suspense fallback={null}>
          <SkySphere />
        </Suspense>
        
        {/* Volumetric Fog - critical for soft Awwwards look and camera clipping transitions */}
        <fogExp2 attach="fog" args={["#000000", 0.015]} />

        {/* Core lighting system */}
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[5, 12, 5]} 
          intensity={0.6} 
          color="#ffffff" 
        />
        
        {/* Mount scrolling system (contains camera scroll controller) */}
        <SceneController />
      </Canvas>
    </div>
  );
}

