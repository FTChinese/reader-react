import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useRecoilValue } from 'recoil';
import { ImageRatio } from '../../components/graphics/ImageRatio';
import { TextLines } from '../../components/list/TextLines';
import { ReaderPassport, isEmailAccount } from '../../data/account';
import { Membership } from '../../data/membership';
import { Banner, isPromoValid, Paywall, PaywallProduct, productDesc } from '../../data/paywall';
import {
  FtcShelfItem,
  StripeShelfItem,
  buildFtcShelfItems,
  ShelfItemParams,
  newFtcShelfItemParams,
  newStripeShelfItemParams,
  buildStripeShelfItems,
} from '../../data/product-shelf';
import { stripePricesState } from '../../store/useStripePrices';
import styles from './ProductCard.module.css';
import { PriceCardBody } from './PriceCard';
import { PaymentDialog } from './PaymentDialog';
import { AliWxPay } from './AliWxPay';
import { CustomerDialog, StripePay } from './StripePay';
import { useAuthContext } from '../../store/AuthContext';
import { OnCustomerUpsert } from '../account/OnAccountUpdated';
import { Customer } from '../../data/stripe';

export function PaywallContent(
  props: {
    passport: ReaderPassport,
    paywall: Paywall;
  }
) {
  const banner = isPromoValid(props.paywall.promo)
    ? props.paywall.promo
    : props.paywall.banner;

  return (
    <div className="mt-3">
      <PaywallBanner
        banner={banner}
      />
      <div className="mt-3">
        {
          props.paywall.products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              member={props.passport.membership}
            />
          ))
        }
      </div>
    </div>
  );
}

function PaywallBanner(
  props: {
    banner: Banner;
  }
) {
  return (
    <div className="row flex-row-reverse">
      <div className="col-sm-4">
        <ImageRatio
          src={props.banner.coverUrl}
        />
      </div>

      <div className="col-sm-8">
        <h2>{props.banner.heading}</h2>
        <h3>{props.banner.subHeading}</h3>
        <div>{props.banner.content}</div>
      </div>
    </div>
  );
}

function ProductCard(
  props: {
    product: PaywallProduct;
    member: Membership;
  }
) {

  const ftcItems = buildFtcShelfItems(props.product, props.member);

  const [ stripeItems, setStripeItems ] = useState<StripeShelfItem[]>();

  const stripePrices = useRecoilValue(stripePricesState);

  useEffect(() => {
    if (stripePrices.size === 0) {
      return;
    }

    setStripeItems(buildStripeShelfItems({
      product: props.product,
      m: props.member,
      prices: stripePrices,
    }));

  }, [stripePrices.size]);

  return (
    <div className="h-100 p-3">
      <h5 className="text-center mb-3 pb-3 border-bottom">
        {props.product.heading}
      </h5>

      <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-3 mt-3">
        {ftcItems.map((item, i) => (
          <div className="col mb-3" key={i}>
            <FtcPriceCard item={item} />
          </div>
        ))}
      </div>

      <div className="row row-cols-1 row-cols-xl-2">
        { stripeItems &&
          stripeItems.map((item, i) => (
            <div className="col mb-3" key={i}>
              <StripePriceCard item={item}/>
            </div>
          ))
        }
      </div>

      <small className="text-muted">
        * 自动续订通过<a href="https://stripe.com/" target="_blank">Stripe</a>支付，以英镑计价，需使用支持国际货币的信用卡
      </small>

      <TextLines
        lines={productDesc(props.product)}
        className="mt-3"
      />

      <small className="text-muted">
        {props.product.smallPrint}
      </small>
    </div>
  );
}

function FtcPriceCard(
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
        <PriceCard params={newFtcShelfItemParams(props.item)}/>
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

function StripePriceCard(
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
        <PriceCard params={params}/>
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

function PriceCard(
  props: {
    params: ShelfItemParams;
  }
) {
  return (
    <>
      {
        props.params.header &&
        <Card.Header>
          {props.params.header}
        </Card.Header>
      }

      <PriceCardBody params={props.params} />
    </>
  );
}


