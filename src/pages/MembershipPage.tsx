import { useAuth } from '../components/hooks/useAuth';
import { CurrentSubs } from '../features/subs/CurrentSubs';
import { Unauthorized } from '../components/routes/Unauthorized';
import { useEffect, useState } from 'react';
import { paywallRepo } from '../repository/paywall';
import { ResponseError } from '../repository/response-error';
import { Paywall } from '../data/paywall';
import { ErrorBoudary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { PaywallContent } from '../features/product/PaywallContent';
import { stripePricesState } from '../components/hooks/recoilState';
import { useRecoilState } from 'recoil';
import { SingleCenterCol } from '../components/layout/ContentLayout';

export function MembershipPage() {
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
    <>
      <SingleCenterCol>
        <CurrentSubs
          {...passport.membership}
        />
      </SingleCenterCol>

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
