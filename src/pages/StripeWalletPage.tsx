import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AddCardButton, BankCard, CardColumn } from '../components/BankCard';
import { DisplayGrid, SpinnerOrText, TextButton } from '../components/buttons/Buttons';
import { useAuth } from '../components/hooks/useAuth';
import { CenterColumn } from '../components/layout/Column';
import { Flex } from '../components/layout/Flex';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Unauthorized } from '../components/routes/Unauthorized';
import { ReaderPassport } from '../data/account';
import { hasStripeSubs } from '../data/membership';
import { PaymentMethod } from '../data/stripe';
import { ResponseError } from '../repository/response-error';
import { loadStripeDefaultPayment, stripeRepo } from '../repository/stripe';

/**
 * @description Payment method managment.
 * @todo Enable deleting payment method, change
 * current subscription's default payment method.
 * If subscription does not exist, set default
 * payment method on customer.
 */
export function StripeWalletPage() {
  const { passport } = useAuth();
  if (!passport) {
    return <Unauthorized/>;
  }

  const {
    progress,
    error,
    submitErr,
    submitting,
    defaultPaymentMethod,
    paymentMethodSelected,
    loadDefaultPaymentMethod,
    setCusDefaultPayment,
    setSubsDefaultPayment,
  } = useStripeWallet();

  useEffect(() => {
    loadDefaultPaymentMethod(passport);
  }, []);

  useEffect(() => {
    if (submitErr) {
      toast.error(submitErr);
    }
  }, [submitErr]);

  return (

    <CenterColumn>
      <ErrorBoundary errMsg={error}>
        <Loading loading={progress}>

          <>
            <h2 className="text-center">
              Stripe支付管理
            </h2>

            <StripeWalletScreen
              paymentMethod={paymentMethodSelected || defaultPaymentMethod}
              isDefault={paymentMethodSelected?.id == defaultPaymentMethod?.id}
              submitting={submitting}
              onSetDefault={(method) => {
                if (hasStripeSubs(passport.membership)) {
                  setSubsDefaultPayment(passport, method);
                } else {
                  setCusDefaultPayment(passport, method);
                }
              }}
              onAddCard={ () => {} }
            />
          </>

        </Loading>
      </ErrorBoundary>


    </CenterColumn>
  );
}

function StripeWalletScreen(
  props: {
    paymentMethod?: PaymentMethod;
    isDefault: boolean;
    submitting: boolean;
    onSetDefault: (method: PaymentMethod) => void;
    onAddCard: () => void;
  }
) {

  const card = props.paymentMethod?.card;

  return (
    <CardColumn>
      <>
        {
          props.paymentMethod &&
          <Flex justify="end">
            <TextButton
              onClick={() => {
                if (props.paymentMethod) {
                  props.onSetDefault(props.paymentMethod);
                }
              }}
              disabled={props.isDefault}
            >
              <SpinnerOrText
                text="设为默认"
                progress={props.submitting}
              />
            </TextButton>
          </Flex>
        }

        {
          card &&
          <BankCard
            brand={card.brand}
            last4={card.last4}
            expYear={card.expYear}
            expMonth={card.expMonth}
          />
        }

        <DisplayGrid className="mt-2">
          <AddCardButton
            enabled={true}
            onClick={props.onAddCard}
          />
        </DisplayGrid>
      </>
    </CardColumn>
  );
}

function useStripeWallet() {
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState('');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [paymentMethodSelected, selectPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [ submitting, setSubmitting ] = useState(false);
  const [ submitErr, setSubmitErr ] = useState('');

  const loadDefaultPaymentMethod = (passport: ReaderPassport) => {
    setError('');
    setProgress(true);

    loadStripeDefaultPayment(passport)
      .then(pm => {
        setProgress(false);
        setDefaultPaymentMethod(pm);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        setError(err.message);
      });
  };

  const setCusDefaultPayment = (pp: ReaderPassport, method: PaymentMethod) => {
    setSubmitErr('');
    setSubmitting(false);

    if (!pp.stripeId) {
      setSubmitErr('Not a stripe customer');
      return;
    }

    stripeRepo.setCusPayment({
        token: pp.token,
        customerId: pp.stripeId,
        methodId: method.id
      })
      .then(cus => {
        setSubmitting(false);
        selectPaymentMethod(method);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        setSubmitErr(err.message);
      });
  }

  const setSubsDefaultPayment = (pp: ReaderPassport, method: PaymentMethod) => {
    setSubmitErr('');
    setSubmitting(false);

    const subsId = pp.membership.stripeSubsId
    if (!subsId) {
      setSubmitErr('No stripe subscritpion!');
      return;
    }

    stripeRepo.updateSubsPayment({
        token: pp.token,
        subsId: subsId,
        methodId: method.id
      })
      .then(subs => {
        setSubmitting(false);
        selectPaymentMethod(method);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        setSubmitErr(err.message);
      });
  }

  return {
    progress,
    error,
    defaultPaymentMethod,
    paymentMethodSelected,
    submitErr,
    submitting,
    loadDefaultPaymentMethod,
    setCusDefaultPayment,
    setSubsDefaultPayment,
  }
}
