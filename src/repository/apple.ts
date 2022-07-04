import { endpoint } from './endpoint';
import { IAPSubsResult } from '../data/iap';
import { Fetch, UrlBuilder } from './request';

export function refreshIAP(token: string, originalTxId: string): Promise<IAPSubsResult> {
  const url = new UrlBuilder(endpoint.iapSubs)
    .appendPath(originalTxId)
    .toString();

  return new Fetch()
    .setBearerAuth(token)
    .post(url)
    .endJson<IAPSubsResult>();
}
