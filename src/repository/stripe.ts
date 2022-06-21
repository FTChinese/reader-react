import axios from 'axios';
import { bearerAuthHeader, ReaderPassport } from '../data/account';
import { PagedList } from '../data/paged-list';
import { PubKey, SetupIntent, SetupIntentParams } from '../data/stripe';
import { Customer, PaymentMethod, SubsParams, SubsResult } from '../data/stripe';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function loadStripePubKey(): Promise<PubKey> {
  return axios.get(endpoint.stripePubKey)
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
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
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function loadCustomer(token: string, cusId: string): Promise<Customer> {
  return axios.get<Customer>(
      endpoint.customerOf(cusId),
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function loadCusDefaultPayMethod(token: string, cusId: string): Promise<PaymentMethod> {
  return axios.get<PaymentMethod>(
      endpoint.cusDefaultPayMethod(cusId),
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function listCusPaymentMethods(token: string, cusId: string): Promise<PagedList<PaymentMethod>> {
  return axios.get<PagedList<PaymentMethod>>(
      endpoint.cusPaymentMethods(cusId),
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function createSetupIntent(token: string, p: SetupIntentParams): Promise<SetupIntent> {
  return axios.post<SetupIntent>(
      endpoint.setupIntent,
      p,
      {
        headers: bearerAuthHeader(token)
      }
    )
  .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function loadSetupPaymentMethod(token: string, setupId: string): Promise<PaymentMethod> {
  return axios.get<PaymentMethod>(
      endpoint.payMethodOfSetup(setupId),
      {
        headers: bearerAuthHeader(token),
        params: {
          refresh: "true",
        }
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function loadPaymentMethod(token: string, id: string): Promise<PaymentMethod> {
  return axios.get<PaymentMethod>(
      endpoint.paymentMethodOf(id),
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function createStripeSubs(
  token: string,
  params: SubsParams
): Promise<SubsResult> {
  return axios.post<SubsResult>(
      endpoint.stripeSubs,
      params,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function updateStripeSubs(
  token: string,
  params: SubsParams & {
    id: string;
  }
): Promise<SubsResult> {
  return axios.post<SubsResult>(
      endpoint.stripeSubsOf(params.id),
      params,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function refreshStripeSubs(
  token: string,
  subsId: string,
): Promise<SubsResult> {
  return axios.post<SubsResult>(
      endpoint.refreshSubs(subsId),
      undefined,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function cancelStripeSubs(
  token: string,
  subsId: string,
): Promise<SubsResult> {
  return axios.post<SubsResult>(
      endpoint.cancelSubs(subsId),
      undefined,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function redoStripeSubsCancel(
  token: string,
  subsId: string,
): Promise<SubsResult> {
  return axios.post<SubsResult>(
    endpoint.reactivateSubs(subsId),
    undefined,
    {
      headers: bearerAuthHeader(token)
    }
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function loadSubsDefaultPayMethod(
  token: string,
  subsId: string,
): Promise<PaymentMethod> {
  return axios.get<PaymentMethod>(
    endpoint.subsDefaultPayMethod(subsId),
    {
      headers: bearerAuthHeader(token)
    }
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

/**
 * @description Try to find a stripe default payment method.
 * Use subscription's paymenet method if exists;
 * otherwise fallback to customer payment method.
 */
export function loadStripeDefaultPayment(pp: ReaderPassport): Promise<PaymentMethod> {
  if (pp.membership.stripeSubsId) {
    return loadSubsDefaultPayMethod(pp.token, pp.membership.stripeSubsId);
  }

  if (pp.stripeId) {
    return loadCusDefaultPayMethod(pp.token, pp.stripeId);
  }

  return Promise.reject(new Error('Neither stripe subscripiton nor customer found!'));
}
