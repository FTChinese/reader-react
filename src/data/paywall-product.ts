import { intentNewMember, buildFtcCheckoutIntent, buildStripeCheckoutIntent, CheckoutIntent } from './chekout-intent';
import { Tier } from './enum';
import { applicableOfferKinds, isMembershipZero, Membership } from './membership';
import { Product, PaywallProduct, Paywall } from './paywall';
import { isValidPeriod } from './period';
import { dailyPrice, applicableOffer, Price, Discount } from './price';
import { applicableCoupon, StripeCoupon, StripePaywallItem, StripePrice } from './stripe';

// Build the ftc cart item for introducatory price
// if applicable.
function introCartItem(product: Product, m: Membership): CartItemFtc | undefined {
  // If user is not a new member, no introductory price should be offered.
  if (!isMembershipZero(m)) {
    return undefined;
  }

  // If introductory price does not exist.
  if (!product.introductory) {
    return undefined;
  }

  // If introductory price is not in valid period.
  if (!isValidPeriod(product.introductory)) {
    return undefined;
  }

  return {
    intent: intentNewMember,
    price: product.introductory,
    discount: undefined, // Intro price does not have discount.
    isIntro: true,
  }
}


type StripePriceIDs = {
  recurrings: string[];
  trial?: string;
}

type PriceCollected = {
  ftcItems: CartItemFtc[];
  stripeIds: StripePriceIDs;
}

function collectPriceItems(product: PaywallProduct, m: Membership): PriceCollected {
  const offerKinds = applicableOfferKinds(m);

  // Transform ftc price.
  const recurringItems = product.prices.map<CartItemFtc>(price => {
    return {
      intent: buildFtcCheckoutIntent(m, price),
      price: price,
      discount: applicableOffer(price.offers, offerKinds),
      isIntro: false,
    }
  });

  const introItem = introCartItem(product, m);

  // If this product does not have introductory price,
  // or the price is not valid, return the prices only.
  if (!introItem) {
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
      introItem,
      ...recurringItems,
    ],
    stripeIds: {
      recurrings: product.prices.map(p => p.stripePriceId),
      trial: introItem.price.stripePriceId, // As long as trial exists, it is valid.
    }
  };
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

  const isNewMember = isMembershipZero(m);
  const items: CartItemStripe[] = [];

  priceIds.recurrings.forEach(id => {
    const pwItem = prices.get(id);

    if (pwItem != null) {
      items.push({
        intent: buildStripeCheckoutIntent(m, pwItem.price),
        recurring: pwItem.price,
        trial: trialItem?.price,
        coupon: isNewMember ? applicableCoupon(pwItem.coupons) : undefined,
      })
    }
  });

  return items;
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

/**
 * @description FtcCartItem represents the item
 * user want to buy.
 */
 export type CartItemFtc = {
  intent: CheckoutIntent;
  price: Price;
  discount?: Discount;
  isIntro: boolean;
};

/**
 * @description CartItemStripe contains all the information
 * on a stripe price user is trying to subscribe.
 */
 export type CartItemStripe = {
  intent: CheckoutIntent; // How use is trying to subscribe.
  recurring: StripePrice; // The canonical price to subscribe.
  trial?: StripePrice; // Optional trial price before entering the canonical subscription cycle.
  coupon?: StripeCoupon; // Coupon applicable to the canonical price. Mutually exclusive with trial.
}

// ProductItem describes the data used to render a product on UI.
export type ProductItem = {
  content: ProductContent;
  ftcItems: CartItemFtc[];
  stripeItems: CartItemStripe[];
}

// newProductItem build the product's ftc and stripe price
// items based on current user.
function buildProductItem(
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
