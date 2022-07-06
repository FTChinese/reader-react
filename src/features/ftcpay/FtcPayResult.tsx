import { useEffect, useState } from 'react';
import { PaySuccessLink } from '../../components/text/Checkout';
import { useAuth } from '../../components/hooks/useAuth';
import { useShoppingCart } from '../../components/hooks/useShoppingCart';
import { HeadTailTable } from '../../components/list/HeadTailTable';
import { ErrorBoundary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { PaymentKind } from '../../data/enum';
import { formatMoney, localizePaymentMethod } from '../../data/localization';
import { ConfirmationResult, PayResult } from '../../data/order';
import { StringPair } from '../../data/pair';
import { verifyAliWxPay } from '../../repository/ftcpay';
import { ResponseError } from '../../repository/response-error';

export function FtcPayResult(
  props: {
    progress: boolean;
    errMsg: string;
    orderId: string;
  }
) {

  const { passport, setMembership } = useAuth();
  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState('');
  const [ cfmResult, setCfmResult] = useState<ConfirmationResult>();

  if (!passport) {
    return <Unauthorized/>
  }

  useEffect(() => {
    setProgress(props.progress);
    setErr(props.errMsg);
  }, [props.progress, props.errMsg]);

  useEffect(() => {
    if (!props.orderId) {
      return;
    }

    setProgress(true);
    setErr('');
    verifyAliWxPay(passport.token, props.orderId)
      .then(result => {
        setMembership(result.membership);
        setProgress(false);
        setCfmResult(result);
      })
      .catch((err: ResponseError) => {
        setErr(err.message);
        setProgress(false);
      });
  }, [props.orderId]);

  return (
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>
        <>
          {
            cfmResult &&
            <FtcPayDetails
              method={cfmResult.order.payMethod}
              result={cfmResult.payment}
            />
          }
        </>
      </Loading>
    </ErrorBoundary>
  );
}

export function FtcPayDetails(
  props: {
    method: PaymentKind;
    result: PayResult;
  }
) {

  const { clearCart } = useShoppingCart();

  const rows: StringPair[] = [
    ['订单号', props.result.ftcOrderId],
    ['支付状态', props.result.paymentStateDesc],
    ['金额', formatMoney('rmb', props.result.totalFee/100)],
    ['支付宝交易号', props.result.transactionId],
    ['支付时间', props.result.paidAt]
  ];

  // Build a string like `支付宝支付结果`
  const title = `${localizePaymentMethod(props.method)}支付结果`;

  // Cleanup only after this component is used.
  useEffect(() => {
    return function cleanup() {
      clearCart();
    };
  }, []);

  return (
    <>
      <HeadTailTable
        caption={title}
        rows={rows}
      />
      <PaySuccessLink />
    </>
  );
}
