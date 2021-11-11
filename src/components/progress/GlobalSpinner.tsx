import styles from './GlobalSpinner.module.css'

export function GlobalSpinner() {
  return (
    <div className={styles.globalSpinner}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
