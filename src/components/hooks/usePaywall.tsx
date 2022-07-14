import { useState } from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { Banner, isPromoValid, Paywall } from '../../data/paywall'
import { loadPaywall } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';

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
