import { useState } from 'react';
import { ReaderPassport } from '../../data/account';
import { IntentKind } from '../../data/chekout-intent';
import { Membership } from '../../data/membership';
import { CartItemStripe } from '../../data/paywall-product';
import { newSubsParams, SubsParams } from '../../data/shopping-cart';
import { StripeCouponApplied, StripePayMethod, StripeSubs } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { stripeRepo } from '../../repository/stripe';

export function useStripeSubs() {

  const [ submitting, setSubmitting ] = useState(false);
  // Used to display subscription details on ui.
  const [ subsCreated, setSubsCreated ] = useState<StripeSubs | undefined>();
  const [ checkingCoupon, setCheckingCoupon ] = useState(false);
  const [ couponApplied, setCouponApplied ] = useState<StripeCouponApplied>();

  const couponOfLatestInvoice = (
    token: string,
    subsId: string
  ) => {
    setCheckingCoupon(true);

    return stripeRepo
      .couponOfLatestInvoice(token, subsId)
      .then(applied => {
        console.log(applied);
        if (applied.couponId) {
          setCouponApplied(applied);
        }
      })
      .finally(() => {
        setCheckingCoupon(false);
      });
  };

  const subscribe = (
    passport: ReaderPassport,
    item: CartItemStripe,
    payMethod: StripePayMethod,
  ): Promise<Membership> => {
    switch (item.intent.kind) {
      case IntentKind.Create:
      case IntentKind.OneTimeToAutoRenew:
        return createSub(
          passport,
          newSubsParams(item, payMethod)
        );

      case IntentKind.Upgrade:
      case IntentKind.SwitchInterval:
      case IntentKind.ApplyCoupon:
        return updateSub(
          passport,
          newSubsParams(item, payMethod)
        );

      default:
        return Promise.reject(new Error('Unknown payment intent'));
    }
  }

  const createSub = (
    pp: ReaderPassport,
    params: SubsParams,
  ): Promise<Membership> => {
    console.log('Creating new subscription: %o', params);
    setSubmitting(true);
    return stripeRepo.createSubs(
        pp.token,
        params,
      )
      .then(result => {
        console.log(result);
        setSubmitting(false);
        setSubsCreated(result.subs);
        return Promise.resolve(result.membership);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        return Promise.reject(err);
      });
  }

  const updateSub = (
    pp: ReaderPassport,
    params: SubsParams,
  ): Promise<Membership> => {
    console.log('Modifying subscription %o', params);

    setSubmitting(true);
    const subsId = pp.membership.stripeSubsId;
    if (!subsId) {
      return Promise.reject(new Error('Not a stripe subscription'));
    }

    return stripeRepo.updateSubs(
        pp.token,
        subsId,
        params,
      )
      .then(result => {
        console.log(result);
        setSubmitting(false);
        setSubsCreated(result.subs);
        return Promise.resolve(result.membership);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        return Promise.reject(err);
      });
  }

  return {
    checkingCoupon,
    couponOfLatestInvoice,
    couponApplied,
    submitting,
    subsCreated,
    subscribe,
  };
}
