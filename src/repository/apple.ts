import axios from 'axios';
import { bearerAuthHeader } from '../data/account';
import { endpoint } from './endpoint';
import { IAPSubsResult } from './iap';
import { ResponseError } from './response-error';

export function refreshIAP(token: string, originalTxId: string): Promise<IAPSubsResult> {
  return axios.post<IAPSubsResult>(
      endpoint.iapSubsOf(originalTxId),
      {
        Headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
