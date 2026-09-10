import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

export const WaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#00f0ff"), // Cyan
    uSize: 20.0,
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uSize;
    varying float vElevation;
    varying vec3 vPosition;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Organic waving motion using multiple wave patterns
      float elevation = sin(modelPosition.x * 0.2 + uTime * 1.3) * 0.6
                      + cos(modelPosition.z * 0.15 + uTime * 0.9) * 0.6;
      
      modelPosition.y += elevation;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;

      // Size attenuation: particles look smaller as they recede
      gl_PointSize = uSize * (300.0 / -viewPosition.z);
      
      vElevation = elevation;
      vPosition = modelPosition.xyz;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    varying float vElevation;
    varying vec3 vPosition;

    void main() {
      // Shape circular particles with soft falloff
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      
      float alpha = 1.0 - (dist * 2.0);
      alpha = pow(alpha, 1.5);
      
      // Dynamic color interpolation between cyan and purple based on elevation height
      vec3 colorPurple = vec3(0.44, 0.0, 1.0); // #7000ff
      vec3 finalColor = mix(colorPurple, uColor, (vElevation + 1.2) / 2.4);
      
      gl_FragColor = vec4(finalColor, alpha * 0.8);
    }
  `
);
