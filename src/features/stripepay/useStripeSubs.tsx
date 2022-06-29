import { useState } from 'react';
import { ReaderPassport } from '../../data/account';
import { IntentKind } from '../../data/chekout-intent';
import { Membership } from '../../data/membership';
import { CartItemStripe, newSubsParams, SubsParams } from '../../data/shopping-cart';
import { StripePayMethod, Subs } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { stripeRepo } from '../../repository/stripe';

export function useStripeSubs() {

  const [ submitting, setSubmitting ] = useState(false);
  // Used to display subscription details on ui.
  const [ subsCreated, setSubsCreated ] = useState<Subs | undefined>();

  const subscribe = (
    passport: ReaderPassport,
    item: CartItemStripe,
    payMethod: StripePayMethod,
  ): Promise<Membership> => {
    switch (item.intent.kind) {
      case IntentKind.Create:
        return createSub(
          passport,
          newSubsParams(item, payMethod)
        );

      case IntentKind.Upgrade:
      case IntentKind.Downgrade:
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
    submitting,
    subsCreated,
    subscribe,
  };
}
