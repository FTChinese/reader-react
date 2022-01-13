import { Link } from 'react-router-dom';
import { getDisplayName } from '../../data/account';
import { useAuthContext } from '../../store/AuthContext';
import styles from  './Toolbar.module.css';

export function Toolbar() {
  const { passport, setLoggedOut } = useAuthContext();

  return (
    <div className={`d-flex justify-content-between ${styles.toolbar}`}>
      <div className={styles.ftcBrand}>
        <a href="https://www.ftchinese.com" target="_blank" rel="noreferrer">FT中文网</a> /
        <Link to="/">我的FT</Link>
      </div>

      {passport &&
        <div className="d-flex align-items-center">
          <span className="border-end pe-3">{getDisplayName(passport)}</span>

          <button
            className="btn btn-link"
            onClick={() => setLoggedOut()}
          >
            Logout
          </button>
        </div>
      }
    </div>
  );
}
