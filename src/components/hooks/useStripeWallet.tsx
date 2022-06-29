import { useState } from 'react';
import { ReaderPassport } from '../../data/account';
import { StripePayMethod } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { stripeRepo } from '../../repository/stripe';

export function useStripeWallet() {

  const [ submitting, setSubmitting ] = useState(false);
  const [ submitErr, setSubmitErr ] = useState('');

  const setCusDefaultPayment = (pp: ReaderPassport, method: StripePayMethod): Promise<boolean> => {
    setSubmitErr('');
    setSubmitting(false);

    if (!pp.stripeId) {
      setSubmitErr('Not a stripe customer');
      return Promise.resolve(false);
    }

    return stripeRepo.setCusPayment({
        token: pp.token,
        customerId: pp.stripeId,
        methodId: method.id
      })
      .then(() => {
        setSubmitting(false);
        return Promise.resolve(true);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        setSubmitErr(err.message);
        return Promise.resolve(false);
      });
  }

  const setSubsDefaultPayment = (pp: ReaderPassport, method: StripePayMethod): Promise<boolean> => {
    setSubmitErr('');
    setSubmitting(false);

    const subsId = pp.membership.stripeSubsId
    if (!subsId) {
      setSubmitErr('No stripe subscritpion!');
      return Promise.resolve(false);
    }

    return stripeRepo.updateSubsPayment({
        token: pp.token,
        subsId: subsId,
        methodId: method.id
      })
      .then(() => {
        setSubmitting(false);
        return Promise.resolve(true);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        setSubmitErr(err.message);
        return Promise.resolve(false);
      });
  }

  return {
    submitErr,
    submitting,
    setCusDefaultPayment,
    setSubsDefaultPayment,
  }
}
