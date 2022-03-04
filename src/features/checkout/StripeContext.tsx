import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripePubKey } from '../../repository/stripe';

export const stripePromise = loadStripePubKey()
.then(pk => {
  console.log('Initializing Stripe...');
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
