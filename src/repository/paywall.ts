import axios from 'axios';
import { Paywall } from '../data/paywall';
import { StripePrice } from '../data/stripe';
import { endpoint } from './endpoint';
import { Fetch, UrlBuilder } from './request';
import { ResponseError } from './response-error';

export function loadPaywall(live: boolean): Promise<Paywall> {
  const url = new UrlBuilder(endpoint.paywall)
    .setLive(live)
    .toString();

  return new Fetch()
    .get(url)
    .endJson<Paywall>();
}

export function listStripePrices(): Promise<StripePrice[]> {
  return axios.get(endpoint.stripePrices)
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}
