"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // smooth interpolation
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      glow.style.transform = `translate(${currentX}px, ${currentY}px)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    animate();

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#0b1120]">
      {/* Moving Gradient */}
      <div className="absolute inset-0 animate-gradient bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.35),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.35),transparent_40%)]" />

      {/* Mouse Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-40 bg-purple-500"
      />

      {/* Soft Floating Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-3xl rounded-full animate-float1" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-3xl rounded-full animate-float2" />
    </div>
  );
}
