"use client";

import React from 'react';
import './LightRays.css';

const LightRays: React.FC = () => {
  return (
    <div className="light-rays-container">
      <svg className="light-rays-svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <filter id="volumetric-blur">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          
          <linearGradient id="ray-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.28)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="60%" stopColor="rgba(255, 255, 255, 0.04)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          <linearGradient id="ray-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.22)" />
            <stop offset="45%" stopColor="rgba(255, 255, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* Primary soft ray */}
        <polygon 
          points="-100,-100 150,-100 800,1000 100,1000" 
          fill="url(#ray-grad-1)" 
          filter="url(#volumetric-blur)" 
          className="ray-shaft ray-1"
        />

        {/* Secondary softer ray */}
        <polygon 
          points="-100,-100 300,-100 1200,1000 600,1000" 
          fill="url(#ray-grad-2)" 
          filter="url(#volumetric-blur)" 
          className="ray-shaft ray-2"
        />
      </svg>
    </div>
  );
};

export default LightRays;
