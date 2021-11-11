import styles from './GlobalSpinner.module.css'

export function GlobalSpinner() {
  return (
    <div className={`spinner-border ${styles.globalSpinner}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
