import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { SyntheticEvent, useEffect, useState } from 'react';
import { createSetupIntent, listCusPaymentMethods } from '../../repository/stripe';
import { useAuth } from '../../components/hooks/useAuth';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { ResponseError } from '../../repository/response-error';
import { toast } from 'react-toastify';
import { stripePromise } from './loadStripe';
import { StripeElementsOptions } from '@stripe/stripe-js';
import Alert from 'react-bootstrap/esm/Alert';
import { PaymentMethod, SetupIntent } from '../../data/stripe';
import { stripeSetupCbUrl } from '../../data/sitemap';
import { stripeSetupSession } from '../../store/stripeSetupSession';
import { ReaderPassport } from '../../data/account';
import { ErrorBoudary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { BankCard } from './BankCard';
import { useStripePaySetting } from '../../components/hooks/useStripePaySetting';
import { LoadIndicator } from '../../components/progress/LoadIndicator';

export function PaymentMethodDialog(
  props: {
    show: boolean;
    onHide: () => void;
  }
) {
  const { passport } = useAuth();
  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          选择或添加支付方式
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <LoadPaymentMethods passport={passport} />
            <AddPaymentMethod passport={passport} />
          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}

/**
 * @description Load a customer's existing paymemnt methods and display it.
 */
function LoadPaymentMethods(
  props: {
    passport: ReaderPassport;
  }
) {

  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState('');
  const [ methods, setMethods ] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const cusId = props.passport.stripeId;
    if (!cusId) {
      setErr('Missing stripe customer id');
      return;
    }

    setErr('');
    setProgress(true);
    listCusPaymentMethods(props.passport.token, cusId)
      .then(list => {
        setProgress(false);
        setMethods(list.data);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        setErr(err.toString());
      });
  }, []);

  return (
    <div className="mb-3">
      <ErrorBoudary errMsg={err}>
        <Loading loading={progress}>
          <ListPaymentMethods methods={methods} />
        </Loading>
      </ErrorBoudary>
    </div>
  );
}

function ListPaymentMethods(
  props: {
    methods: PaymentMethod[]
  }
) {
  if (props.methods.length == 0) {
    return <div>尚未设置任何支付方式</div>;
  }

  return (
    <>
      {
        props.methods.map(m => (
          <BankCard
            key={m.id}
            paymentMethod={m}
            border={true}
          />
        ))
      }
    </>
  );
}

/**
 * @description Let user to add a new payment method.
 */
function AddPaymentMethod(
  props: {
    passport: ReaderPassport;
  }
) {

  const [ progress, setProgress ] = useState(false);
  const { paymentSetting, setSetupIntent } = useStripePaySetting();

  // Handle clicking add payment method button.
  // To add a new payment method for future use,
  // you have to ask Stripe to create a setup intent.
  const handleAdd = () => {
    const cusId = props.passport.stripeId;
    if (!cusId) {
      toast.error('Not a stripe customer yet!');
      return;
    }

    setProgress(true);

    createSetupIntent(
        props.passport.token,
        {
          customer: cusId,
        }
      )
      .then(si => {
        setProgress(false);
        console.log(si);
        setSetupIntent(si);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        toast.error(err.toString());
      });
  };

  return (
    <div className="mb-3">
      {/* Heading */}
      <div className="d-flex justify-content-end">
        {
          progress &&
          <Spinner
            as="span"
            animation="border"
            size="sm"
            className="me-2"
          />
        }
        <Button
          disabled={!!paymentSetting.setup}
          variant="link"
          size="sm"
          onClick={handleAdd}
        >
          添加新卡片
        </Button>
      </div>

      {
        /** Form */
        paymentSetting.setup &&
        <DisplayElements
          setupIntent={paymentSetting.setup}
        />
      }
    </div>
  );
}

/**
 * @description Show Stripe's Elements.
 * Since Elements cannot be modified once setup,
 * I guess you have to createa a new one instead of
 * using the top-level one.
 */
function DisplayElements(
  props: {
    setupIntent: SetupIntent;
  }
) {

  const options: StripeElementsOptions = {
    clientSecret: props.setupIntent.clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentMethodForm
        setupIntent={props.setupIntent}
      />
    </Elements>
  )
}

/**
 * @description Show Stripe's PaymentElement to collect payment method.
 * Once done, you will be redirecti to the return_url.
 */
function PaymentMethodForm(
  props: {
    setupIntent: SetupIntent;
  }
) {

  const stripe = useStripe();
  const elements = useElements();

  const [ progress, setProgress ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe.js not loaded');
      return;
    }

    setErrMsg('');
    setProgress(true);

    // Save session to be used after redirect.
    stripeSetupSession.save(props.setupIntent);

    // The return_url will be append the following parameters:
    // setup_intent: the id of the setup intent
    // setup_intent_client_secret
    // redirect_status=succeeded
    stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: stripeSetupCbUrl(document.location.origin),
        }
      })
      .then(result => {
        console.log(result);

        if (result.error) {
          setProgress(false);
          setErrMsg(result.error.message || '');
          return;
        }

        // Pitfall here: theoretically you can ask your
        // server to refresh the setup intent and
        // retrieve the payment method is attached to it.
        // However, the data fetched on server side might not updated in a timely manner
        // and the data retrieved via you own server
        // migh still be stale.
      })
      .catch(err => {
        setProgress(false);
        console.error(err);
        setErrMsg(err.toString());
      });
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <PaymentElement />

      <div className="text-end">
        <Button
          size="sm"
          variant="link"
          type="submit"
        >
          <LoadIndicator
            progress={progress}
            small={true}
          />
          保存
        </Button>
      </div>

    </form>
  );
}
