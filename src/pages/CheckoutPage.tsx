import Card from 'react-bootstrap/Card';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { Tier } from '../data/enum';
import { localizeTier } from '../data/localization';
import { CartItemUIParams, newFtcCartItemUIParams, newStripeCartItemParams } from '../data/shopping-cart';
import { AliWxPay } from '../features/checkout/AliWxPay';
import { PriceCardBody } from '../features/product/PriceCard';
import { useShoppingCart } from '../components/hooks/useShoppingCart';
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
            {props.params.header}
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

/**
 * @description Perform checkout part of the payment flow.
 * There are multiple entries to this page:
 * - When user clicked an item in ProductCard;
 * - After a new stripe payment method is added and user is redirected here.
 */
export function CheckoutPage() {
  const { cart } = useShoppingCart();

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
        />
      </ChekcoutLayout>
    );
  } else {
    return <div>Empty shopping cart</div>;
  }
}


