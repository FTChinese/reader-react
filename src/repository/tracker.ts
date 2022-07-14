import ReactGA from 'react-ga4';
import { StripePrice, StripeSubs } from '../data/stripe';

export const tracker = {
  stripePricesViewed: (prices: StripePrice[]) => {
    prices.forEach(price => {
      ReactGA.gtag('event', 'view_item_list', {
          'send_to': [
              'G-W2PGS8NT21',
              'G-2MCQJHGE8J'
          ],
          items: [{
              item_id: price.id,
              item_name: price.nickname,
              item_brand: 'FTC',
              item_category: price.tier
          }]
      });
    });
  },

  stripeInCart: (price: StripePrice) => {
    ReactGA.gtag('event', 'view_item', {
        'send_to': [
            'G-W2PGS8NT21',
            'G-2MCQJHGE8J'
        ],
        currency: 'GBP',
        items: [{
            item_id: price.id,
            item_name: price.nickname,
            item_brand: 'FTC',
            item_category: price.tier,
            currency: 'GBP',
            quantity: 1
        }]
    });
  },

  stripeSubscribed: (subs: StripeSubs, price: StripePrice) => {
    ReactGA.gtag('event', 'purchase', {
      'send_to': [
        'G-W2PGS8NT21',
        'G-2MCQJHGE8J'
      ],
      currency: 'GBP',
      transaction_id: subs.latestInvoiceId,
      shipping: 0,
      tax: 0,
      items: [{
        item_id: price.id,
        item_name: price.nickname,
        item_brand: 'FTC',
        item_category: price.tier,
        price: price.unitAmount,
        currency: 'GBP',
        quantity: 1
      }]
    });
  },
};
