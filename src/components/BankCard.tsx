import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { PlusCircle } from './graphics/icons';

export function BankCard(
  props: {
    brand: string;
    last4: string;
    expYear: number;
    expMonth: number;
  }
) {
  return (
    <Card>
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

export function CardColumn(
  props: {
    children: JSX.Element;
  }
) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-9 col-xl-8">
        {props.children}
      </div>
    </div>
  );
}

export function AddCardButton(
  props: {
    enabled: boolean;
    onClick: () => void;
  }
) {
  return (
    <Button
      disabled={!props.enabled}
      onClick={props.onClick}
      variant="outline-primary"
    >
      <PlusCircle/>
      <span className="ps-2">添加或选择默认支付方式</span>
    </Button>
  );
}
