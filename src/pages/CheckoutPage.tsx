import { CenterColumn } from '../components/layout/Column';
import { Tier } from '../data/enum';
import { localizeTier } from '../data/localization';
import { CartItemUIParams, cartItemUiOfFtc, CartItemStripe } from '../data/shopping-cart';
import { AliWxPay } from '../features/checkout/AliWxPay';
import { PriceCard } from '../features/product/PriceCard';
import { useShoppingCart } from '../components/hooks/useShoppingCart';
import { useAuth } from '../components/hooks/useAuth';
import { RequireStripeCustomer } from '../components/routes/RequireStripeCustomer';
import { ReaderPassport } from '../data/account';
import { StripePayScreen } from '../features/stripepay/StripePayScreen';
import { useStripeSubs } from '../features/stripepay/useStripeSubs';
import { useEffect, useState } from 'react';
import { ResponseError } from '../repository/response-error';
import { toast } from 'react-toastify';
import { Membership } from '../data/membership';
import { useStripePaySetting } from '../components/hooks/useStripePaySetting';
import { PaymentMethodDialog } from '../features/stripesetup/PaymentMethodDialog';
import { SetupUsage } from '../store/stripeSetupSession';

function ChekcoutLayout(
  props: {
    tier: Tier,
    params: CartItemUIParams,
    children: JSX.Element,
  }
) {
  return (
    <CenterColumn>
      <>
        <h2 className="text-center mb-3">
          订阅{localizeTier(props.tier)}
        </h2>

        <PriceCard
          params={props.params}
        />

        {props.children}
      </>
    </CenterColumn>
  );
}

/**
 * @description Perform checkout part of the payment flow.
 * There are multiple entries to this page:
 * - When user clicked an item in ProductCard;
 * - After a new stripe payment method is added and user is redirected here.
 */
export function CheckoutPage() {
  const { passport, setMembership } = useAuth();
  const { cart } = useShoppingCart();

  if (!passport) {
    return null;
  }

  if (cart.ftc) {
    return (
      <ChekcoutLayout
        tier={cart.ftc.price.tier}
        params={cartItemUiOfFtc(cart.ftc)}
      >
        <AliWxPay
          item={cart.ftc}
        />
      </ChekcoutLayout>
    )
  } else if (cart.stripe) {
    return (
      <RequireStripeCustomer>
        <StripePageScreen
          item={cart.stripe}
          passport={passport}
          onSuccess={(m) => {
            setMembership(m);
          }}
        />
      </RequireStripeCustomer>
    );
  } else {
    return <div>Empty shopping cart</div>;
  }
}

function StripePageScreen(
  props: {
    item: CartItemStripe;
    passport: ReaderPassport;
    onSuccess: (m: Membership) => void;
  }
) {

  const [show, setShow] = useState(false);

  const {
    submitting,
    subsCreated,
    subscribe,
  } = useStripeSubs();

  const {
    defaultPayMethod,
    selectedPayMethod,
    loadDefaultPaymentMethod,
  } = useStripePaySetting();

  useEffect(() => {
    loadDefaultPaymentMethod(props.passport);
  }, []);

  const payMethodInUse = selectedPayMethod || defaultPayMethod;

  return (
    <>
      <StripePayScreen
        cartItem={props.item}
        submitting={submitting}
        paymentMethod={payMethodInUse}
        subs={subsCreated}
        onPaymentMethod={() => setShow(true)}
        onSubscribe={() => {
          if (!payMethodInUse) {
            toast.error('No payment method selected');
            return;
          }

          subscribe(props.passport, props.item, payMethodInUse)
            .then(m => {
              props.onSuccess(m);
            })
            .catch((err: ResponseError) => {
              toast.error(err.message);
            });
        }}
      />

      <PaymentMethodDialog
        show={show}
        passport={props.passport}
        onHide={() => setShow(false)}
        usage={SetupUsage.PayNow}
      />
    </>

  );
}
