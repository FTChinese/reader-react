import axios from 'axios';
import { bearerAuthHeader } from '../data/account';
import { Membership } from '../data/membership';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function reloadMembership(token: string): Promise<Membership> {
  return axios.get<Membership>(
      endpoint.membership,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function claimAddOn(token: string): Promise<Membership> {
  return axios.post<Membership>(
      endpoint.memberAddon,
      {
        Headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
