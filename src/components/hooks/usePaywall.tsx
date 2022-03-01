import { atom, selector, useRecoilState } from 'recoil'
import { Banner, isPromoValid, Paywall, PaywallProduct } from '../../data/paywall'
import { StripePrice } from '../../data/price'

type PriceData = {
  ftc?: Paywall;
  stripe: StripePrice[];
}

const paywallState = atom<PriceData>({
  key: 'PaywallState',
  default: {
    ftc: undefined,
    stripe: [],
  }
});

export function usePaywall() {
  const [ paywall, setPaywall ] = useRecoilState(paywallState);

  function setFtcPrice(pw: Paywall) {
    setPaywall((currVal) => {
      return {
        ...currVal,
        ftc: pw,
      }
    });
  }

  function setStripePrice(prices: StripePrice[]) {
    setPaywall((currVal) => {
      return {
        ...currVal,
        stripe: prices,
      }
    });
  }

  return {
    paywall,
    setFtcPrice,
    setStripePrice,
  };
}

export const paywallBannerState = selector<Banner | null>({
  key: 'paywallBannerState',
  get: ({ get }) => {
    const pw = get(paywallState);
    if (!pw.ftc) {
      return null;
    }

    if (isPromoValid(pw.ftc.promo)) {
      return pw.ftc.promo;
    }

    return pw.ftc.banner;
  },
});

export const paywallProductsState = selector<PaywallProduct[]>({
  key: 'paywallProductsState',
  get: ({ get }) => {
    const pw = get(paywallState);
    if (!pw.ftc) {
      return [];
    }

    return pw.ftc.products;
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
