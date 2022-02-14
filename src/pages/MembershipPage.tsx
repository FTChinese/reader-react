import { useAuthContext } from '../store/AuthContext';
import { CurrentSubs } from '../features/subs/CurrentSubs';
import { Unauthorized } from '../components/routes/Unauthorized';
import { useEffect, useState } from 'react';
import { paywallRepo } from '../repository/paywall';
import { ResponseError } from '../repository/response-error';
import { Paywall } from '../data/paywall';
import { ErrorBoudary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { PaywallContent } from '../features/product/PaywallContent';
import { stripePricesState } from '../store/useStripePrices';
import { useRecoilState } from 'recoil';

export function MembershipPage() {
  const { passport } = useAuthContext();

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
    <>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <CurrentSubs
            {...passport.membership}
          />
        </div>
      </div>

      <ErrorBoudary errMsg={err}>
        <Loading loading={progress}>
          {
            paywall ?
            <PaywallContent
              passport={passport}
              paywall={paywall}
            /> :
            <></>
          }
        </Loading>
      </ErrorBoudary>
    </>
  );
}
