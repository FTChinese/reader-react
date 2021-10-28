import { useEffect, useRef } from 'react';

export function useInterval(callback: Function, delay: number | null) {
  const savedCallback = useRef<Function>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);



  useEffect(() => {
    function tick() {
      if (!savedCallback.current) {
        return;
      }
      savedCallback.current();
    }
    if (delay !== null) {
      let id = window.setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay]);
}
