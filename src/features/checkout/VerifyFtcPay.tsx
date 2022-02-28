import { useEffect, useState } from 'react';
import { useAuth } from '../../components/hooks/useAuth';
import { HeadTailTable } from '../../components/list/HeadTailTable';
import { ErrorBoundary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { ftcPayResultRows, PayResult } from '../../data/order';
import { verifyAliWxPay } from '../../repository/ftcpay';
import { ResponseError } from '../../repository/response-error';

export function VerifyFtcPay(
  props: {
    progress: boolean;
    errMsg: string;
    orderId: string;
    title: string;
  }
) {

  const { passport, setMembership } = useAuth();
  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState('');
  const [ payResult, setPayResult ] = useState<PayResult>();

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
        setPayResult(result.payment);
      })
      .catch((err: ResponseError) => {
        setErr(err.toString());
        setProgress(false);
      });
  }, [props.orderId]);

  return (
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>
        <>
          {
            payResult &&
            <HeadTailTable
              caption={props.title}
              rows={ftcPayResultRows(payResult)}
            />
          }
        </>
      </Loading>
    </ErrorBoundary>
  );
}
