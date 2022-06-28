import { CheckLarge } from '../../components/graphics/icons';
import { PaymentMethod } from '../../data/stripe';
import { useStripePaySetting } from '../../components/hooks/useStripePaySetting';

export function BankCardRow(
  props: {
    paymentMethod: PaymentMethod;
    border?: boolean;
    showDefault?: boolean;
    selectable?: boolean;
  }
) {

  const { paymentSetting, selectPaymentMethod } = useStripePaySetting();

  const card = props.paymentMethod.card;

  const handleSelect = () => {
    if (!props.selectable) {
      return;
    }
    selectPaymentMethod(props.paymentMethod);
  };

  let className = 'd-flex align-items-center pt-1 pb-1';
  if (props.border) {
    className += ' border-bottom';
  }

  const showDefault = !!props.showDefault && (props.paymentMethod.id === paymentSetting.defaultMethod?.id);

  const showCheck = !!props.selectable && (props.paymentMethod.id === paymentSetting.selectedMethod?.id);

  return (
    <div className={className}>
      <div className="flex-grow-1"
        onClick={handleSelect}
      >
        <div>
          <span className="me-2">
            {card.brand.toUpperCase()}
          </span>
          <span>
            **** {card.last4}
          </span>
          {
             showDefault && <DefaultIndicator />
          }
        </div>
        <div className="text-black60 scale-down8">
          <span className="me-2">到期日</span>
          <span>{card.expYear}/{card.expMonth}</span>
        </div>
      </div>

      <div className="text-teal">
        {
          showCheck &&
          <CheckLarge />
        }
      </div>
    </div>
  );
}

function DefaultIndicator() {
  return (
    <span className="ms-2 text-black40 scale-down5">(默认支付)</span>
  );
}
