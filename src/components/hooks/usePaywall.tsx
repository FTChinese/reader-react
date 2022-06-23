import { atom, selector, useRecoilState } from 'recoil'
import { Banner, isPromoValid, Paywall } from '../../data/paywall'
import { PaywallProduct } from '../../data/paywall-product';
import { StripePrice } from '../../data/stripe'

type PriceData = {
  paywall?: Paywall;
  stripe: StripePrice[];
}

const paywallState = atom<PriceData>({
  key: 'PaywallState',
  default: {
    paywall: undefined,
    stripe: [],
  }
});

export function usePaywall() {
  const [ paywall, setPaywall ] = useRecoilState(paywallState);

  function setFtcPrice(pw: Paywall) {
    setPaywall((currVal) => {
      return {
        ...currVal,
        paywall: pw,
      }
    });
  }

  return {
    paywall,
    setFtcPrice,
  };
}

export const paywallBannerState = selector<Banner | undefined>({
  key: 'paywallBannerState',
  get: ({ get }) => {
    const pw = get(paywallState);
    if (!pw.paywall) {
      return undefined;
    }

    if (isPromoValid(pw.paywall.promo)) {
      return pw.paywall.promo;
    }

    return pw.paywall.banner;
  },
});

export const paywallProductsState = selector<PaywallProduct[]>({
  key: 'paywallProductsState',
  get: ({ get }) => {
    const pw = get(paywallState);
    if (!pw.paywall) {
      return [];
    }

    return pw.paywall.products;
  },
});

export const paywallStripeState = selector<Map<string, StripePrice>>({
  key: 'paywallStripeState',
  get: ({ get }) => {
    const pw = get(paywallState);

    return pw.stripe.reduce((prev, curr) => {
      return prev.set(curr.id, curr);
    }, new Map());
  },
});
