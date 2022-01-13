import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useRecoilValue } from 'recoil';
import { ImageRatio } from '../../components/graphics/ImageRatio';
import { TextLines } from '../../components/list/TextLines';
import { ReaderPassport } from '../../data/account';
import { FtcShelfItem } from '../../data/ftc-price';
import { localizeCycle, MoneyParts } from '../../data/localization';
import { Membership } from '../../data/membership';
import { Banner, collectStripePriceIDs, ftcShelfItemParams, ftcShelfItems, isPromoValid, Paywall, PaywallProduct, productDesc, ShelfItemParams, stripeShelfItemParams } from '../../data/paywall';
import { cycleOfYMD } from '../../data/period';
import { StripeShelfItem } from '../../data/stripe-price';
import { stripePricesState } from '../../store/useStripePrices';
import styles from './ProductCard.module.css';

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

  const ftcItems = ftcShelfItems(props.product, props.member);

  const [ stripeItems, setStripeItems ] = useState<StripeShelfItem[]>();

  const stripePrices = useRecoilValue(stripePricesState);

  useEffect(() => {
    if (stripePrices.size === 0) {
      return;
    }

    const ids = collectStripePriceIDs(props.product);
    const trial = ids.trial
      ? stripePrices.get(ids.trial)
      : undefined;

    const items: StripeShelfItem[] = [];

    for (const id of ids.recurrings) {
      const p = stripePrices.get(id);
      if (p) {
        items.push({
          recurring: p,
          trial,
        });
      } else {
        console.error('Stripe price %s missing', id)
      }
    }

    setStripeItems(items);
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

  return (
    <Card className={`h-100 ${styles.itemCard}`}>
      <PriceCard params={ftcShelfItemParams(props.item)}/>
    </Card>
  );
}

function StripePriceCard(
  props: {
    item: StripeShelfItem;
  }
) {

  return (
    <Card
      className={`h-100 ${styles.itemCard}`}
      onClick={() => console.log(props.item)}
    >
      <PriceCard params={stripeShelfItemParams(props.item)}/>
    </Card>
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

      <Card.Body className="text-center">
        <div className={styles.title}>
          {props.params.title}
        </div>

        <div>
          <PriceHighlighted parts={props.params.payable}/>
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
    </>
  );
}



function PriceHighlighted(
  props: {
    parts: MoneyParts;
  }
) {
  return (
    <>
      <span>{props.parts.symbol}</span>
      <span className={styles.large}>
        {props.parts.integer}{props.parts.decimal}
      </span>
    </>
  );
}



