import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { ErrorBoudary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { StripeShelfItem } from '../../data/product-shelf';
import { loadStripePubKey } from '../../repository/stripe';
import { useAuthContext } from '../../store/AuthContext';

const stripePromise = loadStripePubKey()
  .then(pk => {
    console.log('Initializing Stripe...');
    return loadStripe(pk.key);
  });

/**
 * @description Handles Stripe pay actions.
 * Embedded in the PayentDialog.
 * @see https://stripe.com/docs/billing/subscriptions/build-subscription
 * https://stripe.com/docs/stripe-js/react
 */
export function StripePay(
  props: {
    item: StripeShelfItem;
  }
) {
  const { passport } = useAuthContext();
  if (!passport) {
    return <></>;
  }

  const [ err, setErr ] = useState('');
  const [ progress, setProgress ] = useState(true);

  return (
    <Elements stripe={stripePromise}>

    </Elements>
  );
}


