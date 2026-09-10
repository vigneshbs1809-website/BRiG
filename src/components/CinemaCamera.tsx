"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CinemaCameraProps {
  scrollProgress: number; // 0 to 1
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function CinemaCamera({ scrollProgress, position = [0, 0, 0], rotation = [0, 0, 0] }: CinemaCameraProps) {
  const cameraRef = useRef<THREE.Group>(null);
  const lensFocusRingRef = useRef<THREE.Mesh>(null);
  const lensInnerBarrelRef = useRef<THREE.Mesh>(null);
  const topHandleRef = useRef<THREE.Group>(null);
  const monitorHingeRef = useRef<THREE.Group>(null);
  const recLedMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Monitor Canvas Screen Texture State
  const [screenTexture, setScreenTexture] = useState<THREE.CanvasTexture | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize monitor screen canvas
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 160;
    screenCanvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    setScreenTexture(texture);

    return () => {
      texture.dispose();
    };
  }, []);

  // Animate the monitor screen canvas contents (REC blinking, timecodes, battery)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const canvas = screenCanvasRef.current;
    const texture = screenTexture;

    if (canvas && texture) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear background to dark viewfinder gray
        ctx.fillStyle = "#101012";
        ctx.fillRect(0, 0, 256, 160);

        // Grid overlay
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        // Verticals
        ctx.beginPath(); ctx.moveTo(85, 0); ctx.lineTo(85, 160); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(170, 0); ctx.lineTo(170, 160); ctx.stroke();
        // Horizontals
        ctx.beginPath(); ctx.moveTo(0, 53); ctx.lineTo(256, 53); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 106); ctx.lineTo(256, 106); ctx.stroke();

        // Viewfinder Safe Area box
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.strokeRect(16, 10, 224, 140);

        // Blinking Red REC light and text
        const isBlinkingOn = Math.floor(time * 2) % 2 === 0;
        if (isBlinkingOn && scrollProgress > 0 && scrollProgress < 0.98) {
          ctx.fillStyle = "#ff1d1d";
          ctx.beginPath();
          ctx.arc(32, 24, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px Outfit, sans-serif";
        ctx.fillText(scrollProgress >= 0.98 ? "STDBY" : "REC", 44, 27);

        // Timecode animation (Hours:Minutes:Seconds:Frames)
        const totalFrames = Math.floor(time * 24);
        const frames = (totalFrames % 24).toString().padStart(2, "0");
        const secs = (Math.floor(time) % 60).toString().padStart(2, "0");
        const mins = (Math.floor(time / 60) % 60).toString().padStart(2, "0");
        const hrs = (Math.floor(time / 3600) % 24).toString().padStart(2, "0");
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px monospace";
        ctx.fillText(`${hrs}:${mins}:${secs}:${frames}`, 154, 27);

        // Bottom stats: ISO, Aperture, Battery
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = "bold 8px Outfit, sans-serif";
        ctx.fillText("ISO 800", 24, 142);
        ctx.fillText("24fps", 74, 142);
        ctx.fillText("T2.8", 114, 142);
        ctx.fillText("4K DCI", 148, 142);

        // Battery percentage
        const batVal = Math.max(12, Math.floor(98 - scrollProgress * 15));
        ctx.fillStyle = batVal < 20 ? "#ff1d1d" : "#00ff66";
        ctx.fillText(`BAT ${batVal}%`, 204, 142);

        // Simple Audio Level indicators pulsing
        ctx.fillStyle = "#00ff66";
        const l1 = Math.abs(Math.sin(time * 3)) * 40 + 5;
        const l2 = Math.abs(Math.cos(time * 2.5)) * 40 + 5;
        ctx.fillRect(230, 60, 4, -l1);
        ctx.fillRect(236, 60, 4, -l2);

        // Render focus distance
        ctx.fillStyle = "#ffaa00";
        const distVal = (3.5 + Math.sin(time * 0.5) * 1.5).toFixed(1);
        ctx.fillText(`FOC ${distVal}m`, 204, 27);

        texture.needsUpdate = true;
      }
    }
  });

  // Animate physical camera body (breathing, lens movement, blinks, scroll clamp shifts)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cameraGroup = cameraRef.current;

    if (!cameraGroup) return;

    // 1. Idle animation (breathing)
    // Breathing decreases when docked (at scroll = 0 or scroll = 1)
    const isDocked = scrollProgress <= 0.01 || scrollProgress >= 0.99;
    const breatheFactor = isDocked ? 0.05 : 1.0;
    
    // Slow vertical drift (breathing)
    cameraGroup.position.y += Math.sin(time * 1.2) * 0.003 * breatheFactor;
    // Tiny rotational sway (handheld/float feel)
    cameraGroup.rotation.z = Math.sin(time * 0.8) * 0.008 * breatheFactor;
    cameraGroup.rotation.y = Math.cos(time * 0.6) * 0.006 * breatheFactor;

    // 2. Rotating Lens focus ring (focus puller simulation)
    if (lensFocusRingRef.current) {
      lensFocusRingRef.current.rotation.y = time * 0.06 + Math.sin(time * 0.4) * 0.15;
    }

    // 3. Lens focal breathing (lens barrel slides back/forth along Z)
    if (lensInnerBarrelRef.current) {
      lensInnerBarrelRef.current.position.z = 1.05 + Math.sin(time * 1.5) * 0.04 * breatheFactor;
    }

    // 4. Blinking hardware Record LED on the front (synced with screen indicator)
    if (recLedMatRef.current) {
      const isBlinkingOn = Math.floor(time * 2) % 2 === 0;
      const shouldBlink = scrollProgress > 0.01 && scrollProgress < 0.99;
      recLedMatRef.current.emissiveIntensity = (shouldBlink && isBlinkingOn) ? 2.5 : 0.0;
    }

    // 5. Monitor fold-out animation based on scroll progress
    if (monitorHingeRef.current) {
      // Screen unfolds at scroll start, folds in close to scroll end
      let targetRotY = -Math.PI / 2.2; // fully open angle (~80 deg)
      if (scrollProgress < 0.08) {
        // Closed/partially open at start
        targetRotY = THREE.MathUtils.lerp(0, -Math.PI / 2.2, scrollProgress / 0.08);
      } else if (scrollProgress > 0.92) {
        // Folds back in towards contact docking
        targetRotY = THREE.MathUtils.lerp(-Math.PI / 2.2, 0, (scrollProgress - 0.92) / 0.08);
      }
      monitorHingeRef.current.rotation.y = THREE.MathUtils.lerp(
        monitorHingeRef.current.rotation.y, 
        targetRotY, 
        0.1
      );
    }
  });

  // Materials system cached
  const materials = useMemo(() => {
    return {
      matteBlack: new THREE.MeshStandardMaterial({
        color: "#0a0a0c",
        roughness: 0.55,
        metalness: 0.25,
      }),
      brushedMetal: new THREE.MeshStandardMaterial({
        color: "#18181c",
        roughness: 0.22,
        metalness: 0.92,
      }),
      carbon: new THREE.MeshStandardMaterial({
        color: "#070708",
        roughness: 0.7,
        metalness: 0.1,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: "#d0d0d5",
        roughness: 0.1,
        metalness: 0.98,
      }),
      redAccent: new THREE.MeshStandardMaterial({
        color: "#990000",
        roughness: 0.35,
        metalness: 0.8,
      }),
      redLed: new THREE.MeshStandardMaterial({
        color: "#ff0000",
        emissive: "#ff0000",
        emissiveIntensity: 2.0,
      }),
      lensGlass: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 1.0,
        transmission: 0.94,
        ior: 1.62,
        roughness: 0.02,
        thickness: 0.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
        attenuationColor: "#00f0ff",
        attenuationDistance: 0.5,
      }),
    };
  }, []);

  return (
    <group ref={cameraRef} position={position} rotation={rotation} scale={0.75}>
      {/* CAMERA RIG GROUP */}
      <group position={[0, 0, -0.4]}>
        
        {/* 1. Base Plate & Rigging Rails (15mm Rods) */}
        <group position={[0, -0.7, 0]}>
          {/* Rails Holder Bracket */}
          <mesh material={materials.brushedMetal}>
            <boxGeometry args={[0.9, 0.25, 1.2]} />
          </mesh>
          
          {/* Left Rail (Chrome Rod) */}
          <mesh position={[-0.32, -0.15, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 2.6, 12]} />
            <primitive object={materials.chrome} attach="material" />
          </mesh>
          
          {/* Right Rail (Chrome Rod) */}
          <mesh position={[0.32, -0.15, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 2.6, 12]} />
            <primitive object={materials.chrome} attach="material" />
          </mesh>
        </group>

        {/* 2. Main Camera Body (Chassis) */}
        <mesh material={materials.matteBlack} position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.95, 0.95, 1.3]} />
        </mesh>
        
        {/* Carbon Side Plates */}
        <mesh material={materials.carbon} position={[-0.485, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.85, 1.1]} />
        </mesh>
        <mesh material={materials.carbon} position={[0.485, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.85, 1.1]} />
        </mesh>

        {/* Side Cooling Vents */}
        <mesh material={materials.brushedMetal} position={[-0.5, 0.2, 0]}>
          <boxGeometry args={[0.01, 0.25, 0.75]} />
        </mesh>
        <mesh material={materials.brushedMetal} position={[0.5, 0.2, 0]}>
          <boxGeometry args={[0.01, 0.25, 0.75]} />
        </mesh>

        {/* 3. Red PL Lens Mount Collar */}
        <group position={[0, 0, 0.65]}>
          {/* Collar outer ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.redAccent}>
            <cylinderGeometry args={[0.42, 0.42, 0.15, 32]} />
          </mesh>
          {/* Lock knobs */}
          <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]} material={materials.redAccent}>
            <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          </mesh>
          <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0]} material={materials.redAccent}>
            <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          </mesh>
        </group>

        {/* 4. Multi-Stage Cinema Lens Barrel */}
        <group position={[0, 0, 0.72]}>
          
          {/* Stage 1: Lens Base Cylinder */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.matteBlack}>
            <cylinderGeometry args={[0.36, 0.36, 0.4, 32]} />
          </mesh>

          {/* Stage 2: Ribbed Focus Ring (rotates in useFrame) */}
          <mesh ref={lensFocusRingRef} position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]} material={materials.brushedMetal}>
            <cylinderGeometry args={[0.38, 0.38, 0.2, 48]} />
          </mesh>

          {/* Focus Ring Rib details (simulated with a wireframe torus) */}
          <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.385, 0.385, 0.19, 48, 1, true]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
          </mesh>

          {/* Stage 3: Lens Inner sliding barrel (moves in useFrame) */}
          <mesh ref={lensInnerBarrelRef} position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]} material={materials.matteBlack}>
            <cylinderGeometry args={[0.34, 0.36, 0.6, 32]} />
          </mesh>

          {/* Stage 4: Lens Front elements and glass optics */}
          <group position={[0, 0, 1.35]}>
            {/* Front outer thread bezel */}
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.brushedMetal}>
              <cylinderGeometry args={[0.42, 0.39, 0.12, 32]} />
            </mesh>

            {/* Front Curved Glass Lens Optic */}
            <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={materials.lensGlass}>
              <sphereGeometry args={[0.37, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            </mesh>
            
            {/* Interior lens reflection shader/mesh */}
            <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.32, 0.32, 0.02, 24]} />
              <meshPhysicalMaterial 
                color="#002244" 
                emissive="#00f0ff" 
                emissiveIntensity={0.25}
                roughness={0.01} 
                metalness={0.8}
              />
            </mesh>
          </group>
        </group>

        {/* 5. Top Handle Grip Rig */}
        <group ref={topHandleRef} position={[0, 0.48, 0]}>
          {/* Vertical mount column */}
          <mesh material={materials.brushedMetal} position={[0, 0.18, 0.25]}>
            <boxGeometry args={[0.18, 0.4, 0.18]} />
          </mesh>
          {/* Main grip bar */}
          <mesh material={materials.matteBlack} position={[0, 0.38, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 1.0, 16]} />
          </mesh>
          {/* Grip ribbed metallic collars */}
          <mesh material={materials.chrome} position={[0, 0.38, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          </mesh>
          <mesh material={materials.chrome} position={[0, 0.38, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          </mesh>
        </group>

        {/* 6. Viewfinder LCD Monitor Screen */}
        {/* hinge joint attached to the left side */}
        <group ref={monitorHingeRef} position={[-0.49, 0.25, 0.1]}>
          
          {/* Screen Support Arm */}
          <mesh material={materials.brushedMetal} position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.16, 12]} />
          </mesh>

          {/* LCD Screen Housing */}
          {/* Rotated outwards so the screen faces the viewport camera when folded out */}
          <group position={[-0.16, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            {/* Matte Black Outer Case */}
            <mesh material={materials.matteBlack} castShadow>
              <boxGeometry args={[0.9, 0.6, 0.05]} />
            </mesh>
            {/* Brushed Metal Back Cover with circular branding logo */}
            <mesh material={materials.brushedMetal} position={[0, 0, -0.026]}>
              <boxGeometry args={[0.88, 0.58, 0.005]} />
            </mesh>
            <mesh material={materials.redAccent} position={[0, 0, -0.0275]}>
              <sphereGeometry args={[0.08, 16, 16]} />
            </mesh>

            {/* Viewfinder Canvas Texture Display Surface */}
            {screenTexture && (
              <mesh position={[0, 0, 0.026]}>
                <planeGeometry args={[0.84, 0.54]} />
                <meshBasicMaterial map={screenTexture} />
              </mesh>
            )}
          </group>
        </group>

        {/* 7. Hardware LED Details */}
        {/* Blinking REC LED (Front/Top) */}
        <mesh position={[0.3, 0.52, 0.55]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshStandardMaterial ref={recLedMatRef} color="#ff0000" emissive="#ff0000" emissiveIntensity={0} />
        </mesh>
        
        {/* Power LED (Green / Steady at Back) */}
        <mesh position={[-0.35, 0.38, -0.66]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={1.5} />
        </mesh>
      </group>
    </group>
  );
}
