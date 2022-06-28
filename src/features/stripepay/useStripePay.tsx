import { useState } from 'react';
import { ReaderPassport } from '../../data/account';
import { IntentKind } from '../../data/chekout-intent';
import { Membership } from '../../data/membership';
import { CartItemStripe } from '../../data/shopping-cart';
import { PaymentMethod, Subs } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { stripeRepo } from '../../repository/stripe';

export function useStripePay() {
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState('');

  const [paymentMethodSelected, selectPaymentMethod] = useState<PaymentMethod | undefined>(undefined);

  const [ submitting, setSubmitting ] = useState(false);
  const [ subsCreated, setSubsCreated ] = useState<Subs | undefined>();

  const loadDefaultPaymentMethod = (passport: ReaderPassport) => {
    setLoadErr('');
    setLoading(true);

    stripeRepo.loadDefaultPayment(passport)
      .then(pm => {
        setLoading(false);
        selectPaymentMethod(pm);
      })
      .catch((err: ResponseError) => {
        setLoading(false);
        setLoadErr(err.message);
      });
  };

  const subscribe = (pp: ReaderPassport, item: CartItemStripe): Promise<Membership> => {
    switch (item.intent.kind) {
      case IntentKind.Create:
        return createSub(pp, item);

      case IntentKind.Upgrade:
      case IntentKind.Downgrade:
        return updateSub(pp, item);

      default:
        return Promise.reject(new Error('Unknown payment intent'));
    }
  }

  const createSub = (pp: ReaderPassport, item: CartItemStripe): Promise<Membership> => {
    return stripeRepo.createSubs(
        pp.token,
        {
          priceId: item.recurring.id,
          introductoryPriceId: item.trial?.id,
          defaultPaymentMethod: paymentMethodSelected?.id,
        }
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

  const updateSub = (pp: ReaderPassport, item: CartItemStripe): Promise<Membership> => {

    const subsId = pp.membership.stripeSubsId;
    if (!subsId) {
      return Promise.reject(new Error('Not a stripe subscription'));
    }

    return stripeRepo.updateSubs(
        pp.token,
        {
          priceId: item.recurring.id,
          defaultPaymentMethod: paymentMethodSelected?.id,
          subsId: subsId,
        }
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
    loading,
    loadErr,
    paymentMethodSelected,
    selectPaymentMethod,
    submitting,
    subsCreated,
    loadDefaultPaymentMethod,
    subscribe,
  };
}
