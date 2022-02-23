import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { stripePricesState } from '../components/hooks/stripePriceState';
import { useAuth } from '../components/hooks/useAuth';
import { ErrorBoudary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Unauthorized } from '../components/routes/Unauthorized';
import { Paywall } from '../data/paywall';
import { PaywallContent } from '../features/product/PaywallContent';
import { paywallRepo } from '../repository/paywall';
import { ResponseError } from '../repository/response-error';

export function SubsPage() {

  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized/>;
  }

  const [ _, setPrices ] = useRecoilState(stripePricesState);

  const [ paywall, setPaywall ] = useState<Paywall>();
  const [ progress, setProgress ]= useState(false);
  const [ err, setErr ] = useState('');

  useEffect(() => {
    paywallRepo.load()
      .then(([ftc, stripe]) => {
        setProgress(false);
        setPaywall(ftc);
        setPrices(stripe);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        setErr(err.message);
      });
  }, []);

  return (
    <ErrorBoudary errMsg={err}>
      <Loading loading={progress}>
        <>
          {
            paywall &&
            <PaywallContent
              passport={passport}
              paywall={paywall}
            />
          }
        </>

      </Loading>
    </ErrorBoudary>
  );
}
