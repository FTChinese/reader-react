import { useState } from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Banner, isPromoValid, Paywall } from '../../data/paywall'
import { loadPaywall } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import ReactGA from 'react-ga4';
const paywallState = atom<Paywall | undefined>({
  key: 'PaywallState',
  default: undefined,
});

const paywallBannerState = selector<Banner | undefined>({
  key: 'paywallBannerState',
  get: ({ get }) => {
    const pw = get(paywallState);
    if (!pw) {
      return undefined;
    }

    if (isPromoValid(pw.promo)) {
      return pw.promo;
    }

    return pw.banner;
  },
});

export function usePaywall() {
  const [ paywall, setPaywall ] = useRecoilState(paywallState);
  const banner = useRecoilValue(paywallBannerState);

  const [ progress, setProgress ]= useState(true);
  const [ err, setErr ] = useState('');

  const initLoadPaywall = (live: boolean) => {
    setProgress(true);
    setErr('');

    loadPaywall(live)
      .then(pw => {
        console.log(pw);
        setPaywall(pw);
        setProgress(false);
        const prices = pw.stripe;
        for(var i = 0; i < prices.length; i++) {
            ReactGA.gtag('event', 'view_item_list', {
                'send_to': [
                    'G-W2PGS8NT21',
                    'G-2MCQJHGE8J'
                ],
                items: [{
                    item_id: prices[i].price.id,
                    item_name: prices[i].price.nickname,
                    item_brand: 'FTC',
                    item_category: prices[i].price.tier
                }]
            });
        }
      })
      .catch((err: ResponseError) => {
        console.log(err);
        setErr(err.message);
        setProgress(false);
      });
  }

  return {
    paywall,
    banner,
    progress,
    err,
    initLoadPaywall,
  };
}
