import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { stripePromise } from '../features/checkout/loadStripe';
import { useAuth } from '../components/hooks/useAuth';
import { newSetupCbParams, stripeSetupSession } from '../store/stripeSetupSession';
import { sitemap } from '../data/sitemap';
import { ReaderPassport } from '../data/account';
import { useStripePaySetting } from '../components/hooks/useStripePaySetting';
import { loadPaymentMethod } from '../repository/stripe';

export function StripeSetupCbPage() {

  const { passport } = useAuth();
  const { removeSetupIntent } = useStripePaySetting();

  const [ searchParams, _ ] = useSearchParams();
  const navigate = useNavigate();
  const { selectPaymentMethod } = useStripePaySetting();

  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState('');

  useEffect(() => {

    if (!passport) {
      return;
    }

    const params = newSetupCbParams(searchParams);
    const invalid = stripeSetupSession.validate(params, passport)

    if (invalid) {
      setErr(invalid);
      return;
    }

    getPaymentMethod(params.setupIntentClientSecret, passport);

    return function clear() {
      stripeSetupSession.clear();
      removeSetupIntent();
    }
  }, [passport?.id]);

  async function getPaymentMethod(secret: string, pp: ReaderPassport) {

    const stripe = await stripePromise;
    if (!stripe) {
      setErr('Stripe not initialized');
      return;
    }

    const result = await stripe.retrieveSetupIntent(secret);

    if (result.error) {
      setErr(result.error.message || '');
      return;
    }
    const pmId = result.setupIntent.payment_method;

    if (!pmId) {
      setErr('Setup missing payment method');
      return;
    }

    console.log(`Fetching payment method ${pmId}`);

    try {
      const pm = await loadPaymentMethod(pp.token, pmId);

      selectPaymentMethod(pm);
      setProgress(false);
      // Navigate back to checkout page.
      // By now the global stripe payment method
      // state will have a default payment method
      // you can display to user on checkout page.
      navigate(sitemap.checkout);
    } catch (e) {
      console.log(e);
      setProgress(false)
      setErr(err.toString());
    }
  }

  return (
    <SingleCenterCol>
      <ErrorBoundary errMsg={err}>
        <Loading loading={progress}>
          <div>Payment method setup successfully.</div>
        </Loading>
      </ErrorBoundary>
    </SingleCenterCol>
  );
}
