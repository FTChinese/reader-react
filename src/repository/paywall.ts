import axios, { AxiosResponse } from 'axios';
import { Paywall } from '../data/paywall';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function loadPaywall(): Promise<Paywall> {
  return axios.get<unknown, AxiosResponse<Paywall>>(endpoint.paywall,)
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      return Promise.reject(ResponseError.newInstance(error));
    });
}

class PaywallRepo {
  private cached?: Paywall;

  loadPaywall(): Promise<Paywall> {
    if (this.cached) {
      return Promise.resolve(this.cached);
    }

    return loadPaywall();
  }
}

export const paywallRepo = new PaywallRepo();
