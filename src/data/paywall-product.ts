import { intentNewMember, CheckoutIntent, buildCheckoutIntent, newIntentSource, newStripeTarget, newOneOffTarget } from './chekout-intent';
import { Tier } from './enum';
import { MemberParsed } from './membership';
import { PaywallProduct, Paywall } from './paywall';
import { isValidPeriod } from './period';
import { dailyPrice, applicableOffer, Price, Discount } from './price';
import { applicableCoupon, StripeCoupon, StripePaywallItem, StripePrice } from './stripe';

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

type StripePriceIDs = {
  recurrings: string[];
  trial?: string;
}

type PriceCollected = {
  ftcItems: CartItemFtc[];
  stripeIds: StripePriceIDs;
}

// Build the ftc cart item for introducatory price
// if applicable.
function oneOffIntroItem(price?: Price,): CartItemFtc | undefined {

  // If introductory price does not exist.
  if (!price) {
    return undefined;
  }

  if (price.kind !== 'one_time') {
    return undefined;
  }

  // If introductory price is not in valid period.
  if (!isValidPeriod(price)) {
    return undefined;
  }

  return {
    intent: intentNewMember,
    price: price,
    discount: undefined, // Intro price does not have discount.
    isIntro: true,
  };
}

/**
 * @description Build ftc cart item from a product, together with the stripe price id associated with each ftc price.
 */
function collectPriceItems(product: PaywallProduct, m: MemberParsed): PriceCollected {
  const offerKinds = m.applicableOfferKinds();

  const intentSource = newIntentSource(m);

  // Transform ftc price.
  const recurringItems = product.prices.map<CartItemFtc>(price => {
    const target = newOneOffTarget(price);

    return {
      intent: buildCheckoutIntent(intentSource, target),
      price: price,
      discount: applicableOffer(price.offers, offerKinds),
      isIntro: false,
    }
  });

  // If user is not a new member, no introductory price should be offered.
  const introItem = m.isZero()
    ? oneOffIntroItem(product.introductory)
    : undefined;

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

function buildStripeCartItems(
  priceIds: StripePriceIDs,
  prices: Map<string, StripePaywallItem>,
  m: MemberParsed,
): CartItemStripe[] {
   if (prices.size == 0) {
     return [];
   }

  const trialItem = priceIds.trial
    ? prices.get(priceIds.trial)
    : undefined;

  const intentSource = newIntentSource(m);

  const items: CartItemStripe[] = [];

  priceIds.recurrings.forEach(id => {
    const pwItem = prices.get(id);

    if (pwItem != null) {

      // Coupon is only applicable when there's no trial price.
      const coupon = !trialItem
        ? applicableCoupon(pwItem.coupons)
        : undefined;

      const target = newStripeTarget(pwItem.price, !!coupon)

      items.push({
        intent: buildCheckoutIntent(intentSource, target),
        recurring: pwItem.price,
        trial: trialItem?.price,
        coupon: coupon,
      });
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
    membership: MemberParsed,
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

export function buildProductItems(paywall: Paywall, m: MemberParsed): ProductItem[] {
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
