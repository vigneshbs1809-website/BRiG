"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";

interface ImageSequenceCanvasProps {
  activeProduct: "camera" | "lens";
  setActiveProduct: (product: "camera" | "lens") => void;
  onLoadComplete: (loaded: boolean) => void;
  scrollYProgress: any; // passed down or handled internally
}

export default function ImageSequenceCanvas({
  activeProduct,
  setActiveProduct,
  onLoadComplete,
  scrollYProgress
}: ImageSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const currentProductRef = useRef<"camera" | "lens">(activeProduct);

  const totalFrames = activeProduct === "camera" ? 221 : 184;
  const folderName = activeProduct;

  // Track activeProduct in ref to avoid closure issues during load
  useEffect(() => {
    currentProductRef.current = activeProduct;
  }, [activeProduct]);

  // Preload Images
  useEffect(() => {
    setIsPreloaded(false);
    onLoadComplete(false);
    setLoadProgress(0);

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / totalFrames) * 100);
      setLoadProgress(percent);

      if (loadedCount === totalFrames) {
        setImages(loadedImages);
        setIsPreloaded(true);
        onLoadComplete(true);
      }
    };

    const handleImageError = () => {
      console.error("Failed to load frame");
      // Still increment to not block loading state completely
      handleImageLoad();
    };

    // Trigger loads
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/assets/${folderName}/ezgif-frame-${frameNum}.jpg`;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      loadedImages.push(img);
    }

    return () => {
      // Clean up loaders
      loadedImages.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [activeProduct, totalFrames, folderName, onLoadComplete]);

  // Map scroll progress to frame index
  // We use useTransform to get the active frame index (clamped [0, totalFrames - 1])
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Render function for drawing image to Canvas
  const drawImage = (img: HTMLImageElement) => {
    if (!canvasRef.current || !img) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas instead of solid fill to allow background image to show through
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgWidth = img.width;
    const imgHeight = img.height;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let x = 0;
    let y = 0;

    // CONTAIN aspect ratio scaling so the full camera/lens fits in the viewport
    if (canvasRatio > imgRatio) {
      drawHeight = canvasHeight * 0.85; // slightly scaled down to allow breathing room
      drawWidth = drawHeight * imgRatio;
      x = (canvasWidth - drawWidth) / 2;
      y = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasWidth * 0.85;
      drawHeight = drawWidth / imgRatio;
      x = (canvasWidth - drawWidth) / 2;
      y = (canvasHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  // Re-draw when frameIndex or images change
  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!isPreloaded || images.length === 0) return;
    const currentFrame = Math.round(latest);
    const img = images[currentFrame];
    if (img && img.complete) {
      drawImage(img);
    }
  });

  // Handle Resize and initial render
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      // Render the current frame
      if (isPreloaded && images.length > 0) {
        const currentFrame = Math.round(frameIndex.get());
        const img = images[currentFrame];
        if (img) drawImage(img);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, [isPreloaded, images, activeProduct]);

  // Force draw when preloading finishes
  useEffect(() => {
    if (isPreloaded && images.length > 0) {
      const currentFrame = Math.round(frameIndex.get());
      const img = images[currentFrame] || images[0];
      if (img) drawImage(img);
    }
  }, [isPreloaded, images]);

  // Update body styles for seamless background transition
  useEffect(() => {
    const themeColor = activeProduct === "camera" ? "#050409" : "#060608";
    document.body.style.backgroundColor = themeColor;
    document.documentElement.style.backgroundColor = themeColor;
  }, [activeProduct]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 2,
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
        }}
      />

      {/* Subtle background desaturated radial light glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: activeProduct === "camera"
            ? "radial-gradient(circle at 50% 50%, rgba(0, 80, 255, 0.05) 0%, transparent 65%)"
            : "radial-gradient(circle at 50% 50%, rgba(0, 214, 255, 0.05) 0%, transparent 65%)",
          pointerEvents: "none",
          transition: "background 0.8s ease",
          mixBlendMode: "screen",
        }}
      />

      {/* Product Selection Tab Overlay */}
      <div
        className="pointer-events-auto"
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          gap: "0.5rem",
          padding: "0.4rem",
          borderRadius: "100px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => setActiveProduct("camera")}
          className="hover-target"
          style={{
            padding: "0.6rem 1.6rem",
            borderRadius: "100px",
            border: "none",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            background: activeProduct === "camera" ? "rgba(255, 255, 255, 0.08)" : "transparent",
            color: activeProduct === "camera" ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
            borderRight: activeProduct === "camera" ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Cine Camera
        </button>
        <button
          onClick={() => setActiveProduct("lens")}
          className="hover-target"
          style={{
            padding: "0.6rem 1.6rem",
            borderRadius: "100px",
            border: "none",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            background: activeProduct === "lens" ? "rgba(255, 255, 255, 0.08)" : "transparent",
            color: activeProduct === "lens" ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          G-Master Lens
        </button>
      </div>

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
              background: activeProduct === "camera" ? "#050409" : "#060608",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
            }}
          >
            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Spinning desaturated ring */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "2px solid rgba(255, 255, 255, 0.05)",
                  borderTopColor: "#00D6FF",
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
                Caching Technical Assets...
              </span>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  color: "#00D6FF",
                  marginTop: "0.5rem",
                  textShadow: "0 0 10px rgba(0, 214, 255, 0.3)",
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
