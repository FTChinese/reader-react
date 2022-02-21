import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { ProgressButton } from '../../components/buttons/ProgressButton';
import { ReaderPassport } from '../../data/account';
import { ResponseError } from '../../repository/response-error';
import { createCustomer } from '../../repository/stripe';
import { useAuth } from '../../store/useAuth';
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

  const { setCustomerId } = useAuth();
  const [progress, setProgress] = useState(false);

  const handleClick = () => {
    setProgress(true);

    createCustomer(props.passport.token)
      .then(cus => {
        console.log('Stripe customer created');
        setProgress(false);
        setCustomerId(cus.id);
        props.onCreated(cus);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        toast.error(err.toString());
      })
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
          onClick={handleClick} />
      </Modal.Footer>
    </Modal>
  );
}
