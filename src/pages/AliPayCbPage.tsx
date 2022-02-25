import { useEffect, useState } from 'react';
import { useAuth } from '../components/hooks/useAuth';
import { useQuery } from '../components/hooks/useQuery';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Unauthorized } from '../components/routes/Unauthorized';
import { newAliPayCbParams, Order, validateAliPayResp } from '../data/order';
import { aliwxPaySession } from '../store/aliwxPaySession';

export function AliPayCbPage() {

  const { passport } = useAuth();
  const query = useQuery();

  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState('');

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


  }, []);

  return (
    <SingleCenterCol>
      <ErrorBoundary errMsg={err}>
        <Loading loading={progress}>
          <div className="text-center text-danger">
            Success!
          </div>
        </Loading>
      </ErrorBoundary>
    </SingleCenterCol>
  );
}
