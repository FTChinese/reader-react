import { ReaderPassport } from '../data/account';
import { PagedList } from '../data/paged-list';
import { SubsParams } from '../data/shopping-cart';
import { PubKey, SetupIntent, SetupIntentParams, Subs } from '../data/stripe';
import { Customer, StripePayMethod, SubsResult } from '../data/stripe';
import { endpoint } from './endpoint';
import { Fetch, UrlBuilder } from './request';

// Load stripe publishable key from server.
// It's impossible to load the key dynamically for
// different environment since it is required to be
// a fixed static value upon initialization.
export function loadStripePubKey(): Promise<PubKey> {
  const url = new UrlBuilder(endpoint.stripePubKey)
    .toString();

  return new Fetch()
    .get(url)
    .endJson<PubKey>()
}

export function createCustomer(token: string): Promise<Customer> {
  return new Fetch()
    .setBearerAuth(token)
    .post(endpoint.stripeCustomers)
    .endJson<Customer>();
}

export function loadCustomer(token: string, cusId: string): Promise<Customer> {
  const url = new UrlBuilder(endpoint.stripeCustomers)
    .appendPath(cusId)
    .toString();

  return new Fetch()
    .setBearerAuth(token)
    .get(url)
    .endJson<Customer>();
}

export function createSetupIntent(token: string, p: SetupIntentParams): Promise<SetupIntent> {

  return new Fetch()
    .setBearerAuth(token)
    .post(endpoint.setupIntent)
    .sendJson(p)
    .endJson<SetupIntent>();
}

export function loadSetupPaymentMethod(token: string, setupId: string): Promise<StripePayMethod> {

  const url = new UrlBuilder(endpoint.setupIntent)
    .appendPath(setupId)
    .toString();

  return new Fetch()
    .setBearerAuth(token)
    .get(url)
    .endJson<StripePayMethod>();
}

export function loadPaymentMethod(token: string, id: string): Promise<StripePayMethod> {
  const url = new UrlBuilder(endpoint.paymentMethods)
    .appendPath(id)
    .toString();

  return new Fetch()
    .setBearerAuth(token)
    .get(url)
    .endJson<StripePayMethod>();
}

/**
 * @description Load a the default payment method set on customer.
 * @param token
 * @param cusId
 */
 function loadCusDefaultPayMethod(token: string, cusId: string): Promise<StripePayMethod> {
  const url = new UrlBuilder(endpoint.stripeCustomers)
    .appendPath(cusId)
    .appendPath('default-payment-method')
    .toString();

  return new Fetch()
    .setBearerAuth(token)
    .get(url)
    .endJson<StripePayMethod>();
}

/**
 * @description Fetches an existing subscription's paymenmt method.
 */
function loadSubsDefaultPayMethod(
  token: string,
  subsId: string,
): Promise<StripePayMethod> {
  const url = new UrlBuilder(endpoint.stripeSubs)
    .appendPath(subsId)
    .appendPath('default-payment-method')
    .toString();

  return new Fetch()
    .setBearerAuth(token)
    .get(url)
    .endJson<StripePayMethod>();
}

type PaymentMethodParams = {
  defaultPaymentMethod: string;
};

export const stripeRepo = {
  /**
   * @description Create a new stripe subscription.
   */
  createSubs(
    token: string,
    params: SubsParams
  ): Promise<SubsResult> {

    return new Fetch()
      .setBearerAuth(token)
      .post(endpoint.stripeSubs)
      .sendJson(params)
      .endJson<SubsResult>();
  },

  /**
   * @description Modify an existing stripe subscription.
   */
  updateSubs(
    token: string,
    subsId: string,
    params: SubsParams,
  ): Promise<SubsResult> {
    const url = new UrlBuilder(endpoint.stripeSubs)
      .appendPath(subsId)
      .toString();

    return new Fetch()
      .setBearerAuth(token)
      .post(url)
      .sendJson(params)
      .endJson<SubsResult>();
  },

  refreshSubs(
    token: string,
    subsId: string,
  ): Promise<SubsResult> {
    const url = new UrlBuilder(endpoint.stripeSubs)
      .appendPath(subsId)
      .appendPath('refresh')
      .toString();

    return new Fetch()
      .setBearerAuth(token)
      .post(url)
      .endJson<SubsResult>();
  },

  cancelSubs(
    token: string,
    subsId: string,
  ): Promise<SubsResult> {

    const url = new UrlBuilder(endpoint.stripeSubs)
      .appendPath(subsId)
      .appendPath('cancel')
      .toString();

    return new Fetch()
      .setBearerAuth(token)
      .post(url)
      .endJson<SubsResult>();
  },

  reactivateSubs(
    token: string,
    subsId: string,
  ): Promise<SubsResult> {

    const url = new UrlBuilder(endpoint.stripeSubs)
      .appendPath(subsId)
      .appendPath('reactivate')
      .toString();

    return new Fetch()
      .setBearerAuth(token)
      .post(url)
      .endJson<SubsResult>();
  },

  /**
   * @description Try to find a stripe default payment method.
   * Use subscription's paymenet method if exists;
   * otherwise fallback to customer payment method.
   */
  loadDefaultPayment: (pp: ReaderPassport): Promise<StripePayMethod> => {
    if (pp.membership.stripeSubsId) {
      return loadSubsDefaultPayMethod(pp.token, pp.membership.stripeSubsId);
    }

    if (pp.stripeId) {
      return loadCusDefaultPayMethod(pp.token, pp.stripeId);
    }

    return Promise.reject(new Error('Neither stripe subscripiton nor customer found!'));
  },

  /**
   * @description list a customer's payment methods.
   * @param token - Passport token
   * @param cusId - Customer id
   */
  listPaymentMethods(
    token: string,
    cusId: string
  ): Promise<PagedList<StripePayMethod>> {
    const url = new UrlBuilder(endpoint.stripeCustomers)
      .appendPath(cusId)
      .appendPath('payment-methods')
      .toString();

    return new Fetch()
      .setBearerAuth(token)
      .get(url)
      .endJson<PagedList<StripePayMethod>>();
  },

  /**
   * @description Set default payment methods on customer.
   */
  setCusPayment: (
    args: {
      token: string,
      customerId: string,
      methodId: string,
    }
  ): Promise<Customer> => {
    const url = new UrlBuilder(endpoint.stripeCustomers)
      .appendPath(args.customerId)
      .appendPath('default-payment-method')
      .toString();

    return new Fetch()
      .post(url)
      .setBearerAuth(args.token)
      .sendJson<PaymentMethodParams>({
        defaultPaymentMethod: args.methodId
      })
      .endJson<Customer>();
  },

  /**
   * @description Modify an existing subscription's default payment method.
   * This will affect next invoice.
   */
  updateSubsPayment: (
    args: {
      token: string,
      subsId: string,
      methodId: string,
    }
  ): Promise<Subs> => {
    const url = new UrlBuilder(endpoint.stripeCustomers)
      .appendPath(args.subsId)
      .appendPath('default-payment-method')
      .toString();

    return new Fetch()
      .post(url)
      .setBearerAuth(args.token)
      .sendJson<PaymentMethodParams>({
        defaultPaymentMethod: args.methodId
      })
      .endJson<Subs>();
  }
}
