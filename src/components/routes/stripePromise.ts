// See https://stripe.com/docs/stripe-js/react
// The requirment of Stripe.js initialization makes
// it impossible to use both test and live key
// simutaneously.
// A possible solution is is to set up two

import { loadStripe } from '@stripe/stripe-js';
import { stripeRepo } from '../../repository/stripe';
import { queryLive } from '../../utils/url';

export const liveMode = queryLive(new URLSearchParams(window.location.search));

// servers using different keys.
export const stripePromise = stripeRepo.loadPubKey(liveMode)
.then(pk => {
  console.log(`Initializing Stripe with ${pk.live ? 'live' : 'test'} publishable key`);
  return loadStripe(pk.key);
});
