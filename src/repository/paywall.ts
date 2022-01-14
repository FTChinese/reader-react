import axios, { AxiosResponse } from 'axios';
import { bearerAuthHeader } from '../data/account';
import { OrderParams } from '../data/order';
import { Paywall } from '../data/paywall';
import { StripePrice } from '../data/price';
import { AliPayIntent, WxPayIntent } from '../data/product-shelf';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function loadPaywall(): Promise<Paywall> {
  return axios.get(endpoint.paywall)
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      return Promise.reject(ResponseError.newInstance(error));
    });
}

export function listStripePrices(): Promise<StripePrice[]> {
  return axios.get(endpoint.stripePrices)
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

type PriceData = {
  ftc: Paywall;
  stripe: Map<string, StripePrice>;
}

class PaywallRepo {
  private cached: Partial<PriceData> = {};

  loadPaywall(): Promise<Paywall> {
    if (this.cached.ftc) {
      return Promise.resolve(this.cached.ftc);
    }

    return loadPaywall()
      .then(pw => {
        this.cached.ftc = pw;
        return pw
      });
  }

  loadStripe(): Promise<Map<string, StripePrice>> {
    if (this.cached.stripe) {
      return Promise.resolve(this.cached.stripe);
    }

    return listStripePrices()
      .then(prices => {
        const store = prices.reduce((prev, curr) => {
          return prev.set(curr.id, curr);
        }, new Map());
        this.cached.stripe = store;

        return store;
      });
  }

  load(): Promise<[Paywall, Map<string, StripePrice>]> {
    return Promise.all([
      this.loadPaywall(),
      this.loadStripe(),
    ]);
  }
}

export const paywallRepo = new PaywallRepo();

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
