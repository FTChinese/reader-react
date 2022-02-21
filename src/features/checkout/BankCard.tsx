import { useRecoilState } from 'recoil';
import { CheckLarge } from '../../components/icons';
import { PaymentMethod } from '../../data/stripe';
import { paymentMethodState } from '../../store/recoilState';

export function BankCard(
  props: {
    paymentMethod: PaymentMethod;
  }
) {

  const [ defaultPM, setDefaultPM ] = useRecoilState(paymentMethodState);

  const card = props.paymentMethod.card;

  const handleClick = () => {
    setDefaultPM(props.paymentMethod);
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
          (defaultPM.id === props.paymentMethod.id) &&
          <CheckLarge />
        }
      </div>
    </div>
  );
}
