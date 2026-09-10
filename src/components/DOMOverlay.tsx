"use client";

import { motion, useTransform } from "framer-motion";
import { ArrowUpRight, Cpu, Eye, Shield, Zap } from "lucide-react";

interface DOMOverlayProps {
  activeProduct: "camera" | "lens";
  onContactClick: () => void;
  scrollYProgress: any;
}

export default function DOMOverlay({
  activeProduct,
  onContactClick,
  scrollYProgress,
}: DOMOverlayProps) {
  // Section 1: Hero Intro (0% to 15%)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -30]);

  // Section 2: Engineering Reveal (15% to 40%)
  const engOpacity = useTransform(scrollYProgress, [0.15, 0.22, 0.32, 0.38], [0, 1, 1, 0]);
  const engY = useTransform(scrollYProgress, [0.15, 0.22, 0.32, 0.38], [30, 0, 0, -30]);

  // Section 3: Sensor & Intelligent Processing (40% to 65%)
  const sensorOpacity = useTransform(scrollYProgress, [0.38, 0.45, 0.58, 0.65], [0, 1, 1, 0]);
  const sensorY = useTransform(scrollYProgress, [0.38, 0.45, 0.58, 0.65], [30, 0, 0, -30]);

  // Section 4: Optics & Detail (65% to 85%)
  const opticsOpacity = useTransform(scrollYProgress, [0.65, 0.72, 0.80, 0.85], [0, 1, 1, 0]);
  const opticsY = useTransform(scrollYProgress, [0.65, 0.72, 0.80, 0.85], [30, 0, 0, -30]);

  // Section 5: Reassembly CTA (85% to 100%)
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.92, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.92], [40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* 1. HERO SECTION (0% - 15%) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "0.5rem 1.2rem",
              borderRadius: "100px",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#00D6FF",
              marginBottom: "2rem",
              textShadow: "0 0 10px rgba(0, 214, 255, 0.2)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#00D6FF",
                boxShadow: "0 0 8px #00D6FF",
              }}
            />
            {activeProduct === "camera" ? "Cine Division" : "Optics Lab"}
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              margin: "0 auto 1.5rem",
              background: "linear-gradient(to bottom, #ffffff 40%, rgba(255, 255, 255, 0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {activeProduct === "camera" ? "Sony Cine FX6" : "Sony G-Master 50"}
          </h1>

          <p
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
              fontWeight: 300,
              color: "rgba(255, 255, 255, 0.65)",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.4,
            }}
          >
            {activeProduct === "camera"
              ? "Silence, perfected. Hear only what matters."
              : "Optics, redefined. Details from another dimension."}
          </p>

          <p
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              color: "rgba(255, 255, 255, 0.4)",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {activeProduct === "camera"
              ? "Flagship full-frame cinematography, re‑engineered for a world that never stops."
              : "Ultimate glass elements, crafted for infinite detail and cinematic depth."}
          </p>
        </motion.div>
      </div>

      {/* 2. ENGINEERING REVEAL (15% - 40%) */}
      <div
        style={{
          position: "absolute",
          top: "100vh",
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 10vw",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          style={{
            opacity: engOpacity,
            y: engY,
            maxWidth: "460px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              color: "#00D6FF",
              marginBottom: "1.2rem",
            }}
          >
            <Cpu size={20} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Structural Chassis
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Precision-engineered for clarity.
          </h2>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "1.5rem",
            }}
          >
            {activeProduct === "camera"
              ? "A modular magnesium-alloy core houses the back-illuminated sensor, paired with optimized silent passive heat dispersion for 100% quiet recording environments."
              : "XA (extreme aspherical) lenses positioned with sub-micron accuracy ensure that chromatic aberrations and field distortions fade into absolute nonexistence."}
          </p>
        </motion.div>
      </div>

      {/* 3. SENSOR & INTELLIGENT PROCESSING (40% - 65%) */}
      <div
        style={{
          position: "absolute",
          top: "200vh",
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 10vw",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          style={{
            opacity: sensorOpacity,
            y: sensorY,
            maxWidth: "480px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              color: "#0050FF",
              marginBottom: "1.2rem",
            }}
          >
            <Shield size={20} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Processing Core
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Adaptive control, redefined.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D6FF", marginTop: "0.6rem" }} />
              <p style={{ fontSize: "0.95rem", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.5 }}>
                {activeProduct === "camera"
                  ? "Real-time AI processor tracks subjects instantly, adjusting exposure levels dynamically."
                  : "Double XD Linear Motors drive massive elements smoothly, yielding locked, zero-vibration focus."}
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D6FF", marginTop: "0.6rem" }} />
              <p style={{ fontSize: "0.95rem", color: "rgba(255, 255, 255, 0.65)", lineHeight: 1.5 }}>
                {activeProduct === "camera"
                  ? "Dual-engine BIONZ XR delivers 120fps readouts, keeping your footage artifact-free."
                  : "Perfect optical alignment reduces physical lens breathing for professional cinematic shots."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. OPTICS & DETAIL (65% - 85%) */}
      <div
        style={{
          position: "absolute",
          top: "300vh",
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 10vw",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          style={{
            opacity: opticsOpacity,
            y: opticsY,
            maxWidth: "460px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              color: "#00D6FF",
              marginBottom: "1.2rem",
            }}
          >
            <Eye size={20} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Visual Engineering
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Immersive, lifelike detail.
          </h2>

          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "1.5rem",
            }}
          >
            {activeProduct === "camera"
              ? "High-performance full-frame design unlocks 15+ stops of dynamic range, delivering rich textures, spatial presence, and pure colors even in absolute darkness."
              : "Nano AR Coating II suppresses surface reflections, flare, and ghosting. Feel the depth, spatial clarity, and legendary circular bokeh with zero compromises."}
          </p>
        </motion.div>
      </div>

      {/* 5. REASSEMBLY & CTA (85% - 100%) */}
      <div
        style={{
          position: "absolute",
          top: "400vh",
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          style={{
            opacity: ctaOpacity,
            y: ctaY,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2.2rem, 7vw, 5rem)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              background: "linear-gradient(to bottom, #ffffff 40%, rgba(255, 255, 255, 0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Capture everything.
            <br />
            <span style={{ color: "#00D6FF", textShadow: "0 0 20px rgba(0, 214, 255, 0.15)" }}>
              Feel nothing else.
            </span>
          </h2>

          <p
            style={{
              fontSize: "1.15rem",
              color: "rgba(255, 255, 255, 0.6)",
              maxWidth: "550px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.5,
            }}
          >
            {activeProduct === "camera"
              ? "Sony WH-Cine Series. Designed for deep creative focus, crafted for absolute comfort."
              : "FE 50mm F1.2 G-Master. Incredible resolution, lightweight chassis, infinite expression."}
          </p>

          <div
            className="pointer-events-auto"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <button
              onClick={onContactClick}
              className="hover-target"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.8rem",
                padding: "1rem 2.2rem",
                borderRadius: "100px",
                border: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "linear-gradient(135deg, #0050FF 0%, #00D6FF 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 30px rgba(0, 80, 255, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 80, 255, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 80, 255, 0.3)";
              }}
            >
              Experience Cine <Zap size={16} fill="currentColor" />
            </button>

            <a
              href="#specs"
              className="hover-target"
              onClick={(e) => {
                e.preventDefault();
                onContactClick();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "rgba(255, 255, 255, 0.7)",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
              }}
            >
              See full specs <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
