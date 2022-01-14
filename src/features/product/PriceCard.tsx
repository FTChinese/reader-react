import Card from 'react-bootstrap/Card';
import { MoneyParts } from '../../data/localization';
import { ShelfItemParams } from '../../data/product-shelf';
import styles from './PriceCard.module.css';

function PriceHighlight(
  props: {
    parts: MoneyParts;
  }
) {
  return (
    <>
      <span>{props.parts.symbol}</span>
      <span className={styles.price}>
        {props.parts.integer}{props.parts.decimal}
      </span>
    </>
  );
}

export function PriceCardBody(
  props: {
    params: ShelfItemParams;
  }
) {
  return (
    <Card.Body className="text-center">
      <div className={styles.title}>
        {props.params.title}
      </div>

      <div>
        <PriceHighlight parts={props.params.payable}/>
        {props.params.payable.cycle}
      </div>

      {
        props.params.crossed &&
        <div className={`text-muted ${styles.crossed}`}>
          原价
          <del>
            {props.params.crossed}
          </del>
        </div>
      }

      {
        props.params.offerDesc &&
        <div>
          <small>{props.params.offerDesc}</small>
        </div>
      }
    </Card.Body>
  );
}
