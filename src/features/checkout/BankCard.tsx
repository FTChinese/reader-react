import { CheckLarge } from '../../components/icons';
import { PaymentMethod } from '../../data/stripe';
import { usePaymentSetting } from '../../components/hooks/usePaymentSetting';

export function BankCard(
  props: {
    paymentMethod: PaymentMethod;
  }
) {

  const { paymentSetting, selectPaymentMethod } = usePaymentSetting();

  const card = props.paymentMethod.card;

  const handleClick = () => {
    selectPaymentMethod(props.paymentMethod);
  };

  return (
    <div className="d-flex align-items-center border-bottom pt-1 pb-1">
      <div className="flex-grow-1"
        onClick={handleClick}
      >
        <div>
          <span className="me-2">
            {card.brand.toUpperCase()}
          </span>
          <span>
            **** {card.last4}
          </span>
        </div>
        <div className="text-muted">
          <span className="me-2">到期日</span>
          <span>{card.expYear}/{card.expMonth}</span>
        </div>
      </div>

      <div className="text-success">
        {
          (props.paymentMethod.id === paymentSetting.selectedMethod?.id) &&
          <CheckLarge />
        }
      </div>
    </div>
  );
}
