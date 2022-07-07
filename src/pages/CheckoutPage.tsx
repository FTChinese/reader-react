import { PaymentKind } from '../data/enum';
import { newOrderParams } from '../data/shopping-cart';
import { useShoppingCart } from '../components/hooks/useShoppingCart';
import { useAuth } from '../components/hooks/useAuth';
import { RequireStripeCustomer } from '../components/routes/RequireStripeCustomer';
import { isTestAccount, ReaderPassport } from '../data/account';
import { StripePayScreen } from '../features/stripepay/StripePayScreen';
import { useStripeSubs } from '../features/stripepay/useStripeSubs';
import { useEffect, useState } from 'react';
import { ResponseError } from '../repository/response-error';
import { toast } from 'react-toastify';
import { Membership } from '../data/membership';
import { useStripePaySetting } from '../components/hooks/useStripePaySetting';
import { PaymentMethodDialog } from '../features/stripesetup/PaymentMethodDialog';
import { SetupUsage } from '../store/stripeSetupSession';
import { useFtcPay } from '../features/ftcpay/useFtcPay';
import { FtcPayScreen } from '../features/ftcpay/FtcPayScreen';
import { ConfirmationResult, WxPayIntent } from '../data/order';
import { alipayCallback } from '../data/sitemap';
import { aliwxPaySession } from '../store/aliwxPaySession';
import { PresentWxQR } from '../features/ftcpay/PresentWxQR';
import { CartItemFtc, CartItemStripe } from '../data/paywall-product';


/**
 * @description Perform checkout part of the payment flow.
 * There are multiple entries to this page:
 * - When user clicked an item in ProductCard;
 * - After a new stripe payment method is added and user is redirected here.
 */
export function CheckoutPage(
  props: {
    liveMode: boolean;
  }
) {
  const { passport, setMembership } = useAuth();
  const { cart } = useShoppingCart();

  if (!passport) {
    return null;
  }

  if (cart.ftc) {
    return (
      <FtcPayPageScreen
        item={cart.ftc}
        passport={passport}
        onSuccess={setMembership}
      />
    );
  } else if (cart.stripe) {
    return (
      <RequireStripeCustomer>
        <StripePageScreen
          liveMode={props.liveMode}
          item={cart.stripe}
          passport={passport}
          onSuccess={setMembership}
        />
      </RequireStripeCustomer>
    );
  } else {
    return <div>Empty shopping cart</div>;
  }
}

function StripePageScreen(
  props: {
    liveMode: boolean;
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

  const onSubscribe = () => {
    if (!payMethodInUse) {
      toast.error('No payment method selected');
      return;
    }

    if (!props.liveMode) {
      if (!isTestAccount(props.passport)) {
        toast.error('Only test accounts are permitted');
        return;
      }
    }

    subscribe(props.passport, props.item, payMethodInUse)
      .then(m => {
        props.onSuccess(m);
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <StripePayScreen
        cartItem={props.item}
        submitting={submitting}
        paymentMethod={payMethodInUse}
        subs={subsCreated}
        onPaymentMethod={() => setShow(true)}
        onSubscribe={onSubscribe}
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

function FtcPayPageScreen(
  props: {
    item: CartItemFtc;
    passport: ReaderPassport;
    onSuccess: (m: Membership) => void;
  }
) {

  const [ confirmed, setConfirmed ] = useState<ConfirmationResult | undefined>();
  const [ wxQrIntent, setWxQrIntent ] = useState<WxPayIntent | undefined>();

  const {
    progress,
    createWxOrder,
    createAliOrder,
  } = useFtcPay();

  const handlePayment = (payMethod: PaymentKind) => {
    switch (payMethod) {
      case 'alipay':
        createAliOrder(
            props.passport.token,
            {
              ...newOrderParams(props.item),
              returnUrl: alipayCallback(document.location.origin)
            }
          )
          .then(redirectUrl => {
            window.location.href = redirectUrl;
            // After payment finished, user will
            // be redirected back to /callback/alipay.
          })
          .catch((err: ResponseError) => {
            toast.error(err.message);
          });
        break;

      case 'wechat':
        createWxOrder(
            props.passport.token,
            newOrderParams(props.item)
          )
          .then(pi => {
            if (pi.params.desktopQr) {
              console.log(pi);
              setWxQrIntent(pi);
              return;
            }

            if (pi.params.mobileRedirect) {
              aliwxPaySession.save(pi.order);
              // Then where it should go?
              window.location.href = pi.params.mobileRedirect;
              return;
            }
          })
          .catch((err: ResponseError) => {
            toast.error(err.message);
          });
        break;
    }
  };

  return (
    <>
      <FtcPayScreen
        cartItem={props.item}
        submitting={progress}
        onClickPay={handlePayment}
        confirmed={confirmed}
      />

      {
        wxQrIntent &&
        <PresentWxQR
          passport={props.passport}
          orderId={wxQrIntent.order.id}
          qrCode={wxQrIntent.params.desktopQr}
          show={!!wxQrIntent}
          onHide={() => setWxQrIntent(undefined)}
          onConfirmed={(result) => {
            setWxQrIntent(undefined);
            setConfirmed(result);
            props.onSuccess(result.membership);
          }}
        />
      }
    </>
  );
}
