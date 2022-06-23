import { useEffect, useState } from 'react';
import { useQuery } from '../components/hooks/useQuery';
import { CenterColumn } from '../components/layout/Column';
import { newAliPayCbParams, validateAliPayResp } from '../data/order';
import { FtcPayResult } from '../features/checkout/FtcPayResult';
import { aliwxPaySession } from '../store/aliwxPaySession';

export function AliPayCbPage() {

  const query = useQuery();

  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState('');
  const [ orderId, setOrderId ] = useState('');

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

    setOrderId(o.id);

    return function clean() {
      aliwxPaySession.clear();
    }
  }, []);

  return (
    <CenterColumn>
      <FtcPayResult
        progress={progress}
        errMsg={err}
        orderId={orderId}
      />
    </CenterColumn>
  );
}
