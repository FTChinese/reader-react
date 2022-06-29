import Card from 'react-bootstrap/Card';

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

