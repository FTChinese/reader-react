import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ProgressButton } from '../../components/buttons/ProgressButton';
import { ReaderPassport } from '../../data/account';
import { OnCustomerUpsert } from '../account/OnAccountUpdated';

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

  const [progress, setProgress] = useState(false);

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
          onClick={createCustomer} />
      </Modal.Footer>
    </Modal>
  );
}
