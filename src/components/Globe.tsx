/* eslint-disable no-param-reassign */
import createGlobe from 'cobe';
import { useEffect, useRef, useState } from 'react';

interface Props {
  width: number;
  height: number;
  className?: string;
}

const Globe = ({ width, height, className }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    setLoaded(true);

    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: height * 2,
      phi: 0,
      theta: 0,
      dark: 0.75,
      opacity: 0.75,
      diffuse: 2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <section className={className}>
      <canvas
        className={[
          'bg-transparent mx-auto transition-opacity duration-1000 ease-in-out',
          !loaded && 'opacity-0',
        ]
          .filter(Boolean)
          .join(' ')}
        ref={canvasRef}
        style={{ width, height, maxWidth: '100%', aspectRatio: 1 }}
      />
    </section>
  );
};

export default Globe;
