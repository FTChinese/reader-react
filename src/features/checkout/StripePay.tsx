import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { SyntheticEvent, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import { ArrowRight } from '../../components/icons';
import { DescriptionList } from '../../components/list/DescriptionList';
import { StringPair } from '../../components/list/pair';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { ReaderPassport } from '../../data/account';
import { localizeSubsStatus } from '../../data/localization';
import { CartItemStripe } from '../../data/shopping-cart';
import { convertPaymentMthod, PaymentMethod, Subs } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { createSubs, loadCusDefaultPayMethod } from '../../repository/stripe';
import { useAuth } from '../../store/useAuth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { paymentMethodState } from '../../store/recoilState';
import { InlineSpinner } from '../../components/progress/InlineSpinner';
import { IntentKind } from '../../data/chekout-intent';
import { PaymentMethodDialog } from './PaymentMethodDialog';
import { BankCard } from './BankCard';

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

  const paymentMethod = useRecoilValue(paymentMethodState);

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
          paymentMethod={paymentMethod.id}
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
  const [paymentMethod, setPaymentMethod ] = useRecoilState(paymentMethodState);

  useEffect(() => {
    setProgress(true);

    loadCusDefaultPayMethod(
        props.passport.token,
        props.passport.stripeId!!
      )
      .then(pm => {
        setProgress(false);
        console.log(pm);
        // Only set payment method if no one exists.
        // It might happen when network is very slow, the data is loaded
        // after user added a new card.
        if (!paymentMethod) {
          setPaymentMethod(pm);
        }
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        if (err.notFound) {
          // setNotFound(true);
          return;
        }

        toast.error(err.toString());
      })
  }, []);

  useEffect(() => {
    setShowForm(false);
  }, [paymentMethod.id]);

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
        <DisplayCard paymentMethod={paymentMethod} />
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
function DisplayCard(
  props: {
    paymentMethod: PaymentMethod,
  }
) {

  if (!props.paymentMethod.id) {
    return <div className="text-muted">未设置</div>;
  }

  return <BankCard
    paymentMethod={props.paymentMethod}
  />;
}

/**
 * @description Show CardElement
 */
function NewCardForm(
  props: {
    onCardSaved: () => void;
  }
) {
  const stripe = useStripe();
  const elements = useElements();

  const [ progress, setProgress ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');

  const setPaymentMethod = useSetRecoilState(paymentMethodState);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe.js not loaded');
      return;
    }

    const cardElem = elements.getElement('card');
    if (!cardElem) {
      console.error('CardElement not found');
      return;
    }

    setErrMsg('');
    setProgress(true);

    stripe.createPaymentMethod({
        type: 'card',
        card: cardElem,
      })
      .then(result => {
        setProgress(false);

        console.log(result);

        if (result.error) {
          setErrMsg(result.error.message || '');
          return;
        }

        setPaymentMethod(convertPaymentMthod(result.paymentMethod));
        props.onCardSaved();
      })
      .catch(err => {
        setProgress(false);
        console.error(err);
        setErrMsg(err.toString());
      });
  }

  // See doc https://stripe.com/docs/js/appendix/style
  // const options: StripeCardElementOptions = {
  //   style: {
  //       base: {

  //       }
  //   }
  // }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      {
        errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrMsg('')}
        >
          {errMsg}
        </Alert>
      }

      <CardElement />

      <div className="text-end">
        <Button
          size="sm"
          variant="link"
          type="submit"
        >
          {
            progress &&
            <Spinner
              as="span"
              animation="border"
              size="sm"
            />
          }
          保存
        </Button>
      </div>

    </form>
  );
}

/**
 * @description Submit required data to create a new subscription.
 */
function CreateSubscription(
  props: {
    passport: ReaderPassport;
    item: CartItemStripe;
    paymentMethod: string;
  }
) {

  const { passport } = useAuth();
  if (!passport) {
    return <></>;
  }

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
    setProgress(true);

    createSubs(passport.token, {
      priceId: props.item.recurring.id,
      defaultPaymentMethod: props.paymentMethod,
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
        disabled={!props.paymentMethod || progress}
        variant='primary'
        type="button"
        onClick={handleClick}
      >
        <InlineSpinner
          progress={progress}
        >
          <span>订阅并支付</span>
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

