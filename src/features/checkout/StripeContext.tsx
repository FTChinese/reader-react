import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripePubKey } from '../../repository/stripe';

// See https://stripe.com/docs/stripe-js/react
// The requirment of Stripe.js initialization makes
// it impossible to use both test and live key
// simutaneously.
// A possible solution is is to set up two
// servers using different keys.
export const stripePromise = loadStripePubKey()
.then(pk => {
  console.log(`Initializing Stripe with ${pk.live ? 'live' : 'test'} publishable key`);
  return loadStripe(pk.key);
});

export function StripeContext(
  props: {
    secret?: string;
    children: JSX.Element;
  }
) {
  const options: StripeElementsOptions = {
    clientSecret: props.secret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {props.children}
    </Elements>
  );
}
