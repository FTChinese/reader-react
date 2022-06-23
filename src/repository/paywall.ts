import { Paywall } from '../data/paywall';
import { endpoint } from './endpoint';
import { Fetch, UrlBuilder } from './request';

export function loadPaywall(live: boolean): Promise<Paywall> {
  const url = new UrlBuilder(endpoint.paywall)
    .setLive(live)
    .toString();

  return new Fetch()
    .get(url)
    .endJson<Paywall>();
}
