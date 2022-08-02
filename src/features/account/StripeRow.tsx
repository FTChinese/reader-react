import { Link } from 'react-router-dom';
import { ChevronRight } from '../../components/graphics/icons';
import { PrimaryLine, SecondaryLine, TwoLineRow } from '../../components/list/TwoLineRow';
import { TextScaled } from '../../components/text/BodyText';
import { sitemap } from '../../data/sitemap';


export function StripeRow() {
  return (
    <TwoLineRow
      first={<PrimaryLine
        text="管理Stripe支付"
        trailIcon={
          <Link to={sitemap.stripeSetting}>
            <TextScaled size={0.8} text="设置" />
            <ChevronRight />
          </Link>
        }
      />}
      second={<SecondaryLine
        text="查看已有支付方式或添加新的支付方式"
      />}
    />
  );
}
