import { AliPayIntent, ConfirmationResult, WxPayIntent } from '../data/order';
import { AliOrderParams, OrderParams } from '../data/shopping-cart';
import { endpoint } from './endpoint';
import { Fetch, UrlBuilder } from './request';

export const ftcPayRepo = {
  createWxOrder(token: string, v: OrderParams): Promise<WxPayIntent> {
    return new Fetch()
      .setBearerAuth(token)
      .post(endpoint.wxOrder)
      .sendJson(v)
      .endJson<WxPayIntent>();
  },

  createAliOrder(token: string, v: AliOrderParams): Promise<AliPayIntent> {
    return new Fetch()
      .setBearerAuth(token)
      .post(endpoint.aliOrder)
      .sendJson(v)
      .endJson<AliPayIntent>();
  },

  verifyAliWxPay(token: string, id: string): Promise<ConfirmationResult> {
    const url = new UrlBuilder(endpoint.ftcPayBase)
      .appendPath('orders')
      .appendPath(id)
      .appendPath('verify')
      .toString();

    return new Fetch()
      .setBearerAuth(token)
      .post(url)
      .endJson<ConfirmationResult>();
  },
};
