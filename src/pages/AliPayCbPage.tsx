import { useEffect, useState } from 'react';
import { useQuery } from '../components/hooks/useQuery';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { newAliPayCbParams, validateAliPayResp } from '../data/order';
import { VerifyFtcPay } from '../features/checkout/VerifyFtcPay';
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
  }, []);

  return (
    <SingleCenterCol>
      <VerifyFtcPay
        progress={progress}
        errMsg={err}
        orderId={orderId}
        title="支付宝支付结果"
      />
    </SingleCenterCol>
  );
}
