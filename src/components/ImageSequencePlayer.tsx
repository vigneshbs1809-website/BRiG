"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageSequencePlayerProps {
  fit?: "contain" | "cover";
}

export default function ImageSequencePlayer({ fit = "contain" }: ImageSequencePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  
  const totalFrames = 286;
  const targetFps = 35; // smooth 35fps playback
  const frameInterval = 1000 / targetFps;

  // Preload Images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / totalFrames) * 100);
      setLoadProgress(percent);

      if (loadedCount === totalFrames) {
        setImages(loadedImages);
        setIsPreloaded(true);
      }
    };

    const handleImageError = () => {
      console.error("Failed to load frame");
      handleImageLoad(); // increment count to avoid freezing loader
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/assets/camera/ezgif-frame-${frameNum}.jpg`;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      loadedImages.push(img);
    }

    return () => {
      loadedImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // Animation and Playback Loop
  useEffect(() => {
    if (!isPreloaded || images.length === 0) return;

    let animId: number;
    let currentFrame = 0;
    let lastFrameTime = performance.now();

    const drawFrame = (frameIdx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = images[frameIdx];
      if (!img || !img.complete) return;

      // Clear the canvas to allow the 4K background image underneath to show through
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scale coordinates based on fit prop
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let x = 0;
      let y = 0;

      if (fit === "cover") {
        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgRatio;
          x = 0;
          y = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgRatio;
          x = (canvas.width - drawWidth) / 2;
          y = 0;
        }
      } else {
        // contain with padding
        if (canvasRatio > imgRatio) {
          drawHeight = canvas.height * 0.9;
          drawWidth = drawHeight * imgRatio;
          x = (canvas.width - drawWidth) / 2;
          y = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.width * 0.9;
          drawHeight = drawWidth / imgRatio;
          x = (canvas.width - drawWidth) / 2;
          y = (canvas.height - drawHeight) / 2;
        }
      }

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    };

    const updatePlay = (timestamp: number) => {
      const elapsed = timestamp - lastFrameTime;

      if (elapsed >= frameInterval) {
        // Advance frame
        currentFrame = (currentFrame + 1) % totalFrames;
        drawFrame(currentFrame);
        
        // Adjust lastFrameTime to account for any delay offset
        lastFrameTime = timestamp - (elapsed % frameInterval);
      }

      animId = requestAnimationFrame(updatePlay);
    };

    // Draw initial frame
    drawFrame(0);
    
    // Start animation loop
    animId = requestAnimationFrame(updatePlay);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPreloaded, images, frameInterval]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvas?.parentElement;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          mixBlendMode: "screen",
          maskImage: "radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
          WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
        }}
      />

      {/* Preloading HUD overlay */}
      <AnimatePresence>
        {!isPreloaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
            }}
          >
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "2px solid rgba(255, 255, 255, 0.05)",
                  borderTopColor: "#ffffff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "1.5rem",
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                Loading Cinematic Sequence...
              </span>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  color: "#ffffff",
                  marginTop: "0.5rem",
                }}
              >
                {loadProgress}%
              </span>
            </div>

            <style jsx global>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
