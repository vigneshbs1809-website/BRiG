"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Web Audio API Synthesizer to play cinematic camera booting sound effects
const playSynthesizedSound = (type: 'drone' | 'beep' | 'shutter') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'drone') {
      // Cinematic low frequency rumble/drone
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 3.0);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 3.0);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.6);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 3.0);
    } else if (type === 'beep') {
      // Professional camera setup beep
      const playBeep = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gainNode.gain.setValueAtTime(0.04, start);
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration - 0.005);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      playBeep(1100, ctx.currentTime, 0.04);
      playBeep(1300, ctx.currentTime + 0.08, 0.04);
    } else if (type === 'shutter') {
      // Camera mechanical shutter click + white noise shutter release
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      noise.start(ctx.currentTime);
      
      // Metallic snap (shutter motor blade)
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(180, ctx.currentTime);
      click.frequency.setValueAtTime(380, ctx.currentTime + 0.015);
      clickGain.gain.setValueAtTime(0.4, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(ctx.currentTime);
      click.stop(ctx.currentTime + 0.04);
    }
  } catch (err) {
    console.warn("Audio Context load failed or blocked by browser user gesture policies:", err);
  }
};

export default function Loader({ onComplete }: { onComplete: () => void }) {
  // Steps: 0 (Black), 1 (Red LED / Drone), 2 (Initializing...), 3 (Loading...), 4 (Preparing...), 5 (Logo bloom), 6 (Shutter Flash), 7 (Done)
  const [step, setStep] = useState(0);
  const [showShutterFlash, setShowShutterFlash] = useState(false);

  useEffect(() => {
    // Stage 0 -> 1: Black screen to Red LED and drone sound
    const t0 = setTimeout(() => {
      setStep(1);
      playSynthesizedSound('drone');
    }, 400);

    // Stage 1 -> 2: Thin scan lines sweep + Text 1
    const t1 = setTimeout(() => {
      setStep(2);
    }, 1200);

    // Stage 2 -> 3: Camera beep + Text 2
    const t2 = setTimeout(() => {
      setStep(3);
      playSynthesizedSound('beep');
    }, 2100);

    // Stage 3 -> 4: Text 3
    const t3 = setTimeout(() => {
      setStep(4);
    }, 3000);

    // Stage 4 -> 5: Logo materialization with bloom and particles
    const t4 = setTimeout(() => {
      setStep(5);
    }, 3900);

    // Stage 5 -> 6: Camera shutter click + Screen flash
    const t5 = setTimeout(() => {
      setShowShutterFlash(true);
      playSynthesizedSound('shutter');
    }, 5300);

    // Stage 6 -> 7: Complete and unmount loader
    const t6 = setTimeout(() => {
      onComplete();
    }, 5600);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#0A0A0A", // Luxurious matte black
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Shutter White Flash Overlay */}
      <AnimatePresence>
        {showShutterFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#ffffff",
              zIndex: 100,
            }}
          />
        )}
      </AnimatePresence>

      {/* 1. Pulsing camera status red light (alive / recording check) */}
      {step >= 1 && step < 6 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0.3, 1, 0.3],
            scale: [0.9, 1.1, 0.9],
            boxShadow: ["0 0 10px #ff1d1d", "0 0 25px #ff1d1d", "0 0 10px #ff1d1d"]
          }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "15%",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#ff1d1d",
            zIndex: 10,
          }}
        />
      )}

      {/* 2. Thin laser scan line sweeping from top to bottom */}
      {step >= 2 && step < 5 && (
        <motion.div
          initial={{ top: "-5%" }}
          animate={{ top: "105%" }}
          transition={{ duration: 2.2, ease: "easeInOut", repeat: 1 }}
          style={{
            position: "absolute",
            left: 0,
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #ff1d1d, transparent)",
            boxShadow: "0 0 15px #ff1d1d, 0 0 5px #ff1d1d",
            zIndex: 5,
          }}
        />
      )}

      {/* 3. Cinematic booting terminal text status logs */}
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          height: "80px", 
          zIndex: 8,
          marginBottom: "2rem"
        }}
      >
        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              key="log1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                color: "#ff1d1d",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textShadow: "0 0 8px rgba(255, 29, 29, 0.4)"
              }}
            >
              Initializing Brig Media...
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="log2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                color: "#ff1d1d",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textShadow: "0 0 8px rgba(255, 29, 29, 0.4)"
              }}
            >
              Loading Creative Engine...
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="log3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                color: "#ff1d1d",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textShadow: "0 0 8px rgba(255, 29, 29, 0.4)"
              }}
            >
              Preparing Visual Experience...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Brig Media logo materializing with particles and bloom */}
      {step >= 5 && step < 7 && (
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* Subtle dust particles revolving around the logo */}
          <div style={{ position: "absolute", width: "100%", height: "100%" }}>
            {Array.from({ length: 15 }).map((_, i) => {
              const delay = i * 0.1;
              const angle = (i / 15) * Math.PI * 2;
              const radius = 90 + Math.random() * 40;
              return (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    x: Math.cos(angle) * (radius + 50), 
                    y: Math.sin(angle) * (radius + 50),
                    scale: Math.random() * 0.4 + 0.3
                  }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    x: [Math.cos(angle) * (radius + 30), Math.cos(angle + 0.5) * (radius - 30)],
                    y: [Math.sin(angle) * (radius + 30), Math.sin(angle + 0.5) * (radius - 30)]
                  }}
                  transition={{ 
                    duration: 1.6, 
                    ease: "easeOut", 
                    delay: delay,
                    repeat: Infinity
                  }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: "#ff1d1d",
                    boxShadow: "0 0 8px #ff1d1d",
                  }}
                />
              );
            })}
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              filter: "blur(0px)",
              textShadow: "0 0 30px rgba(255, 29, 29, 0.8)"
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
              fontWeight: 800,
              letterSpacing: "0.06em",
              color: "#ffffff",
              lineHeight: 1,
              textTransform: "uppercase"
            }}
          >
            BRIG MEDIA
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginTop: "1.2rem",
            }}
          >
            Cinematic Creative Division
          </motion.div>
        </div>
      )}

      {/* Ambient background glowing lens aura circles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255, 29, 29, 0.03) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}

