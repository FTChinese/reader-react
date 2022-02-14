import axios, { AxiosResponse } from 'axios';
import { bearerAuthHeader } from '../data/account';
import { OrderParams } from '../data/order';
import { AliPayIntent, WxPayIntent } from '../data/product-shelf';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function createWxOrder(v: OrderParams, token: string): Promise<WxPayIntent> {
  return axios.post<WxPayIntent, AxiosResponse<WxPayIntent>, OrderParams>(
      endpoint.wxOrder,
      v,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function createAliOrder(
  v: OrderParams & { returnUrl: string },
  token: string
): Promise<AliPayIntent> {
  return axios.post<AliPayIntent, AxiosResponse<AliPayIntent>, OrderParams>(
      endpoint.aliOrder,
      v,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
