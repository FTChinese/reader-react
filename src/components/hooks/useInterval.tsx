import { useEffect, useRef } from 'react';

export function useInterval(callback: TimerHandler, delay: number | null) {
  const savedCallback = useRef<TimerHandler>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = window.setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay]);
}
