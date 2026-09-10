import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

export const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#7000ff"), // Purple
    uColorEnd: new THREE.Color("#ff007f"),   // Neon Pink
  },
  // Vertex Shader
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;

    // Pseudo-random noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // Shift coordinates to center (-0.5 to 0.5)
      vec2 uvCenter = vUv - vec2(0.5);
      float dist = length(uvCenter);
      
      // Event horizon - discard the black hole core
      if (dist < 0.12) {
        discard;
      }
      
      // Radial angle calculation for swirling
      float angle = atan(uvCenter.y, uvCenter.x);
      
      // Create spiral arms swirling inwards
      float swirl = sin(angle * 4.0 - dist * 25.0 + uTime * 3.5);
      
      // Accretion disk corona brightness curve
      float corona = smoothstep(0.12, 0.35, dist) * (1.0 - smoothstep(0.35, 0.5, dist));
      
      // Multi-layered noise for solar flares
      float n = random(uvCenter * 15.0 + uTime * 0.05);
      
      // Combined gas vortex intensity
      float intensity = corona * (0.55 + 0.45 * swirl) * (0.8 + 0.2 * n);
      
      // Mix start/end neon gradients based on radius and swirl
      vec3 baseColor = mix(uColorStart, uColorEnd, dist * 2.2 + swirl * 0.15);
      
      // Core gas temperature brightness (cyan highlights)
      vec3 glowColor = vec3(0.0, 0.95, 1.0); // Neon cyan
      vec3 finalColor = baseColor + glowColor * pow(intensity, 2.5) * 0.65;
      
      gl_FragColor = vec4(finalColor, intensity * 0.95);
    }
  `
);
