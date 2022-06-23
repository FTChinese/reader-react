import Card from 'react-bootstrap/Card';
import { BaseButton } from './buttons/Button';
import { PlusCircle } from './graphics/icons';

export function BankCard(
  props: {
    brand: string;
    last4: string;
    expYear: number;
    expMonth: number;
  }
) {
  const style = {
    width: '20em',
  };

  return (
    <Card className="mt-3 mb-3" style={style}>
      <Card.Body>
        <Card.Title>
          {props.brand}
        </Card.Title>
        <div className="pt-3">
          <span>**** **** ****</span>
          <span className="fs-4 ps-2">{props.last4}</span>
        </div>
        <div className="text-black60 scale-down8">
          <span>{props.expYear}/{props.expMonth}</span>
        </div>
      </Card.Body>
    </Card>
  );
}

export function AddBankCard(
  props: {
    enabled: boolean;
    onClick: () => void;
  }
) {
  return (
    <BaseButton
      disabled={!props.enabled}
      onClick={props.onClick}
    >
      <>
        <PlusCircle/>
        <span className="pe-2">添加或选择默认支付方式</span>
      </>
    </BaseButton>
  );
}
