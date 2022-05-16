import axios from 'axios';
import { Paywall } from '../data/paywall';
import { StripePrice } from '../data/stripe';
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
