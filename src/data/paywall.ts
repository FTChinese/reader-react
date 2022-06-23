import { isValidPeriod, OptionalPeriod } from './period';
import { buildProductItem, PaywallProduct, ProductItem } from './paywall-product';
import { StripePaywallItem } from './stripe';
import { Membership } from './membership';

export type Banner = {
  id: string;
  heading: string;
  subHeading?: string;
  coverUrl?: string;
  content?: string;
  terms?: string;
};

export type Promo = Banner & OptionalPeriod;

export function isPromoValid(promo: Promo): Boolean {
  if (!promo.id) {
    return false
  }

  return isValidPeriod(promo);
}
export interface Paywall {
  id: number;
  banner: Banner;
  liveMode: boolean;
  promo: Promo;
  products: PaywallProduct[];
  stripe: StripePaywallItem[];
}

export function buildProductItems(paywall: Paywall, m: Membership): ProductItem[] {
  // Index StripePaywallitem by price id.
  const stripeItemStore = paywall.stripe.reduce((store, curr) => {
    return store.set(curr.price.id, curr);
  }, new Map<string, StripePaywallItem>());

  return paywall.products.map(product => {
    return buildProductItem(
      product,
      {
        membership: m,
        stripeStore: stripeItemStore,
      }
    )
  });
}






