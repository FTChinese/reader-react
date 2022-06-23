import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ImageRatio } from '../components/graphics/ImageRatio';
import { useAuth } from '../components/hooks/useAuth';
import { paywallBannerState, usePaywall } from '../components/hooks/usePaywall';
import { useShoppingCart } from '../components/hooks/useShoppingCart';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Unauthorized } from '../components/routes/Unauthorized';
import { isTestAccount } from '../data/account';
import { Membership } from '../data/membership';
import { Banner, buildProductItems, Paywall } from '../data/paywall';
import { ProductItem } from '../data/paywall-product';
import { CartItemFtc, CartItemStripe } from '../data/shopping-cart';
import { sitemap } from '../data/sitemap';
import { ProductCard } from '../features/product/ProductCard';
import { loadPaywall } from '../repository/paywall';
import { ResponseError } from '../repository/response-error';

export function SubsPage() {

  const [ progress, setProgress ]= useState(true);
  const [ err, setErr ] = useState('');

  const { passport } = useAuth();
  const { setFtcPrice, paywall } = usePaywall();
  const navigate = useNavigate();
  const { putStripeItem, putFtcItem } = useShoppingCart();

  useEffect(() => {
    loadPaywall(!isTestAccount(passport))
      .then(pw => {
        console.log(pw)
        setFtcPrice(pw);
        setProgress(false);
      })
      .catch((err: ResponseError) => {
        console.log(err);
        setErr(err.message);
        setProgress(false);
      });
  }, []);

  return (
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>

        <PaywallScreen
          paywall={paywall.paywall}
          membership={passport?.membership}
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
    membership?: Membership;
    onFtcPay: (item: CartItemFtc) => void;
    onStripePay: (item: CartItemStripe) => void;
  }
) {

  if (!props.paywall || !props.membership) {
    return null;
  }

  const banner = useRecoilValue(paywallBannerState);
  const productItems = buildProductItems(
    props.paywall,
    props.membership,
  )

  return (
    <div className="mt-3">
      <PaywallBanner
        banner={banner}
      />
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
    banner?: Banner;
  }
) {

  if (!props.banner) {
    return null;
  }

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
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized/>;
  }

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
