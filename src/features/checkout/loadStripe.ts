import { loadStripe } from '@stripe/stripe-js';
import { loadStripePubKey } from '../../repository/stripe';

export const stripePromise = loadStripePubKey()
.then(pk => {
  console.log('Initializing Stripe...');
  return loadStripe(pk.key);
});
