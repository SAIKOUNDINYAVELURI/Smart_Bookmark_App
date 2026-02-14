"use client";

import { useEffect, useRef } from "react";

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let effect: any;

    const initVanta = async () => {
      const THREE = await import("three");
      const HALO = (await import("vanta/dist/vanta.halo.min")).default;

      if (vantaRef.current) {
        effect = HALO({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          baseColor: 0x6366f1,
          backgroundColor: 0x0b1120,
          amplitudeFactor: 1.2,
          size: 1.2,
          xOffset: 0.2,
        });
      }
    };

    initVanta();

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return <div ref={vantaRef} className="fixed inset-0 -z-20" />;
}
