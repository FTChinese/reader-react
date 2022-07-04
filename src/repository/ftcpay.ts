import { AliPayIntent, ConfirmationResult, WxPayIntent } from '../data/order';
import { OrderParams } from '../data/shopping-cart';
import { endpoint } from './endpoint';
import { Fetch, UrlBuilder } from './request';

export function createWxOrder(v: OrderParams, token: string): Promise<WxPayIntent> {
  return new Fetch()
    .setBearerAuth(token)
    .post(endpoint.wxOrder)
    .sendJson(v)
    .endJson<WxPayIntent>();
}

export function createAliOrder(
  v: OrderParams & { returnUrl: string },
  token: string
): Promise<AliPayIntent> {
  return new Fetch()
    .setBearerAuth(token)
    .post(endpoint.aliOrder)
    .sendJson(v)
    .endJson<AliPayIntent>();
}

export function verifyAliWxPay(token: string, id: string): Promise<ConfirmationResult> {
  const url = new UrlBuilder(endpoint.ftcPayBase)
    .appendPath('orders')
    .appendPath(id)
    .appendPath('verify')
    .toString();

  return new Fetch()
    .setBearerAuth(token)
    .post(url)
    .endJson<ConfirmationResult>();
}
