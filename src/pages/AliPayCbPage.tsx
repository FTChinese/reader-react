import { useEffect, useState } from 'react';
import { useAuth } from '../components/hooks/useAuth';
import { useQuery } from '../components/hooks/useQuery';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { HeadTailTable } from '../components/list/HeadTailTable';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Unauthorized } from '../components/routes/Unauthorized';
import { ftcPayResultRows, newAliPayCbParams, PayResult, validateAliPayResp } from '../data/order';
import { verifyAliWxPay } from '../repository/ftcpay';
import { ResponseError } from '../repository/response-error';
import { aliwxPaySession } from '../store/aliwxPaySession';

export function AliPayCbPage() {

  const { passport, setMembership } = useAuth();
  const query = useQuery();

  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState('');
  const [ payResult, setPayResult ] = useState<PayResult>();

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    const o = aliwxPaySession.load();

    if (!o) {
      setErr('Order not found');
      setProgress(false);
      return;
    }

    const p = newAliPayCbParams(query);

    const invalid = validateAliPayResp(o, p);
    if (invalid) {
      setErr(invalid);
      setProgress(false);
      return;
    }

    verifyAliWxPay(passport.token, o.id)
      .then(result => {
        setMembership(result.membership);
        setProgress(false);
      })
      .catch((err: ResponseError) => {
        setErr(err.toString());
        setProgress(false);
      })
  }, []);

  return (
    <SingleCenterCol>
      <ErrorBoundary errMsg={err}>
        <Loading loading={progress}>
          <>
            {
              payResult &&
              <HeadTailTable
                caption="支付宝支付结果"
                rows={ftcPayResultRows(payResult)}
              />
            }
          </>
        </Loading>
      </ErrorBoundary>
    </SingleCenterCol>
  );
}
