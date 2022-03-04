import Modal from 'react-bootstrap/Modal';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { useAuth } from '../../components/hooks/useAuth';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { SetupPaymentMethod } from './SetupPaymentMethod';
import { CustomerPaymentMethods } from './CustomerPaymentMethods';
import { SetupUsage } from '../../store/stripeSetupSession';

export function PaymentMethodDialog(
  props: {
    title: string;
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
          {props.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <CustomerPaymentMethods
              passport={passport}
              selectable={true}
            />
            <SetupPaymentMethod
              passport={passport}
              usage={SetupUsage.PayNow}
            />
          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}






