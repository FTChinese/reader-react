import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageRatio } from '../components/graphics/ImageRatio';
import { useAuth } from '../components/hooks/useAuth';
import { usePaywall } from '../components/hooks/usePaywall';
import { useShoppingCart } from '../components/hooks/useShoppingCart';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Membership, zeroMembership } from '../data/membership';
import { Banner, Paywall } from '../data/paywall';
import { buildProductItems, CartItemFtc, CartItemStripe, ProductItem } from '../data/paywall-product';
import { sitemap } from '../data/sitemap';
import { ProductCard } from '../features/product/ProductCard';
import { tracker } from '../repository/tracker';

export function SubsPage(
  props: {
    live: boolean; // Load live/test paywall data.
  }
) {

  const { passport } = useAuth();
  const {
    paywall,
    banner,
    initLoadPaywall,
    progress,
    err
  } = usePaywall();
  const navigate = useNavigate();
  const { putStripeItem, putFtcItem } = useShoppingCart();

  useEffect(() => {
    initLoadPaywall(props.live);
  }, []);

  useEffect(() => {
    if (!paywall) {
      return;
    }

    tracker.stripePricesViewed(paywall.stripe.map(item => item.price));
  }, [paywall?.id]);

  return (
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>
        <PaywallScreen
          paywall={paywall}
          banner={banner}
          membership={passport?.membership || zeroMembership()}
          onFtcPay={(ftcItem) => {
            putFtcItem(ftcItem);
            navigate(sitemap.checkout, { replace: false});
          }}
          onStripePay={(stripeItem) => {
            putStripeItem(stripeItem);
            navigate(sitemap.checkout, { replace: false });
          }}
        />
      </Loading>
    </ErrorBoundary>
  );
}

function PaywallScreen(
  props: {
    paywall?: Paywall;
    banner?: Banner;
    membership: Membership;
    onFtcPay: (item: CartItemFtc) => void;
    onStripePay: (item: CartItemStripe) => void;
  }
) {

  if (!props.paywall) {
    return null;
  }

  const productItems = buildProductItems(
    props.paywall,
    props.membership,
  );

  return (
    <div className="mt-3">
      {
        props.banner &&
        <PaywallBanner
          banner={props.banner}
        />
      }
      <PaywallProducts
        productItems={productItems}
        onFtcPay={props.onFtcPay}
        onStripePay={props.onStripePay}
      />
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

function PaywallProducts(
  props: {
    productItems: ProductItem[];
    onFtcPay: (item: CartItemFtc) => void;
    onStripePay: (item: CartItemStripe) => void;
  }
) {

  return (
    <div className="mt-3">
      {
        props.productItems.map(item => (
          <ProductCard
            key={item.content.id}
            item={item}
            onFtcPay={props.onFtcPay}
            onStripePay={props.onStripePay}
          />
        ))
      }
    </div>
  );
}
