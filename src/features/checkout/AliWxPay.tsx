import { useState } from 'react';
import { CartItemFtc, newOrderParams } from '../../data/shopping-cart';
import { alipayCallback } from '../../data/sitemap';
import { endpoint } from '../../repository/endpoint';
import { createAliOrder, createWxOrder } from '../../repository/ftcpay';
import { ResponseError } from '../../repository/response-error';
import { useAuth } from '../../components/hooks/useAuth';
import { ReaderPassport } from '../../data/account';
import { IntentKind } from '../../data/chekout-intent';
import { FtcPayProvider } from './FtcPayProvider';
import { ProgressButton } from '../../components/buttons/ProgressButton';
import { useFtcPay } from '../../components/hooks/useFtcPay';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';

export function AliWxPay(
  props: {
    item: CartItemFtc;
  }
) {

  const { passport } = useAuth();
  if (!passport) {
    return null;
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

          <ListPayMethods />
          <PayButton
            passport={passport}
            item={props.item}
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

function ListPayMethods() {
  return (
    <div className="mb-3">
      <h6>选择支付方式</h6>
      <FtcPayProvider method="alipay" />
      <FtcPayProvider method="wechat" />
    </div>
  );
}

function PayButton(
  props: {
    passport: ReaderPassport;
    item: CartItemFtc;
  }
) {
  const { ftcPaySetting, setAliPayIntent, setWxPayIntent } = useFtcPay();
  const [ progress, setProgress ] = useState(false);
  const [ showQr, setShowQr ] = useState(false);

  function handleClick() {
    if (!ftcPaySetting.selectedMethod) {
      console.error('No payment method seleted');
      return;
    }

    switch (ftcPaySetting.selectedMethod) {
      case 'alipay':
        getAliIntent();
        break;

      case 'wechat':
        getWxIntent();
        break;
    }
  }

  function getAliIntent() {
    setProgress(true);

    createAliOrder(
        {
          ...newOrderParams(props.item),
          returnUrl: alipayCallback(document.location.origin),
        },
        props.passport.token
      )
      .then(pi => {
        setProgress(false);
        setAliPayIntent(pi);

        // Redirect to alipay website.
        window.location.href = pi.params.browserRedirect;

        // After payment finished, user will
        // be redirected back to /callback/alipay.
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        toast.error(err.message);
      });
  }

  function getWxIntent() {
    setProgress(true);

    createWxOrder(
        newOrderParams(props.item),
        props.passport.token
      )
      .then(pi => {
        console.log(pi);
        if (pi.params.desktopQr) {
          setProgress(false);
          setWxPayIntent(pi);
          return;
        }

        if (pi.params.mobileRedirect) {
          window.location.href = pi.params.mobileRedirect;
          return;
        }
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        toast.error(err.message);
      });
  }

  return (
    <>
      <ProgressButton
        disabled={!ftcPaySetting.selectedMethod || progress}
        text="支付"
        progress={progress}
        block={true}
        onClick={handleClick}
      />
      <WxQrDialog
        show={showQr}
        onHide={() => setShowQr(false)}
      />
    </>
  );
}

function WxQrDialog(
  props: {
    show: boolean;
    onHide: () => void;
  }
) {

  const { ftcPaySetting } = useFtcPay();
  if (!ftcPaySetting.wxPayIntent) {
    return null;
  }

  if (!ftcPaySetting.wxPayIntent.params.desktopQr) {
    return null;
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        微信扫码支付
      </Modal.Header>

      <Modal.Body>
        <div className="text-center">
          <img src={endpoint.qrSrc(ftcPaySetting.wxPayIntent.params.desktopQr)} />
        </div>
      </Modal.Body>
    </Modal>
  );
}
