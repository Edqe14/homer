import { useState, useEffect, useMemo } from 'react';
import Wave from 'react-wavify';

interface Props {
  orientation?: 'top' | 'bottom';
}

const COLORS = [
  ['#8B24F2', '#8B24F2', '#F224D6'],
  ['#F79902', '#E22522', '#6BE222'],
  ['#F2672B', '#F22BCD', '#2B7BF2'],
  ['#ff006e', '#3a86ff', '#80ed99'],
] as const;

const Waves = ({ orientation = 'top' }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [colorA, colorB, colorC] = useMemo(
    () => COLORS[Math.floor(Math.random() * COLORS.length)],
    []
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section
      className={[
        'fixed left-0 right-0 h-10 mix-blend-screen transition-all duration-1000 ease-[cubic-bezier(0.33,_1,_0.68,_1)] opacity-80',
        orientation === 'top' ? 'top-0 -scale-y-100' : 'bottom-0',
        !loaded && 'blur-md opacity-0 translate-y-full',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Wave
        fill={colorA}
        className={[
          'absolute w-full h-full',
          orientation === 'top' ? 'top-0' : 'bottom-0',
        ]
          .filter(Boolean)
          .join(' ')}
        options={{
          amplitude: 20,
          speed: 0.15,
          points: 4,
        }}
      />

      <Wave
        fill={colorB}
        className={[
          'absolute w-full h-full',
          orientation === 'top' ? 'top-0' : 'bottom-0',
        ]
          .filter(Boolean)
          .join(' ')}
        options={{
          amplitude: 25,
          speed: 0.25,
          points: 4,
        }}
      />

      <Wave
        fill={colorC}
        className={[
          'absolute w-full mix-blend-color-dodge h-full',
          orientation === 'top' ? 'top-0' : 'bottom-0',
        ]
          .filter(Boolean)
          .join(' ')}
        options={{
          amplitude: 20,
          speed: 0.2,
          points: 3,
        }}
      />
    </section>
  );
};

export default Waves;
