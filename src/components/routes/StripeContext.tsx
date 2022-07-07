import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { stripePromise } from './stripePromise';

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
