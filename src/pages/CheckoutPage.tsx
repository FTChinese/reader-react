import { SingleCenterCol } from '../components/layout/ContentLayout';
import { Tier } from '../data/enum';
import { localizeTier } from '../data/localization';
import { CartItemUIParams, newFtcCartItemUIParams, newStripeCartItemParams } from '../data/shopping-cart';
import { AliWxPay } from '../features/checkout/AliWxPay';
import { PriceCard } from '../features/product/PriceCard';
import { useShoppingCart } from '../components/hooks/useShoppingCart';
import { StripePay } from '../features/checkout/StripePay';
import { useAuth } from '../components/hooks/useAuth';
import { RequireStripeCustomer } from '../components/routes/RequireStripeCustomer';

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
        <h2 className="text-center mb-3">
          订阅{localizeTier(props.tier)}
        </h2>

        <PriceCard
          params={props.params}
        />

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
  const { passport } = useAuth();
  const { cart } = useShoppingCart();

  if (!passport) {
    return null;
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
      <RequireStripeCustomer>
        <ChekcoutLayout
          tier={cart.stripe.recurring.tier}
          params={newStripeCartItemParams(cart.stripe)}
        >
          <StripePay
            item={cart.stripe}
          />
        </ChekcoutLayout>
      </RequireStripeCustomer>
    );
  } else {
    return <div>Empty shopping cart</div>;
  }
}


