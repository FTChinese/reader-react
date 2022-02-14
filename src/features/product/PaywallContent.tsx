import { ImageRatio } from '../../components/graphics/ImageRatio';
import { ReaderPassport } from '../../data/account';
import { Banner, isPromoValid, Paywall } from '../../data/paywall';

import { ProductCard } from './ProductCard';

export function PaywallContent(
  props: {
    passport: ReaderPassport,
    paywall: Paywall;
  }
) {
  const banner = isPromoValid(props.paywall.promo)
    ? props.paywall.promo
    : props.paywall.banner;

  return (
    <div className="mt-3">
      <PaywallBanner
        banner={banner}
      />
      <div className="mt-3">
        {
          props.paywall.products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              member={props.passport.membership}
            />
          ))
        }
      </div>
    </div>
  );
}

function PaywallBanner(
  props: {
    banner: Banner;
  }
) {
  return (
    <div className="row flex-row-reverse">
      <div className="col-sm-4">
        <ImageRatio
          src={props.banner.coverUrl}
        />
      </div>

      <div className="col-sm-8">
        <h2>{props.banner.heading}</h2>
        <h3>{props.banner.subHeading}</h3>
        <div>{props.banner.content}</div>
      </div>
    </div>
  );
}





