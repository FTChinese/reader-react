import axios from 'axios';
import { bearerAuthHeader } from '../data/account';
import { PubKey } from '../data/product-shelf';
import { Customer, Subs, SubsParams } from '../data/stripe';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function loadStripePubKey(): Promise<PubKey> {
  return axios.get(endpoint.stripePubKey)
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function createCustomer(token: string): Promise<Customer> {
  return axios.post<Customer>(
      endpoint.stripeCustomers,
      null,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function loadCustomer(token: string, cusID: string): Promise<Customer> {
  return axios.get<Customer>(
      endpoint.stripeCustomerOf(cusID),
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function createSubs(token: string, params: SubsParams): Promise<Subs> {
  return axios.post<Subs>(
      endpoint.stripeSubs,
      params,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function updateSubs(
  token: string,
  params: SubsParams & {
    id: string;
  }
): Promise<Subs> {
  return axios.post<Subs>(
      endpoint.stripeSubsOf(params.id),
      params,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function refreshSubs(
  token: string,
  subsId: string,
): Promise<Subs> {
  return axios.post<Subs>(
      endpoint.stripeRefresh(subsId),
      undefined,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function cancelSubs(
  token: string,
  subsId: string,
): Promise<Subs> {
  return axios.post<Subs>(
      endpoint.stripeCancel(subsId),
      undefined,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function reactivateSubs(
  token: string,
  subsId: string,
): Promise<Subs> {
  return axios.post<Subs>(
    endpoint.stripeReactivate(subsId),
    undefined,
    {
      headers: bearerAuthHeader(token)
    }
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function loadSubsDefaultPayMethod(
  token: string,
  subsId: string,
): Promise<Subs> {
  return axios.post<Subs>(
    endpoint.stripeSubsDefaultPM(subsId),
    undefined,
    {
      headers: bearerAuthHeader(token)
    }
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
