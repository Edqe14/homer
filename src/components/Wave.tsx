import { useState, useEffect } from 'react';
import Wave from 'react-wavify';

interface Props {
  orientation?: 'top' | 'bottom';
}

const Waves = ({ orientation = 'top' }: Props) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section
      className={[
        'fixed left-0 right-0 h-10 mix-blend-screen transition-all duration-700 ease-[cubic-bezier(0.33,_1,_0.68,_1)]',
        orientation === 'top' ? 'top-0 -scale-y-100' : 'bottom-0',
        !loaded && 'opacity-0 translate-y-full',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Wave
        fill="#f79902"
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
        fill="#e22522"
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
        fill="#6be222"
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
