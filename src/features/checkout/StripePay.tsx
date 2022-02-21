import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import { ArrowRight } from '../../components/icons';
import { DescriptionList } from '../../components/list/DescriptionList';
import { StringPair } from '../../components/list/pair';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { ReaderPassport } from '../../data/account';
import { localizeSubsStatus } from '../../data/localization';
import { CartItemStripe } from '../../data/shopping-cart';
import { Subs } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { createSubs, loadCusDefaultPayMethod, loadCustomer } from '../../repository/stripe';
import { useAuth } from '../../store/useAuth';
import { InlineSpinner } from '../../components/progress/InlineSpinner';
import { IntentKind } from '../../data/chekout-intent';
import { PaymentMethodDialog } from './PaymentMethodDialog';
import { BankCard } from './BankCard';
import { usePaymentSetting } from '../../store/usePaymentSetting';

/**
 * @description Handles Stripe pay actions.
 * Embedded in the PayentDialog.
 * @see https://stripe.com/docs/billing/subscriptions/build-subscription
 * https://stripe.com/docs/stripe-js/react
 */
export function StripePay(
  props: {
    item: CartItemStripe;
  }
) {

  if (props.item.intent.kind === IntentKind.Forbidden) {
    return (
      <div className="text-danger text-center">
        { props.item.intent.message}
      </div>
    );
  }

  const { passport } = useAuth();
  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <>
      <p className="text-danger">{props.item.intent.message}</p>

      <div className="mt-3">
        <DefaultPaymentMethod
          passport={passport}
        />

        <CreateSubscription
          passport={passport}
          item={props.item}
        />
      </div>
    </>
  );
}

function DefaultPaymentMethod(
  props: {
    passport: ReaderPassport,
  }
) {
  const [ progress, setProgress ] = useState(false);
  const [ showForm, setShowForm ] = useState(false);

  const { paymentSetting, setCustomer, selectPaymentMethod } = usePaymentSetting
();

  // Load customer so that we could know if this customer has default payment method.
  useEffect(() => {
    if (paymentSetting.customer) {
      return;
    }

    const cusId = props.passport.stripeId;
    if (!cusId) {
      return;
    }

    loadCustomer(props.passport.token, cusId)
      .then(customer => {
        setCustomer(customer);
      })
      .catch((err: ResponseError) => {
        console.log(err);
      });
  }, []);

  // If no payment method selected yet, load customer's default payment method.
  useEffect(() => {
    if (paymentSetting.selectedMethod) {
      return;
    }

    const cusId = props.passport.stripeId;
    if (!cusId) {
      return;
    }

    setProgress(true);

    loadCusDefaultPayMethod(
        props.passport.token,
        cusId,
      )
      .then(pm => {
        setProgress(false);
        // Only set payment method if no one exists.
        // It might happen when network is very slow, the data is loaded
        // after user added a new card.
        if (paymentSetting.selectedMethod) {
          return;
        }

        selectPaymentMethod(pm)
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        if (err.notFound) {
          return;
        }

        toast.error(err.toString());
      })
  }, []);

  // When a method is selected to pay, close dialog.
  useEffect(() => {
    if (!paymentSetting.selectedMethod) {
      return;
    }
    setShowForm(false);
  }, [paymentSetting.selectedMethod?.id]);

  return (
    <div>
      <div className="d-flex justify-content-between border-bottom">
        <h6>支付方式</h6>

        <Button
          variant="link"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          <ArrowRight />
        </Button>
      </div>

      {
        progress ?
        <Spinner
          animation="border"
          size="sm"
        /> :
        <ShowSelectedPaymentMethod
       />
      }

      <PaymentMethodDialog
        show={showForm}
        onHide={() => setShowForm(false)}
      />
    </div>
  );
}

/**
 * @description Display a card under payment method.
 * A payment method might comes from multiple sources:
 * - User added using the NewCardForm
 * - Automatically loaded from a customer's default payment method.
 * If customer's default payment method exists, and a new card is added,
 * always use the new one.
 * As long as a payment method exits, it will be displayed.
 * @todo In the future we should list all payment methods.
 */
function ShowSelectedPaymentMethod() {

  const { paymentSetting } = usePaymentSetting();

  if (!paymentSetting.selectedMethod) {
    return <div className="text-muted">未设置</div>;
  }

  return <BankCard
    paymentMethod={paymentSetting.selectedMethod}
  />;
}

/**
 * @description Submit required data to create a new subscription.
 */
function CreateSubscription(
  props: {
    passport: ReaderPassport;
    item: CartItemStripe;
  }
) {

  const { paymentSetting } = usePaymentSetting();
  const [ progress, setProgress ] = useState(false);
  const [ subs, setSubs ] = useState<Subs>();

  useEffect(() => {
    return function cleanup() {
      setSubs(undefined);
    }
  });

  if (subs) {
    return (
      <div className="mt-3">
        <h5 className="text-center">订阅成功</h5>
        <DisplaySubs subs={subs}/>
      </div>
    )
  }

  const handleClick = () => {
    if (!paymentSetting.selectedMethod) {
      console.error('No payment method selected');
      return;
    }

    setProgress(true);

    createSubs(props.passport.token, {
      priceId: props.item.recurring.id,
      defaultPaymentMethod: paymentSetting.selectedMethod.id,
      introductoryPriceId: props.item.trial?.id
    })
    .then(result => {
      // TODO: save membership.
      console.log(result);
      setProgress(false);
      setSubs(result.subs);
    })
    .catch((err: ResponseError) => {
      console.log(err);
      setProgress(false);
      toast.error(err.toString());
    });
  };

  return (
    <div className="mt-3 d-grid">
      <Button
        disabled={!paymentSetting.selectedMethod || progress}
        variant='primary'
        type="button"
        onClick={handleClick}
      >
        <InlineSpinner
          progress={progress}
        >
          <span>订阅</span>
        </InlineSpinner>
      </Button>
    </div>
  );
}

/**
 * @description Show details of subscription after success.
 */
function DisplaySubs(
  props: {
    subs: Subs,
  }
) {

  const rows: StringPair[] = [
    ['当前订阅周期', `${props.subs.currentPeriodStart} - ${props.subs.currentPeriodEnd}`],
    ['订阅状态', localizeSubsStatus(props.subs.status)]
  ];

  return <DescriptionList rows={rows}/>
}

