import Modal from 'react-bootstrap/Modal';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { SetupPaymentMethod } from './SetupPaymentMethod';
import { CustomerPaymentMethods } from './CustomerPaymentMethods';
import { SetupUsage } from '../../store/stripeSetupSession';
import { ReaderPassport } from '../../data/account';
import { PaymentMethod } from '../../data/stripe';

export function PaymentMethodDialog(
  props: {
    show: boolean;
    passport: ReaderPassport;
    onHide: () => void;
    onMethodSelected: (method: PaymentMethod) => void;
  }
) {

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>选择或添加支付方式</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <CustomerPaymentMethods
              passport={props.passport}
              selectable={true}
            />
            <SetupPaymentMethod
              passport={props.passport}
              usage={SetupUsage.PayNow}
            />
          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}






