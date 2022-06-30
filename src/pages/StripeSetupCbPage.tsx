import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { useAuth } from '../components/hooks/useAuth';
import { SetupUsage, stripeSetupSession } from '../store/stripeSetupSession';
import { sitemap } from '../data/sitemap';
import { useStripeSetup } from '../components/hooks/useStripeSetup';

export function StripeSetupCbPage() {

  const { passport } = useAuth();

  const [ searchParams, _ ] = useSearchParams();
  const navigate = useNavigate();

  const [ err, setErr ] = useState('');

  const {
    progress,
    onSetupCallback,
  } = useStripeSetup();

  useEffect(() => {

    if (!passport) {
      return;
    }

    onSetupCallback(
        searchParams,
        passport
      )
      .then(usage => {
        // Navigate back to either checkout page
        // or stripe setting page.
        switch (usage) {
          case SetupUsage.PayNow:
            navigate(sitemap.checkout);
            break;

          case SetupUsage.Future:
            navigate(sitemap.stripeSetting);
            break;
        }
      })
      .catch((err: Error) => {
        setErr(err.message);
      });

    return function clear() {
      stripeSetupSession.clear();
    }
  }, []);


  return (
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>
        <div className="text-center">Redidcting...</div>
      </Loading>
    </ErrorBoundary>
  );
}
