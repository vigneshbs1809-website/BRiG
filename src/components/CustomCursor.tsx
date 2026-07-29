"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isHidden = true;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (isHidden) {
        cursor.style.opacity = "1";
        dot.style.opacity = "1";
        isHidden = false;
      }
      
      // Move dot instantly
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const updateCursorPosition = () => {
      if (!isHidden) {
        // Smoothly interpolate the outer ring (lerp)
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      requestAnimationFrame(updateCursorPosition);
    };

    // Hide cursor initially or if mouse leaves window
    cursor.style.opacity = "0";
    dot.style.opacity = "0";

    const onMouseLeave = () => {
      cursor.style.opacity = "0";
      dot.style.opacity = "0";
      isHidden = true;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    const animId = requestAnimationFrame(updateCursorPosition);

    // Event delegation to detect hover states dynamically
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest(".hover-target");
        
      if (isInteractive) {
        cursor.classList.add("hovered");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest(".hover-target");
        
      if (isInteractive) {
        cursor.classList.remove("hovered");
      }
    };

    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </>
  );
}
