import { useState } from 'react';
import { ConfirmationResult, newAliPayCbParams, validateAliPayResp, WxPayIntent } from '../../data/order';
import { AliOrderParams, OrderParams } from '../../data/shopping-cart';
import { ftcPayRepo } from '../../repository/ftcpay';
import { aliwxPaySession } from '../../store/aliwxPaySession';

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

  /**
   * @param token
   * @param params
   * @returns - Alipay redirect url
   */
  const createAliOrder = (token: string, params: AliOrderParams): Promise<string> => {
    setProgress(true);

    return ftcPayRepo.createAliOrder(
        token,
        params,
      )
      .then(pi => {
        aliwxPaySession.save(pi.order);
        return pi.params.browserRedirect;
      })
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

  const onAliPayRedirect = (
    token: string,
    query: URLSearchParams,
  ): Promise<ConfirmationResult> => {
    setProgress(true);

    const order = aliwxPaySession.load();
    if (!order) {
      setProgress(false);
      return Promise.reject(new Error('Order not found'));
    }

    const cbParams = newAliPayCbParams(query);
    const invalid = validateAliPayResp(order, cbParams);
    if (invalid) {
      setProgress(false);
      return Promise.reject(new Error(invalid));
    }

    return ftcPayRepo
      .verifyAliWxPay(token, order.id)
      .finally(() => {
        setProgress(false);
      });
  };

  return {
    progress,
    createWxOrder,
    createAliOrder,
    verifyPayment,
    onAliPayRedirect,
  }
}
