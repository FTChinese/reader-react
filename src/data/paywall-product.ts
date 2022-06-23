import { intentNewMember, buildFtcCheckoutIntent, buildStripeCheckoutIntent } from './chekout-intent';
import { OfferKind, Tier } from './enum';
import { applicableOfferKinds, Membership } from './membership';
import { isValidPeriod } from './period';
import { Price, Discount, filterOffers, dailyPrice } from './price';
import { CartItemFtc, CartItemStripe } from './shopping-cart';
import { findStripeCoupon, StripePaywallItem } from './stripe';

export type Product = {
  id: string;
  active: boolean;
  description: string;
  heading: string;
  introductory?: Price;
  liveMode: boolean;
  smallPrint?: string;
  tier: Tier;
};

/**
 * @description PaywallPrice contains a price and a list of
 * opitonal discounts.
 */
 export type PaywallPrice = Price & {
  offers: Discount[];
};

export function applicableOffer(pp: PaywallPrice, filters: OfferKind[]): Discount | undefined {
  if (pp.offers.length === 0) {
    return undefined;
  }

  const filtered = filterOffers(pp.offers, filters);

  if (filtered.length == 0) {
    return undefined;
  }

  return filtered[0];
}

/**
 * @description PaywallProduct contains the human-readable text of a product, and a list of prices attached to it.
 */
export type PaywallProduct = Product & {
  prices: PaywallPrice[];
};

type StripePriceIDs = {
  recurrings: string[];
  trial?: string;
}

function buildStripeCartItems(
  priceIds: StripePriceIDs,
  prices: Map<string, StripePaywallItem>,
  m: Membership
): CartItemStripe[] {
   if (prices.size == 0) {
     return [];
   }

   const trialItem = priceIds.trial
    ? prices.get(priceIds.trial)
    : undefined;

  const items: CartItemStripe[] = [];
  priceIds.recurrings.forEach(id => {
    const pwItem = prices.get(id);
    if (pwItem != null) {
      items.push({
        intent: buildStripeCheckoutIntent(m, pwItem.price),
        recurring: pwItem.price,
        trial: trialItem?.price,
        coupon: findStripeCoupon(pwItem.coupons)
      })
    }
  });

  return items;
}

type PriceCollected = {
  ftcItems: CartItemFtc[];
  stripeIds: StripePriceIDs;
}

function collectPriceItems(product: PaywallProduct, m: Membership): PriceCollected {
  const offerKinds = applicableOfferKinds(m);

  const recurringItems = product.prices.map<CartItemFtc>(price => {
    return {
      intent: buildFtcCheckoutIntent(m, price),
      price: price,
      discount: applicableOffer(price, offerKinds),
      isIntro: false,
    }
  });

  if (!product.introductory || !isValidPeriod(product.introductory)) {
    return {
      ftcItems: recurringItems,
      stripeIds: {
        recurrings: product.prices.map(p => p.stripePriceId),
        trial: undefined,
      }
    }
  }

  return {
    ftcItems: [
      {
        intent: intentNewMember,
        price: product.introductory,
        discount: undefined,
        isIntro: true,
      },
      ...recurringItems,
    ],
    stripeIds: {
      recurrings: product.prices.map(p => p.stripePriceId),
      trial: product.introductory?.stripePriceId,
    }
  };
}

/**
 * @description Turn a product's description into
 * an array of strings.
 */
function productDesc(product: PaywallProduct): string[] {
  if (!product.description) {
    return [];
  }

  let desc = product.description;

  product.prices
    .map(price => dailyPrice(price))
    .forEach(dp => desc = desc.replace(dp.holder, dp.replacer));

  return desc.split('\n');
}

type ProductContent = {
  id: string;
  tier: Tier;
  heading: string;
  description: string[];
  smallPrint?: string;
}

// Convert PaywallProduct to ProductContent to be used on UI.
function buildProductContent(pp: PaywallProduct): ProductContent {
  return {
    id: pp.id,
    tier: pp.tier,
    heading: pp.heading,
    description: productDesc(pp),
    smallPrint: pp.smallPrint,
  }
}

// ProductItem describes the data used to render a product on UI.
export type ProductItem = {
  content: ProductContent;
  ftcItems: CartItemFtc[];
  stripeItems: CartItemStripe[];
}

// newProductItem build the product's ftc and stripe price
// items based on current user.
export function buildProductItem(
  product: PaywallProduct,
  args: {
    membership: Membership,
    stripeStore: Map<string,StripePaywallItem>
  }
): ProductItem {
  const content = buildProductContent(product);

  const { ftcItems, stripeIds } = collectPriceItems(product, args.membership);

  const stripeItems = buildStripeCartItems(stripeIds, args.stripeStore, args.membership);

  return {
    content: content,
    ftcItems: ftcItems,
    stripeItems: stripeItems,
  };
}
