import Card from 'react-bootstrap/Card';
import { MoneyParts } from '../../data/localization';
import {
  ShelfItemParams,
  FtcShelfItem,
  newFtcShelfItemParams,
  newStripeShelfItemParams,
  StripeShelfItem
} from '../../data/product-shelf';
import { Customer } from '../../data/stripe';
import { useAuthContext } from '../../store/AuthContext';
import { AliWxPay } from './AliWxPay';
import { CustomerDialog } from './CustomerDialog';
import { PaymentDialog } from './PaymentDialog';
import { StripePay } from './StripePay';
import styles from './PriceCard.module.css';
import { useState } from 'react';
import { isEmailAccount } from '../../data/account';

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

/**
 * @description PriceCardBody displays a price in a card.
 * It is used in multiple places:
 * - In product card
 * - In payment dialog
 */
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

export function FtcPriceCard(
  props: {
    item: FtcShelfItem
  }
) {

  const [ show, setShow ] = useState(false);


  const params = newFtcShelfItemParams(props.item)

  return (
    <>
      <Card
        className={`h-100 ${styles.itemCard}`}
        onClick={() => setShow(true)}
      >
        {
          params.header &&
          <Card.Header>
            {params.header}
          </Card.Header>
        }

        <PriceCardBody params={params} />
      </Card>

      <PaymentDialog
        show={show}
        onHide={() => setShow(false)}
        tier={props.item.price.tier}
        params={params}
      >
        <AliWxPay
          item={props.item}
        />
      </PaymentDialog>
    </>
  );
}

export function StripePriceCard(
  props: {
    item: StripeShelfItem;
  }
) {

  const { passport } = useAuthContext();
  if (!passport) {
    return <></>;
  }

  const [ showPay, setShowPay ] = useState(false);
  const [ showCustomer, setShowCustomer ] = useState(false);
  const params = newStripeShelfItemParams(props.item);

  const handleClick = () => {
    if (isEmailAccount(passport)) {
      setShowPay(true);
      return;
    }

    setShowCustomer(true);
  };

  // After customer created, show the pay dialog.
  const customerCreated = (cus: Customer) => {
    console.log(cus);
    setShowCustomer(false);
    setShowPay(true);
  };

  return (
    <>
      <Card
        className={`h-100 ${styles.itemCard}`}
        onClick={handleClick}
      >
        {
          params.header &&
          <Card.Header>
            {params.header}
          </Card.Header>
        }

        <PriceCardBody params={params} />
      </Card>

      <CustomerDialog
        passport={passport}
        show={showCustomer}
        onHide={() => setShowCustomer(false)}
        onCreated={customerCreated}
      />
      <PaymentDialog
        show={showPay}
        onHide={() => setShowPay(false)}
        tier={props.item.recurring.tier}
        params={params}
      >
        <StripePay
          item={props.item}
        />
      </PaymentDialog>
    </>
  );
}
