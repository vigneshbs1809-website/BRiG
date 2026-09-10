import { useEffect, useRef } from "react";

export interface MouseState {
  x: number;       // Pixel X
  y: number;       // Pixel Y
  nx: number;      // Normalized X (-1 to 1)
  ny: number;      // Normalized Y (-1 to 1)
  targetNx: number;
  targetNy: number;
}

export function useMouse() {
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    nx: 0,
    ny: 0,
    targetNx: 0,
    targetNy: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const state = mouseRef.current;
      state.x = e.clientX;
      state.y = e.clientY;
      state.targetNx = (e.clientX / window.innerWidth) * 2 - 1;
      state.targetNy = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Smoothly interpolate normalized coordinates in a simple animation loop or inside R3F useFrame
    const updateNormalCoordinates = () => {
      const state = mouseRef.current;
      state.nx += (state.targetNx - state.nx) * 0.1;
      state.ny += (state.targetNy - state.ny) * 0.1;
      requestAnimationFrame(updateNormalCoordinates);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const animId = requestAnimationFrame(updateNormalCoordinates);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return mouseRef;
}
