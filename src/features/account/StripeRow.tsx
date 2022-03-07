import { Link } from 'react-router-dom';
import { ChevronRight } from '../../components/graphics/icons';
import { TwoLineRow } from '../../components/layout/TwoLineRow';
import { sitemap } from '../../data/sitemap';

export function StripeRow() {
  return (
    <TwoLineRow
      primary="管理Stripe支付"
      secondary="查看已有支付方式或添加新的支付方式"
      icon={
        <Link to={sitemap.stripeSetting}>
          <span className="scale-down8">设置</span>
          <ChevronRight />
        </Link>
      }
    />
  );
}
