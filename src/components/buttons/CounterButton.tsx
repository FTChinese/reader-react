import { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import styles from './CounterButton.module.css';

export function CounterButton(
  props: {
    variant: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
    from: number;
    onFinish: () => void;
  }
) {

  const [count, setCount] = useState(props.from);
  const [isRunning, setIsRunnnig] = useState(true);

  useInterval(() => {
    console.log(`Counting ${count}`);
    setCount(count - 1);
    if (count <= 1) {
      setIsRunnnig(false);
      props.onFinish();
    }
  }, isRunning ? 1000 : null);

  return (
    <button className={`btn btn-${props.variant} ${styles.counter}`}
      type="button"
      disabled={true}
    >
      {count}s
    </button>
  );
}
