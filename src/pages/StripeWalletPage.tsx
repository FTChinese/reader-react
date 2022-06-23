import { useState } from 'react';
import { AddBankCard, BankCard } from '../components/BankCard';
import { useAuth } from '../components/hooks/useAuth';
import { CenterColumn } from '../components/layout/Column';
import { Flex } from '../components/layout/Flex';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Unauthorized } from '../components/routes/Unauthorized';
import { ReaderPassport } from '../data/account';
import { PaymentMethod } from '../data/stripe';
import { SetupPaymentMethod } from '../features/checkout/SetupPaymentMethod';
import { ResponseError } from '../repository/response-error';
import { loadStripeDefaultPayment } from '../repository/stripe';
import { SetupUsage } from '../store/stripeSetupSession';

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
    defaultPaymentMethod,
    paymentMethodSelected,
    loadDefaultPaymentMethod,
  } = useStripeWallet();

  return (

    <CenterColumn>
      <ErrorBoundary errMsg={error}>
        <Loading loading={progress}>

          <>
            <h2>Stripe支付管理</h2>
            <StripeWalletScreen
              paymentMethod={paymentMethodSelected || defaultPaymentMethod}
              isDefault={paymentMethodSelected?.id == defaultPaymentMethod?.id}
              onAddCard={ () => {} }
            />
            <SetupPaymentMethod
              passport={passport}
              usage={SetupUsage.Future}
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
    onAddCard: () => void;
  }
) {

  const card = props.paymentMethod?.card;

  return (
    <>
      {
        card &&
        <BankCard
          brand={card.brand}
          last4={card.last4}
          expYear={card.expYear}
          expMonth={card.expMonth}
        />
      }

      <Flex justify="start">
        <AddBankCard
          enabled={true}
          onClick={props.onAddCard}
        />
      </Flex>

    </>
  );
}

function useStripeWallet() {
  const [progress, setProgress] = useState(false);
  const [error, setError] = useState('');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [paymentMethodSelected, selectPaymentMethod] = useState<PaymentMethod | undefined>(undefined);

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

  return {
    progress,
    error,
    defaultPaymentMethod,
    paymentMethodSelected,
    loadDefaultPaymentMethod,
  }
}
