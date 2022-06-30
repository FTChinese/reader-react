import { CheckLarge } from '../../components/graphics/icons';
import { StripePayMethod } from '../../data/stripe';

export function BankCardRow(
  props: {
    paymentMethod: StripePayMethod;
    selected: boolean;
    isDefault: boolean;
    onSelect: () => void;
  }
) {

  const card = props.paymentMethod.card;

  return (
    <div className="d-flex align-items-center pt-1 pb-1 border-bottom">
      <div className="flex-grow-1"
        onClick={props.onSelect}
      >
        <div>
          <span className="me-2">
            {card.brand.toUpperCase()}
          </span>
          <span>
            **** {card.last4}
          </span>
          {
             props.isDefault && <DefaultIndicator />
          }
        </div>
        <div className="text-black60 scale-down8">
          <span className="me-2">到期日</span>
          <span>{card.expYear}/{card.expMonth}</span>
        </div>
      </div>

      <div className="text-teal">
        {
          props.selected &&
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
