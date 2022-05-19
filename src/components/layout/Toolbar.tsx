import { Link } from 'react-router-dom';
import { getDisplayName } from '../../data/account';
import { useAuth } from '../hooks/useAuth';
import { Logout } from './Logout';

export function Toolbar() {

  const { passport } = useAuth();

  return (
    <div className="container-fluid d-flex justify-content-between align-items-center ftc-toolbar">
      <div className="d-flex align-items-end ftc-brand">
        <a href="https://www.ftchinese.com" target="_blank" rel="noreferrer"
          className="ftc-logo me-2"
        >
          <img src="https://www.ftacademy.cn/images/logo/brand-ftc-masthead.svg" />
        </a>
        <Link to="/">我的FT</Link>
      </div>

      {
        passport &&
        <div className="d-flex align-items-center">
          <span className="border-end pe-3">
            {getDisplayName(passport)}
          </span>

          <Logout/>
        </div>
      }
    </div>
  );
}
