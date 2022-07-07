import { PaymentMethod } from '@stripe/stripe-js';
import { useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { selectedPayMethodState } from './useStripePaySetting';
import { ReaderPassport } from '../../data/account';
import { convertPaymentMthod, SetupIntent } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { stripeRepo } from '../../repository/stripe';
import { newSetupCbParams, SetupUsage, stripeSetupSession, validateSetupSession } from '../../store/stripeSetupSession';
import { stripePromise } from '../routes/stripePromise';

export const setupIntentState = atom<SetupIntent | undefined>({
  key: 'stripeSetupIntent',
  default: undefined,
});

export function useStripeSetup() {
  const [ progress, setProgress ] = useState(false);
  const [ setupIntent, setSetupIntent ] = useRecoilState(setupIntentState);
  // After a new payment method is created, save it to selectedPayMethodState
  // so that after redirection user could see it.
  const [ _, setSelectedPayMethod ] = useRecoilState(selectedPayMethodState);

  const onSetupCallback = (
    params: URLSearchParams,
    passport: ReaderPassport,
  ): Promise<SetupUsage> => {
    setProgress(true);

    const cbParams = newSetupCbParams(params);
    const sess = stripeSetupSession.load();
    if (!sess) {
      setProgress(false);
      return Promise.reject(new Error('Invalid session'));
    }

    const invalid = validateSetupSession({
      params: cbParams,
      sess,
      passport,
    });

    if (invalid) {
      setProgress(false);
      return Promise.reject(new Error(invalid));
    }

    return stripePromise
      .then(stripe => {
        if (!stripe) {
          setProgress(false);
          return Promise.reject(new Error('Stripe not initialized'));
        }

        return stripe.retrieveSetupIntent(cbParams.setupIntentClientSecret);
      })
      .then(result => {
        if (result.error) {
          setProgress(false)
          return Promise.reject(result.error);
        }

        const rawPayMethod = result.setupIntent.payment_method;

        switch (typeof rawPayMethod) {
          case 'string':
            return stripeRepo.loadPaymentMethod(passport.token, rawPayMethod);

          case 'object':
            const pm = rawPayMethod as PaymentMethod;
            return Promise.resolve(convertPaymentMthod(pm));

          default:
            setProgress(false);
            return Promise.reject(new Error('Setup missing payment method'));
        }
      })
      .then(method => {
        // User will see this payment method after redirection as long as they
        // do not force-refresh the page.
        setSelectedPayMethod(method);
        setProgress(false);
        return Promise.resolve(sess.usage)
      })
      .catch((err: Error) => {
        console.log(err);
        setProgress(false);
        return Promise.reject(err);
      });
  };

  const createSetupIntent = (passport: ReaderPassport): Promise<void> => {
    const cusId = passport.stripeId;
    if (!cusId) {
      return Promise.reject(new Error('Not a stripe customer!'));
    }

    setProgress(true);
    return stripeRepo.createSetupIntent(
        passport.token,
        {
          customer: cusId,
        }
      )
      .then(si => {
        setProgress(false);
        setSetupIntent(si);
        return Promise.resolve();
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        return Promise.reject(err);
      });
  };

  return {
    progress,
    setupIntent,
    createSetupIntent,
    onSetupCallback,
  }
}
