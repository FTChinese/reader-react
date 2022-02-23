import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { DescriptionList } from '../../components/list/DescriptionList';
import { StringPair } from '../../data/pair';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { ReaderPassport } from '../../data/account';
import { localizeSubsStatus } from '../../data/localization';
import { CartItemStripe } from '../../data/shopping-cart';
import { Subs } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { createSubs, loadCusDefaultPayMethod, loadCustomer } from '../../repository/stripe';
import { useAuth } from '../../components/hooks/useAuth';
import { InlineSpinner } from '../../components/progress/InlineSpinner';
import { IntentKind } from '../../data/chekout-intent';
import { usePaymentSetting } from '../../components/hooks/usePaymentSetting';
import { BankCard } from './BankCard';
import { PaymentMethodTitle } from './PaymentMethodTitle';
import { ErrorBoudary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { Link } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';

/**
 * @description Handles Stripe pay actions.
 * Embedded in the PayentDialog.
 * @see https://stripe.com/docs/billing/subscriptions/build-subscription
 * https://stripe.com/docs/stripe-js/react
 */
export function StripePay(
  props: {
    item: CartItemStripe;
    onSuccess: (subs: Subs) => void;
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
      <p className="scale-down8 text-center">{props.item.intent.message}</p>

      <DefaultPaymentMethod
        passport={passport}
      />

      <CreateSubscription
        passport={passport}
        item={props.item}
        onSuccess={props.onSuccess}
      />
    </>
  );
}

function DefaultPaymentMethod(
  props: {
    passport: ReaderPassport,
  }
) {
  const [ progress, setProgress ] = useState(false);
  const [ err, setErr ] = useState('');

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

  return (
    <div className="mt-3 mb-3">
      <PaymentMethodTitle/>
      <ErrorBoudary errMsg={err}>
        <Loading loading={progress}>
          <ShowSelectedPaymentMethod/>
        </Loading>
      </ErrorBoudary>
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
    return <div className="text-black60 scale-down8">未设置</div>;
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
    onSuccess: (subs: Subs) => void;
  }
) {

  const { setMembership } = useAuth();
  const { paymentSetting } = usePaymentSetting();
  const [ progress, setProgress ] = useState(false);
  const [ subs, setSubs ] = useState<Subs>();

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
      setMembership(result.membership);
      setProgress(false);
      props.onSuccess(result.subs);
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
export function DisplaySubs(
  props: {
    subs: Subs,
  }
) {

  const rows: StringPair[] = [
    ['本周期开始时间', `${props.subs.currentPeriodStart}`],
    ['本周期结束时间', props.subs.currentPeriodEnd],
    ['订阅状态', localizeSubsStatus(props.subs.status)]
  ];

  return (
    <>
      <DescriptionList rows={rows}/>
      <p className="scale-down8 text-muted">*周期结束时将自动续订</p>
      <div className="text-center">
        <Link to={sitemap.membership}>返回</Link>
      </div>
    </>
  )
}

