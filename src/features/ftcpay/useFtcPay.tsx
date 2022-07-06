import { useState } from 'react';
import { AliPayIntent, ConfirmationResult, WxPayIntent } from '../../data/order';
import { AliOrderParams, OrderParams } from '../../data/shopping-cart';
import { ftcPayRepo } from '../../repository/ftcpay';

export function useFtcPay() {
  const [ progress, setProgress ] = useState(false);

  const createWxOrder = (token: string, params: OrderParams): Promise<WxPayIntent> => {
    setProgress(true);

    return ftcPayRepo.createWxOrder(
        token,
        params,
      )
      .finally(() => {
        setProgress(false);
      });
  };

  const createAliOrder = (token: string, params: AliOrderParams): Promise<AliPayIntent> => {
    setProgress(true);

    return ftcPayRepo.createAliOrder(
        token,
        params,
      )
      .finally(() => {
        setProgress(false);
      });
  };

  const verifyPayment = (
    props: {
      token: string,
      orderId: string,
    }
  ): Promise<ConfirmationResult> => {
    setProgress(true );

    return ftcPayRepo.verifyAliWxPay(props.token, props.orderId)
      .finally(() => {
        setProgress(false);
      });
  };

  return {
    progress,
    createWxOrder,
    createAliOrder,
    verifyPayment,
  }
}
