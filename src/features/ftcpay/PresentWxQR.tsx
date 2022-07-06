import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import { LeadIconButton } from '../../components/buttons/Buttons';
import { CircleLoader } from '../../components/progress/LoadIndicator';
import { ReaderPassport } from '../../data/account';
import { ConfirmationResult } from '../../data/order';
import { endpoint } from '../../repository/endpoint';
import { ResponseError } from '../../repository/response-error';
import { useFtcPay } from './useFtcPay';

export function PresentWxQR(
  props: {
    passport: ReaderPassport;
    orderId: string,
    qrCode: string,
    show: boolean;
    onHide: () => void;
    onConfirmed: (result: ConfirmationResult) => void;
  }
) {

  const [ err, setErr ] = useState('');

  const {
    progress,
    verifyPayment,
  } = useFtcPay();

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        微信扫码支付
      </Modal.Header>

      <Modal.Body>
        <div className="text-center">
          <img src={endpoint.qrSrc(props.qrCode)} />
        </div>

        {
          err &&
          <Alert
            variant="danger"
            dismissible
            onClose={() => setErr('')}
          >
            {err}
          </Alert>
        }
      </Modal.Body>

      <Modal.Footer>
        <LeadIconButton
          text={progress ? '正在验证，请稍候' : '支付完成？'}
          icon={
            <CircleLoader
              progress={progress}
            />
          }
          onClick={() => {
            verifyPayment({
                token: props.passport.token,
                orderId: props.orderId
              })
              .then(props.onConfirmed)
              .catch((err: ResponseError) => {
                setErr(err.message);
              });
          }}
          disabled={progress}
        />
      </Modal.Footer>
    </Modal>
  );
}
