"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HologramMaterial } from "../Shaders/HologramMaterial";

interface Scene4Props {
  activeProject: number | null;
}

export default function Scene4Portfolio({ activeProject }: Scene4Props) {
  const groupRef = useRef<THREE.Group>(null);
  const cardsRef = useRef<THREE.Mesh[]>([]);
  const [textures, setTextures] = useState<THREE.Texture[]>([]);

  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 8;

  // Construct 4 hologram shader materials
  const hologramMaterials = useMemo(() => {
    return Array.from({ length: 4 }).map(() => {
      const mat = new (HologramMaterial as any)();
      mat.uColor = new THREE.Color("#00f0ff");
      mat.transparent = true;
      return mat;
    });
  }, []);

  // Generate cinematic film-reel procedural preview canvas textures
  useEffect(() => {
    const colors = [
      ["#7000ff", "#00f0ff"], // Purple to Cyan
      ["#ff3b30", "#7000ff"], // Coral/Red to Purple
      ["#00f0ff", "#ffaa00"], // Cyan to Amber
      ["#ffaa00", "#ff007f"]  // Amber to Pink
    ];

    const labels = ["LUMINARY", "VELOCE", "AETHER", "CHRONOS"];
    const subtexts = ["CINEMATIC VIDEO", "INTERACTIVE SHOWREEL", "AUDIO SHADER SYNTH", "CGI CAMERA TRACKER"];

    const generated = colors.map((col, i) => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // High-end cinematic color gradient background
        const grad = ctx.createLinearGradient(0, 0, 600, 400);
        grad.addColorStop(0, col[0]);
        grad.addColorStop(1, col[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 400);
        
        // Dark outer film borders
        ctx.fillStyle = "rgba(3, 3, 5, 0.9)";
        ctx.fillRect(0, 0, 600, 30); // Top strip border
        ctx.fillRect(0, 370, 600, 30); // Bottom strip border

        // Film strip sprocket holes (top and bottom)
        ctx.fillStyle = "#120f17";
        for (let x = 12; x < 600; x += 32) {
          ctx.fillRect(x, 8, 12, 14); // Top sprockets
          ctx.fillRect(x, 378, 12, 14); // Bottom sprockets
        }

        // Camera viewfinder grid lines (16:9 aspect box)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.strokeRect(35, 35, 530, 330);

        // Focal centering crosshair
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(290, 200); ctx.lineTo(310, 200); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(300, 190); ctx.lineTo(300, 210); ctx.stroke();

        // Viewfinder corner brackets
        const b = 25;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;
        // Top-left
        ctx.beginPath(); ctx.moveTo(45, 45 + b); ctx.lineTo(45, 45); ctx.lineTo(45 + b, 45); ctx.stroke();
        // Top-right
        ctx.beginPath(); ctx.moveTo(555, 45 + b); ctx.lineTo(555, 45); ctx.lineTo(555 - b, 45); ctx.stroke();
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(45, 355 - b); ctx.lineTo(45, 355); ctx.lineTo(45 + b, 355); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(555, 355 - b); ctx.lineTo(555, 355); ctx.lineTo(555 - b, 355); ctx.stroke();

        // Red Recording indicator (REC)
        ctx.fillStyle = "#ff3b30";
        ctx.beginPath();
        ctx.arc(505, 58, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px Outfit, sans-serif";
        ctx.fillText("REC", 518, 62);

        // Typography: Project title and details
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 32px Outfit, sans-serif";
        ctx.fillText(labels[i], 60, 95);
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.font = "500 13px Outfit, sans-serif";
        ctx.fillText(subtexts[i], 60, 125);

        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.font = "bold 12px Outfit, sans-serif";
        ctx.fillText("BRIGMEDIA LIVE // SYSTEM ACTIVE", 60, 335);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      hologramMaterials[i].uTexture = texture;
      
      return texture;
    });

    setTextures(generated);
  }, [hologramMaterials]);

  // Cylinder coordinates: radius = 5, angles = 0, 90, 180, 270 degrees
  const radius = isMobile ? 3.5 : 5.0;
  const cardAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mx = state.pointer.x;
    
    // Rotate the carousel group smoothly towards the active project angle
    if (groupRef.current) {
      // Each index corresponds to negative offset angle so card rotates to front
      const targetRotationY = activeProject !== null ? -activeProject * (Math.PI / 2) : 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.08);
      groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.03; // Gentle wobble
    }

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      
      const mat = hologramMaterials[index];
      const isHovered = activeProject === index;

      // Update hologram shaders
      if (mat) {
        mat.uTime = time;
        mat.uHover = THREE.MathUtils.lerp(mat.uHover, isHovered ? 1.0 : 0.0, 0.1);
        mat.uColor.copy(new THREE.Color(isHovered ? "#ffaa00" : "#00f0ff"));
      }

      // scale active card
      const baseScale = isMobile ? 1.1 : 1.4;
      const targetScale = isHovered ? baseScale * 1.25 : baseScale;
      card.scale.lerp(new THREE.Vector3(targetScale, targetScale * 0.67, targetScale), 0.1);

      // Local cards parallax sway and vertical float
      const floatY = Math.sin(time * 0.8 + index * 1.8) * 0.05;
      card.position.y = floatY;
      card.rotation.z = floatY * 0.05;
    });
  });

  return (
    <group position={[0, -48, 0]}>
      {/* Cinematic Studio Lights */}
      <pointLight position={[0, 4, 3]} distance={15} intensity={12} color="#ffaa00" />
      <pointLight position={[-4, -3, 3]} distance={15} intensity={8} color="#00f0ff" />

      {/* Cylindrical Carousel Group */}
      <group ref={groupRef}>
        {textures.length > 0 && cardAngles.map((angle, index) => {
          // Position nodes on a circle radius
          const cx = Math.sin(angle) * radius;
          const cz = Math.cos(angle) * radius;
          // Card faces the center of the cylinder (angle + Math.PI)
          const ry = angle;

          return (
            <mesh
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              position={[cx, 0, cz]}
              rotation={[0, ry, 0]}
            >
              <planeGeometry args={[3.2, 2.2]} />
              <primitive object={hologramMaterials[index]} attach="material" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
