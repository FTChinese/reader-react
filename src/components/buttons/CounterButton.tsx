import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/types';
import { useInterval } from '../hooks/useInterval';
import styles from './CounterButton.module.css';

export function CounterButton(
  props: {
    variant: ButtonVariant;
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
    <Button
      variant={props.variant}
      className={styles.counter}
      type="button"
      disabled={true}
    >
      {count}s
    </Button>
  );
}
