import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ProgressButton } from '../../components/buttons/ProgressButton';
import { ErrorBoudary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { ReaderPassport } from '../../data/account';
import { StripeShelfItem } from '../../data/product-shelf';
import { loadStripePubKey } from '../../repository/stripe';
import { useAuthContext } from '../../store/AuthContext';
import { OnCustomerUpsert } from '../account/OnAccountUpdated';

const stripePromise = loadStripePubKey()
  .then(pk => {
    console.log('Initializing Stripe...');
    return loadStripe(pk.key);
  });

/**
 * @description Handles Stripe pay actions.
 * Embedded in the PayentDialog.
 * @see https://stripe.com/docs/billing/subscriptions/build-subscription
 * https://stripe.com/docs/stripe-js/react
 */
export function StripePay(
  props: {
    item: StripeShelfItem;
  }
) {
  const { passport } = useAuthContext();
  if (!passport) {
    return <></>;
  }

  const [ err, setErr ] = useState('');
  const [ progress, setProgress ] = useState(true);

  return (
    <Elements stripe={stripePromise}>

    </Elements>
  );
}

/**
 * @description Show a dialog to ask user to create stripe customer.
 * @todo Actually create customer.
 */
export function CustomerDialog(
  props: {
    passport: ReaderPassport;
    show: boolean;
    onHide: () => void;
    onCreated: OnCustomerUpsert;
  }
) {

  const [ progress, setProgress ] = useState(false);

  const createCustomer = () => {
    props.onCreated({
      id: 'cus_mock',
      ftcId: 'user-id',
      created: 123456789,
      email: 'demo@example.org',
      liveMode: false,
    });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>
        注册Stripe用户
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Stripe支付要求提供邮箱地址，是否使用当前邮箱注册（{props.passport.email}）？
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary"
          onClick={props.onHide}
        >
          否
        </button>
        <ProgressButton
          disabled={progress}
          text="是"
          isSubmitting={progress}
          inline={true}
          onClick={createCustomer}
        />
      </Modal.Footer>
    </Modal>
  );
}
