import { Link } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';

export function PaySuccessLink() {
  return (
    <div className="text-center">
      <Link to={sitemap.membership}>完成</Link>
    </div>
  );
}
