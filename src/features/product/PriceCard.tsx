import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoneyParts } from '../../data/localization';
import {
  CartItemUIParams,
  CartItemFtc,
  newFtcCartItemUIParams,
  newStripeCartItemParams,
  CartItemStripe
} from '../../data/shopping-cart';
import { Customer } from '../../data/stripe';
import { useAuth } from '../../components/hooks/useAuth';
import { CustomerDialog } from './CustomerDialog';
import styles from './PriceCard.module.css';
import { isEmailAccount } from '../../data/account';
import { sitemap } from '../../data/sitemap';
import { useShoppingCart } from '../../components/hooks/useShoppingCart';

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
    params: CartItemUIParams;
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
    item: CartItemFtc
  }
) {

  const navigate = useNavigate();
  const { putFtcItem } = useShoppingCart();

  const handleClick = () => {
    putFtcItem(props.item);
    navigate(sitemap.checkout, { replace: false});
  }

  const params = newFtcCartItemUIParams(props.item)

  return (
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
  );
}

export function StripePriceCard(
  props: {
    item: CartItemStripe;
  }
) {

  const { passport } = useAuth();
  if (!passport) {
    return <></>;
  }

  const navigate = useNavigate();
  const { putStripeItem } = useShoppingCart();

  const [ showCustomer, setShowCustomer ] = useState(false);
  const params = newStripeCartItemParams(props.item);

  const putIntoCart = () => {
    putStripeItem(props.item);
    navigate(sitemap.checkout, { replace: false });
  };

  const handleClick = () => {
    if (isEmailAccount(passport)) {
      putIntoCart();
      return;
    }

    setShowCustomer(true);
  };

  // After customer created, show the got to checkout page.
  const customerCreated = (cus: Customer) => {
    console.log(cus);
    setShowCustomer(false);
    putIntoCart();
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
    </>
  );
}
