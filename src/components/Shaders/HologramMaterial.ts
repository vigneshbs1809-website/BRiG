import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

export const HologramMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uHover: 0.0, // Ranges from 0.0 (idle) to 1.0 (hovered)
    uColor: new THREE.Color("#00f0ff"), // Cyan neon
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uHover;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Distort geometry slightly on hover
      if (uHover > 0.0) {
        float wave = sin(pos.y * 8.0 + uTime * 4.0) * 0.04 * uHover;
        pos.x += wave;
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uHover;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Organic liquid texture warp when hovered
      if (uHover > 0.0) {
        uv.x += sin(uv.y * 12.0 + uTime * 3.0) * 0.015 * uHover;
        uv.y += cos(uv.x * 12.0 + uTime * 3.0) * 0.015 * uHover;
      }

      // Chromatic Aberration - offset red/blue channels
      float rgbShift = 0.007 + 0.015 * uHover;
      vec4 rTex = texture2D(uTexture, uv - vec2(rgbShift, 0.0));
      vec4 gTex = texture2D(uTexture, uv);
      vec4 bTex = texture2D(uTexture, uv + vec2(rgbShift, 0.0));
      vec4 baseTexture = vec4(rTex.r, gTex.g, bTex.b, gTex.a);
      
      // Moving scanline effect
      float scanlines = sin(vUv.y * 100.0 + uTime * 6.0) * 0.06;
      
      // Blend base image with glowing neon overlay color
      vec3 tintColor = mix(baseTexture.rgb, uColor, 0.35 + 0.15 * uHover);
      
      // Vignette effect to fade edges
      float vignette = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y) * 16.0;
      vignette = pow(vignette, 0.3);
      
      // Glowing neon board edges
      float borderX = smoothstep(0.0, 0.015, uv.x) * (1.0 - smoothstep(0.985, 1.0, uv.x));
      float borderY = smoothstep(0.0, 0.015, uv.y) * (1.0 - smoothstep(0.985, 1.0, uv.y));
      float glowBorder = borderX * borderY;
      
      vec3 finalColor = tintColor + vec3(scanlines) + uColor * (1.0 - glowBorder) * 0.5;
      float finalAlpha = baseTexture.a * vignette * (0.8 + 0.2 * uHover);
      
      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `
);
