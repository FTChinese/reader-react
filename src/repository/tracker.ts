import { StripePrice, StripeSubs } from '../data/stripe';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs
 */
function initGtag(): Gtag.Gtag {
  window.dataLayer = window.dataLayer || [];

  const gtag: Gtag.Gtag = function() {
  window.dataLayer.push(arguments);
  }

  gtag('js', new Date());
  if (import.meta.env.DEV) {
    gtag('config', 'G-2MCQJHGE8J');
  }

  gtag('config', 'G-W2PGS8NT21');

  return gtag;
}

const gtag = initGtag();

export const tracker = {

  stripePricesViewed: (prices: StripePrice[]) => {
    prices.forEach(price => {
      // See https://developers.google.com/tag-platform/gtagjs/routing
      gtag('event', 'view_item_list', {
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
    gtag('event', 'view_item', {
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
    gtag('event', 'purchase', {
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


