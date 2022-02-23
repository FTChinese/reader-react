import Card from 'react-bootstrap/Card';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { Tier } from '../data/enum';
import { localizeSubsStatus, localizeTier } from '../data/localization';
import { CartItemUIParams, newFtcCartItemUIParams, newStripeCartItemParams } from '../data/shopping-cart';
import { AliWxPay } from '../features/checkout/AliWxPay';
import { PriceCardBody } from '../features/product/PriceCard';
import { useShoppingCart } from '../components/hooks/useShoppingCart';
import { useState } from 'react';
import { Subs } from '../data/stripe';
import { Link } from 'react-router-dom';
import { DescriptionList } from '../components/list/DescriptionList';
import { StringPair } from '../data/pair';
import { sitemap } from '../data/sitemap';
import { StripePay } from '../features/checkout/StripePay';

function ChekcoutLayout(
  props: {
    tier: Tier,
    params: CartItemUIParams,
    children: JSX.Element,
  }
) {
  return (
    <SingleCenterCol>
      <>
        <h2 className="text-center mb-3">订阅FT会员</h2>

        <Card>
          <Card.Header>
            {localizeTier(props.tier)}
          </Card.Header>

          <PriceCardBody
            params={props.params}
          />
        </Card>
        {props.children}
      </>
    </SingleCenterCol>
  );
}

export function CheckoutPage() {
  const { cart, clearCart } = useShoppingCart();
  const [ subs, setSubs ] = useState<Subs>();

  const handleSuccess = (subs: Subs) => {
    setSubs(subs);
    clearCart();
  };

  if (subs) {
    return (
      <div className="mt-3">
        <h5 className="text-center">{localizeTier(subs.tier)}订阅成功</h5>
        <StripeSubsDetails subs={subs}/>
      </div>
    )
  }

  if (cart.ftc) {
    return (
      <ChekcoutLayout
        tier={cart.ftc.price.tier}
        params={newFtcCartItemUIParams(cart.ftc)}
      >
        <AliWxPay
          item={cart.ftc}
        />
      </ChekcoutLayout>
    )
  } else if (cart.stripe) {
    return (
      <ChekcoutLayout
        tier={cart.stripe.recurring.tier}
        params={newStripeCartItemParams(cart.stripe)}
      >
        <StripePay
          item={cart.stripe}
          onSuccess={handleSuccess}
        />
      </ChekcoutLayout>
    );
  } else {
    return <div>Empty shopping cart</div>;
  }
}

/**
 * @description Show details of subscription after success.
 */
function StripeSubsDetails(
  props: {
    subs: Subs,
  }
) {

  const rows: StringPair[] = [
    ['本周期开始时间', `${props.subs.currentPeriodStart}`],
    ['本周期结束时间', props.subs.currentPeriodEnd],
    ['订阅状态', localizeSubsStatus(props.subs.status)]
  ];

  return (
    <>
      <DescriptionList rows={rows}/>
      <p className="scale-down8 text-muted">*周期结束时将自动续订</p>
      <div className="text-center">
        <Link to={sitemap.membership}>返回</Link>
      </div>
    </>
  )
}
