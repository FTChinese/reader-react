import { Link } from 'react-router-dom';
import { Tier } from '../../data/enum';
import { localizeTier } from '../../data/localization';
import { sitemap } from '../../data/sitemap';

export function CheckoutHeader(
  props: {
    tier: Tier;
  }
) {
  return (
    <h2 className="text-center mb-3">
      订阅{localizeTier(props.tier)}
    </h2>
  );
}

export function CheckoutMessage(
  props: {
    text: string;
  }
) {
  return (
    <p className="scale-down8 text-center">
      {props.text}
    </p>
  );
}

export function StripePayLink() {
  return (
    <small className="text-muted">
      * <a href="https://stripe.com/" target="_blank">Stripe</a>支付以英镑计价，需使用支持国际货币的信用卡，到期自动续订
    </small>
  );
}

export function PaySuccessLink() {
  return (
    <div className="text-center">
      <Link to={sitemap.membership}>完成</Link>
    </div>
  );
}
