import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { useAuth } from '../components/hooks/useAuth';
import { newSetupCbParams, SetupUsage, stripeSetupSession, validateSetupSession } from '../store/stripeSetupSession';
import { sitemap } from '../data/sitemap';
import { ReaderPassport } from '../data/account';
import { useStripePaySetting } from '../components/hooks/useStripePaySetting';
import { loadPaymentMethod } from '../repository/stripe';
import { stripePromise } from '../features/stripepay/StripeContext';
import { PaySuccessLink } from '../components/text/Checkout';
import { BankCard } from '../components/BankCard';

export function StripeSetupCbPage() {

  const { passport } = useAuth();
  const { paymentSetting, selectPaymentMethod } = useStripePaySetting();

  const [ searchParams, _ ] = useSearchParams();
  const navigate = useNavigate();

  const [ progress, setProgress ] = useState(false);
  const [ err, setErr ] = useState('');

  const card = paymentSetting.selectedMethod?.card;

  useEffect(() => {

    if (!passport) {
      return;
    }

    const params = newSetupCbParams(searchParams);
    const sess = stripeSetupSession.load();

    if (!sess) {
      setErr('Invalid session');
      return;
    }

    const invalid = validateSetupSession({
      params,
      sess,
      passport,
    });

    if (invalid) {
      setErr(invalid);
      return;
    }

    getPaymentMethod(params.setupIntentClientSecret, passport, sess.usage);

    return function clear() {
      stripeSetupSession.clear();
    }
  }, []);

  async function getPaymentMethod(secret: string, pp: ReaderPassport, usage: SetupUsage) {

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
      // If user is setting up payment upon subscription,
      // navigate back to checkout page.
      if (usage === SetupUsage.PayNow) {
        // By now the global stripe payment method
        // state will have a default payment method
        // you can display to user on checkout page.
        navigate(sitemap.checkout);
      } else {
        setProgress(false);
      }
    } catch (e) {
      console.log(e);
      setProgress(false)
      setErr(err.toString());
    }
  }

  return (
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>
        <div className="d-flex flex-column align-items-center">
          <h5>Stripe支付已添加</h5>
          {
            card &&
            <BankCard
              brand={card.brand}
              last4={card.last4}
              expYear={card.expYear}
              expMonth={card.expMonth}
            />
          }
          <PaySuccessLink/>
        </div>
      </Loading>
    </ErrorBoundary>
  );
}
