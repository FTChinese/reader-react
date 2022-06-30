import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState, SyntheticEvent } from 'react';
import Alert from 'react-bootstrap/Alert';
import { stripeSetupCbUrl } from '../../data/sitemap';
import { SetupUsage, stripeSetupSession } from '../../store/stripeSetupSession';
import { SetupIntent } from '../../data/stripe';
import { SubmitButton } from '../../components/controls/SubmitButton';
import { ReaderPassport } from '../../data/account';
import { StripeContext } from './StripeContext';
import { toast } from 'react-toastify';
import { ResponseError } from '../../repository/response-error';
import { Flex } from '../../components/layout/Flex';
import { CircleLoader } from '../../components/progress/LoadIndicator';
import { Loading } from '../../components/progress/Loading';
import { StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { LeadIconButton } from '../../components/buttons/Buttons';
import { useStripeSetup } from '../../components/hooks/useStripeSetup';

export function SetupPaymentMethod(
  props: {
    passport: ReaderPassport;
    usage: SetupUsage;
  },
) {

  const {
    progress,
    setupIntent,
    createSetupIntent
  } = useStripeSetup();

  // Handle clicking add payment method button.
  // To add a new payment method for future use,
  // you have to ask Stripe to create a setup intent.
  return (
    <div className="mb-3">
      <Flex justify="end">
        <LeadIconButton
          disabled={progress || !!setupIntent?.id}
          text="添加新卡片"
          onClick={() => {
            createSetupIntent(props.passport)
              .catch((err: ResponseError) => {
                toast.error(err.message);
              })
          }}
          icon={
            <CircleLoader progress={progress} />
          }
        />
      </Flex>

      {
        // As long as there's a setup intent exsits, display
        // the form.
        setupIntent &&
        <StripeContext
          secret={setupIntent.clientSecret}
        >
            <PaymentMethodForm
              setupIntent={setupIntent}
              usage={props.usage}
            />
        </StripeContext>
      }
    </div>
  );
}

/**
 * @description Show Stripe's PaymentElement to collect payment method.
 * Once done, you will be redirecti to the return_url.
 * @todo SetupIntent might be used upon subscription, or simply
 * adding payment method fore future useage. We should
 * distinguish their usage after redirection.
 */
function PaymentMethodForm(
  props: {
    setupIntent: SetupIntent;
    usage: SetupUsage;
  }
) {

  const stripe = useStripe();
  const elements = useElements();

  const [ progress, setProgress ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ complete, setComplete ] = useState(false);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe.js not loaded');
      return;
    }

    setErrMsg('');
    setProgress(true);

    // Save session to be used after redirect.
    stripeSetupSession.save(props.setupIntent, props.usage);

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

  const handleChange = (event: StripePaymentElementChangeEvent) => {
    if (event.complete) {
      setComplete(true);
    }
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

      <PaymentElement
        onReady={() => setLoading(false)}
        onChange={handleChange}
      />

      <Loading loading={loading}>
        <div className="text-end">
          <SubmitButton
            text="保存"
            disabled={!complete || progress}
            progress={progress}
          />
        </div>
      </Loading>

    </form>
  );
}





