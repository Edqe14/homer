import { useEffect, useState } from 'react';
import { Countdown } from 'react-daisyui';
import Configuration from '../config';

const Clock = ({ className }: { className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [hour, setHour] = useState(
    new Date().getHours() -
      (Configuration.get('clock.format') === '12' && new Date().getHours() > 12
        ? 12
        : 0)
  );
  const [minute, setMinute] = useState(new Date().getMinutes());
  const [second, setSecond] = useState(new Date().getSeconds());
  const [ampm, setAmpm] = useState(new Date().getHours() >= 12 ? 'PM' : 'AM');

  useEffect(() => {
    setLoaded(true);

    let timeout: NodeJS.Timeout | null = null;

    const update = () => {
      const date = new Date();

      let h = date.getHours();
      const m = date.getMinutes();
      const s = date.getSeconds();
      const state = h >= 12 ? 'PM' : 'AM';

      if (Configuration.get('clock.format') === '12' && h > 12) {
        h -= 12;
      }

      setHour(h);
      setMinute(m);
      setSecond(s);
      setAmpm(state);

      timeout = setTimeout(() => update(), 1_000);
    };

    update();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <section
      className={[
        'transition-opacity duration-200 ease-in-out',
        !loaded && 'opacity-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h1 className="text-4xl font-bold font-jetbrains text-center">
        <Countdown value={hour} />
        :
        <Countdown value={minute} />
        {Configuration.get('clock.showSeconds') && (
          <>
            :
            <Countdown value={second} />
          </>
        )}{' '}
        {Configuration.get('clock.format') === '12' && ampm}
        {/* {`${[
          hour.toString().padStart(2, '0'),
          minute.toString().padStart(2, '0'),
          Configuration.get('clock.showSeconds') &&
            second.toString().padStart(2, '0'),
        ]
          .filter(Boolean)
          .join(':')} ${
          Configuration.get('clock.format') === '12' ? ampm : ''
        }`.trim()} */}
      </h1>
    </section>
  );
};

export default Clock;
