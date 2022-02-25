import { CheckLarge } from '../../components/icons';
import { PaymentMethod } from '../../data/stripe';
import { useStripePaySetting } from '../../components/hooks/useStripePaySetting';

export function BankCard(
  props: {
    paymentMethod: PaymentMethod;
    border?: boolean
  }
) {

  const { paymentSetting, selectPaymentMethod } = useStripePaySetting();

  const card = props.paymentMethod.card;

  const handleClick = () => {
    selectPaymentMethod(props.paymentMethod);
  };

  let className = 'd-flex align-items-center pt-1 pb-1';
  if (props.border) {
    className += ' border-bottom';
  }

  return (
    <div className={className}>
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
        <div className="text-black60 scale-down8">
          <span className="me-2">到期日</span>
          <span>{card.expYear}/{card.expMonth}</span>
        </div>
      </div>

      <div className="text-teal">
        {
          (props.paymentMethod.id === paymentSetting.selectedMethod?.id) &&
          <CheckLarge />
        }
      </div>
    </div>
  );
}
