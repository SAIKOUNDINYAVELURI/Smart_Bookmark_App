/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vanta/dist/vanta.halo.min' {
  interface HALOOptions {
    el: HTMLElement;
    THREE: any;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    baseColor?: number;
    backgroundColor?: number;
    amplitudeFactor?: number;
    size?: number;
    xOffset?: number;
  }

  function HALO(options: HALOOptions): {
    destroy: () => void;
  };

  export default HALO;
}
