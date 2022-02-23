import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { BackButton } from '../../components/buttons/BackButton';
import { FtcPayFormVal, FtcPayForm } from '../../components/forms/FtcPayForm';
import { WxPayIntent } from '../../data/order';
import { CartItemFtc, newOrderParams } from '../../data/shopping-cart';
import { alipayCallback } from '../../data/sitemap';
import { endpoint } from '../../repository/endpoint';
import { createAliOrder, createWxOrder } from '../../repository/ftcpay';
import { ResponseError } from '../../repository/response-error';
import { useAuth } from '../../components/hooks/useAuth';
import { ReaderPassport } from '../../data/account';
import { IntentKind } from '../../data/chekout-intent';

export function AliWxPay(
  props: {
    item: CartItemFtc;
  }
) {

  const { passport } = useAuth();
  if (!passport) {
    return null;
  }

  const [ wxPi, setWxPi ] = useState<WxPayIntent>();

  if (wxPi) {
    return (
      <DisplayWxQR
        url={wxPi.params.desktopQr}
        onBack={() => setWxPi(undefined)}
      />
    );
  }

  const msg = (
    <p className="scale-down8 text-center">{props.item.intent.message}</p>
  );

  switch (props.item.intent.kind) {
    case IntentKind.Create:
    case IntentKind.Renew:
    case IntentKind.Upgrade:
    case IntentKind.AddOn:
      return (
        <>
          {msg}

          <Purchase
            passport={passport}
            item={props.item}
            onWxPayIntent={setWxPi}
          />
        </>
      );

    case IntentKind.Forbidden:
    case IntentKind.Downgrade:
    case IntentKind.OneTimeToAutoRenew:
    case IntentKind.SwitchInterval:
      return msg;
  }
}

function Purchase(
  props: {
    passport: ReaderPassport;
    item: CartItemFtc;
    onWxPayIntent: (pi: WxPayIntent) => void
  }
) {
  const [ err, setErr ] = useState('');

  const handleSubmit = (
    values: FtcPayFormVal,
    helper: FormikHelpers<FtcPayFormVal>
  ): void | Promise<any> => {
    helper.setSubmitting(true);

    console.log(values);

    switch (values.method) {
      case 'alipay':
        createAliOrder(
            {
              ...newOrderParams(props.item),
              returnUrl: alipayCallback(document.location.origin),
            },
            props.passport.token
          )
          .then(pi => {
            console.log(pi);

            window.location.href = pi.params.browserRedirect
          })
          .catch((err: ResponseError) => {
            helper.setSubmitting(false);
            setErr(err.message);
          });

        break;

      case 'wechat':
        createWxOrder(newOrderParams(props.item), props.passport.token)
          .then(pi => {
            console.log(pi);
            if (pi.params.desktopQr) {
              helper.setSubmitting(false);
              props.onWxPayIntent(pi);
              return;
            }

            if (pi.params.mobileRedirect) {
              window.location.href = pi.params.mobileRedirect;
              return;
            }
          })
          .catch((err: ResponseError) => {
            helper.setSubmitting(false);
            setErr(err.message);
          });

        break;
    }
  }

  return (
    <FtcPayForm
      onSubmit={handleSubmit}
      errMsg={err}
    />
  );
}

function DisplayWxQR(
  props: {
    url: string;
    onBack: () => void;
  }
) {
  return (
    <div>
      <BackButton
        onBack={props.onBack}
      />
      <div className="text-center">
        <h5>微信扫码支付</h5>
        <img src={endpoint.qrSrc(props.url)}/>
      </div>
    </div>
  )
}
