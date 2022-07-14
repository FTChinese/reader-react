import { useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { ReaderPassport } from '../../data/account';
import { StripePayMethod } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { stripeRepo } from '../../repository/stripe';

const defaultPayMethodState = atom<StripePayMethod | undefined>({
  key: 'stripeDefaultPayMethod',
  default: undefined,
});

export const selectedPayMethodState = atom<StripePayMethod | undefined>({
  key: 'stripeSelectedPayMethod',
  default: undefined,
});

const payMethodListState = atom<StripePayMethod[]>({
  key: 'stripePayMethodList',
  default: [],
});

export function useStripePaySetting() {
  const [ defaultPayMethod, setDefaultPayMethod ] = useRecoilState(defaultPayMethodState);
  const [ selectedPayMethod, setSelectedPayMethod ] = useRecoilState(selectedPayMethodState);

  const [ loading, setLoading ] = useState(false);
  const [ loadErr, setLoadErr ] = useState('');
  const [ paymentMethods, setPaymentMethods ] = useRecoilState(payMethodListState);

  function clearPaymentSetting() {
    setDefaultPayMethod(undefined);
    setSelectedPayMethod(undefined);
  }

  const onPayMethodUpdated = (method: StripePayMethod) => {
    setSelectedPayMethod(method);
    setDefaultPayMethod(method);
  };

  // Load default payment method from of an active subscription if exists,
  // otherwise fallback to customer invoice setting's payment method.
  const loadDefaultPaymentMethod = (passport: ReaderPassport) => {
    setLoadErr('');
    setLoading(true);

    stripeRepo.loadDefaultPayment(passport)
      .then(pm => {
        setLoading(false);
        // User might access stripe setting/payment page directly.
        // In such case we assume neither default payment method nor selected payment exists.
        // The page might also be accessed by redirection from stripe setup callback page.
        // In such case the selectedPaymentMethod already exists and we want to sho
        // this newly added payment method.
        if (selectedPayMethod) {
          setDefaultPayMethod(pm)
        } else {
          onPayMethodUpdated(pm);
        }
      })
      .catch((err: ResponseError) => {
        console.log(err);
        setLoading(false);
      });
  };

  const listPaymentMethods = (token: string, cusId: string) => {
    if (paymentMethods.length > 0) {
      return;
    }

    setLoadErr('');
    setLoading(true);

    stripeRepo.listPaymentMethods(
      token,
      cusId
    )
    .then(list => {
      setLoading(false);
      setPaymentMethods(list.data);
    })
    .catch((err: ResponseError) => {
      setLoading(false);
      setLoadErr(err.toString());
    });
  };

  return {
    defaultPayMethod,
    selectedPayMethod,
    setSelectedPayMethod,
    onPayMethodUpdated,

    loadDefaultPaymentMethod,
    loading,
    loadErr,
    paymentMethods,
    listPaymentMethods,

    clearPaymentSetting,
  };
}
