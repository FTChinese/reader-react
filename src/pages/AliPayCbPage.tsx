import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../components/hooks/useAuth';
import { useQuery } from '../components/hooks/useQuery';
import { CenterColumn } from '../components/layout/Column';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { ConfirmationResult } from '../data/order';
import { FtcPayDetails } from '../features/ftcpay/FtcPayResult';
import { useFtcPay } from '../features/ftcpay/useFtcPay';
import { ResponseError } from '../repository/response-error';
import { aliwxPaySession } from '../store/aliwxPaySession';

export function AliPayCbPage() {

  const { passport, setMembership } = useAuth();
  const query = useQuery();
  const [ cfmResult, setCfmResult] = useState<ConfirmationResult>();
  const {
    progress,
    onAliPayRedirect,
  } = useFtcPay();

  const [ err, setErr ] = useState('');

  useEffect(() => {
    if (!passport) {
      toast.error('Not logged in');
      return;
    }

    onAliPayRedirect(passport.token, query)
      .then(result => {
        setCfmResult(result);
        setMembership(result.membership);
      })
      .catch((err: ResponseError) => {
        setErr(err.message);
      });

    return function clean() {
      aliwxPaySession.clear();
    }
  }, []);

  return (
    <ErrorBoundary errMsg={err}>
      <Loading loading={progress}>
        <CenterColumn>
          {
            cfmResult ?
             <FtcPayDetails
              method={cfmResult.order.payMethod}
              result={cfmResult.payment}
            /> :
            <></>
          }
        </CenterColumn>
      </Loading>
    </ErrorBoundary>
  );
}
