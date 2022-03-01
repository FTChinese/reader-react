import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { ImageRatio } from '../components/graphics/ImageRatio';
import { useAuth } from '../components/hooks/useAuth';
import { paywallBannerState, paywallProductsState, usePaywall } from '../components/hooks/usePaywall';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Unauthorized } from '../components/routes/Unauthorized';
import { ProductCard } from '../features/product/ProductCard';
import { listStripePrices, loadPaywall } from '../repository/paywall';
import { ResponseError } from '../repository/response-error';

export function SubsPage() {

  const [ progress, setProgress ]= useState(true);
  const [ err, setErr ] = useState('');

  const { setFtcPrice, setStripePrice } = usePaywall();

  useEffect(() => {
    loadPaywall()
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

  useEffect(() => {
    listStripePrices()
      .then(prices => {
        setStripePrice(prices);
        console.log(prices);
      })
      .catch((err: ResponseError) => {
        console.log(err);
      });
  }, []);

  return (
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>
        <div className="mt-3">
          <PaywallBanner/>
          <PaywallProducts/>
        </div>
      </Loading>
    </ErrorBoundary>
  );
}

function PaywallBanner() {

  const banner = useRecoilValue(paywallBannerState);

  if (!banner) {
    return null;
  }

  return (
    <div className="row flex-row-reverse">
      <div className="col-sm-4">
        <ImageRatio
          src={banner.coverUrl}
        />
      </div>

      <div className="col-sm-8">
        <h2>{banner.heading}</h2>
        <h3>{banner.subHeading}</h3>
        <div>{banner.content}</div>
      </div>
    </div>
  );
}

function PaywallProducts() {
  const { passport } = useAuth();

  const products = useRecoilValue(paywallProductsState);

  if (!passport) {
    return <Unauthorized/>;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      {
        products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            member={passport.membership}
          />
        ))
      }
    </div>
  );
}
