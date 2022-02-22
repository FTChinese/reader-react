import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { usePaymentSetting } from '../../components/hooks/usePaymentSetting';
import { ChevronRight } from '../../components/icons';
import { PaymentMethodDialog } from './PaymentMethodDialog';

export function PaymentMethodTitle() {

  const [ show, setShow ] = useState(false);
  const { paymentSetting } = usePaymentSetting();

  // When a method is selected to pay, close dialog.
  useEffect(() => {
    if (!paymentSetting.selectedMethod) {
      return;
    }
    setShow(false);
  }, [paymentSetting.selectedMethod?.id]);

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center"
      >
        <h6>支付方式</h6>

        <Button
          variant="link"
          size="sm"
          onClick={() => setShow(true)}
        >
          <span className="scale-down8">添加</span>
          <ChevronRight />
        </Button>
      </div>

      <PaymentMethodDialog
        show={show}
        onHide={() => setShow(false)}
      />
    </>
  );
}
