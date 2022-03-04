import { useState } from 'react';
import { CartItemFtc, newOrderParams } from '../../data/shopping-cart';
import { alipayCallback } from '../../data/sitemap';
import { endpoint } from '../../repository/endpoint';
import { createAliOrder, createWxOrder, verifyAliWxPay } from '../../repository/ftcpay';
import { ResponseError } from '../../repository/response-error';
import { useAuth } from '../../components/hooks/useAuth';
import { ReaderPassport } from '../../data/account';
import { IntentKind } from '../../data/chekout-intent';
import { FtcPayProvider } from './FtcPayProvider';
import { ProgressButton } from '../../components/buttons/ProgressButton';
import { useFtcPay } from '../../components/hooks/useFtcPay';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { aliwxPaySession } from '../../store/aliwxPaySession';
import { CircleLoader } from '../../components/progress/LoadIndicator';
import { ConfirmationResult } from '../../data/order';
import { FtcPayDetails } from './FtcPayResult';
import { Alert } from 'react-bootstrap';

type OnConfirmationResult = (r: ConfirmationResult) => void;

export function AliWxPay(
  props: {
    item: CartItemFtc;
  }
) {

  const { passport } = useAuth();
  if (!passport) {
    return null;
  }

  const [ cfmResult, setCfmResult ] = useState<ConfirmationResult>();

  const msg = (
    <p className="scale-down8 text-center">{props.item.intent.message}</p>
  );

  if (cfmResult) {
    return (
      <>
        {msg}
        <FtcPayDetails
          method={cfmResult.order.payMethod}
          result={cfmResult.payment}
        />
      </>
    );
  }

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
            onQrPaid={setCfmResult}
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
    onQrPaid: OnConfirmationResult;
  }
) {
  const { ftcPaySetting, setWxPayIntent } = useFtcPay();
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
        aliwxPaySession.save(pi.order);
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
        if (pi.params.desktopQr) {
          console.log(pi);
          setProgress(false);
          setWxPayIntent(pi);
          setShowQr(true)
          return;
        }

        if (pi.params.mobileRedirect) {
          aliwxPaySession.save(pi.order);
          window.location.href = pi.params.mobileRedirect;
          return;
        }
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        toast.error(err.message);
      });
  }

  function handleSuccess(result: ConfirmationResult) {
    setShowQr(false);
    props.onQrPaid(result);
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
        onSuccess={handleSuccess}
      />
    </>
  );
}

function WxQrDialog(
  props: {
    show: boolean;
    onHide: () => void;
    onSuccess: OnConfirmationResult;
  }
) {

  const { passport, setMembership } = useAuth();
  const { ftcPaySetting } = useFtcPay();
  const [ progress, setProgress ] = useState(false);
  const [ err, setErr ] = useState('');

  if (!ftcPaySetting.wxPayIntent) {
    return null;
  }

  if (!ftcPaySetting.wxPayIntent.params.desktopQr) {
    return null;
  }

  const handleClick = () => {
    const order = ftcPaySetting.wxPayIntent?.order;
    if (!order) {
      toast.error('Missing payment order!');
      return;
    }

    if (!passport) {
      return;
    }

    setProgress(true);

    verifyAliWxPay(
       passport.token,
        order.id
      )
      .then(result => {
        setMembership(result.membership);
        setProgress(false);
        props.onSuccess(result);
      })
      .catch((err: ResponseError) => {
        setErr(err.message);
        setProgress(false);
      });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      centered
    >
      <Modal.Header closeButton>
        微信扫码支付
      </Modal.Header>

      <Modal.Body>
        <div className="text-center">
          <img src={endpoint.qrSrc(ftcPaySetting.wxPayIntent.params.desktopQr)} />
        </div>

        {
          err &&
          <Alert
            variant="danger"
            dismissible
            onClose={() => setErr('')}
          >
            {err}
          </Alert>
        }
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="link"
          size="sm"
          disabled={progress}
          onClick={handleClick}
        >
          {
            progress ?
            <>
              <CircleLoader
                progress={progress}
              />
              <span>正在验证，请稍候</span>
            </> :
            <span>支付完成？</span>
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
