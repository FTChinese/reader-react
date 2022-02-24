import { Link } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';

export function LinkPwResetOrSignUp() {
  return (
    <div className="d-flex justify-content-between mt-3">
      <Link to={sitemap.forgotPassword}>忘记密码?</Link>
      <Link to={sitemap.signUp}>新建账号</Link>
    </div>
  );
}
