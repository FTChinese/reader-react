import { CheckLarge } from '../../components/graphics/icons';
import { PaymentKind, paymentMethodIcons } from '../../data/enum';

export function FtcPaymentMethods(
  props: {
    selected?: PaymentKind;
    onSelect: (method: PaymentKind) => void
  }
) {

  const oneOffMethods: PaymentKind[] = ['alipay', 'wechat'];

  return (
    <div className="mb-3">
      <h6>选择支付方式</h6>
      {
        oneOffMethods.map(method =>
          <OneOffPayMethodItem
            key={method}
            method={method}
            selected={props.selected === method}
            onClick={() => props.onSelect(method)}
          />
        )
      }
    </div>
  );
}

function OneOffPayMethodItem(
  props: {
    method: PaymentKind;
    selected: boolean;
    onClick: () => void
  }
) {
  return (
    <div className="d-flex align-items-center pt-2 pb-2 border-bottom">
      <div className="flex-grow-1 cursor-pointer"
        onClick={props.onClick}
      >
        <img src={paymentMethodIcons[props.method]} />
      </div>
      <div className="text-teal">
        {
          props.selected &&
          <CheckLarge/>
        }
      </div>
    </div>
  );
}
