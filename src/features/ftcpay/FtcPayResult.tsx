import { useEffect } from 'react';
import { PaySuccessLink } from '../../components/text/Checkout';
import { useShoppingCart } from '../../components/hooks/useShoppingCart';
import { HeadTailTable } from '../../components/list/HeadTailTable';
import { PaymentKind } from '../../data/enum';
import { formatMoney, localizePaymentMethod } from '../../data/localization';
import { PayResult } from '../../data/order';
import { StringPair } from '../../data/pair';

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
