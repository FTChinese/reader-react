import axios from 'axios';
import { PubKey } from '../data/product-shelf';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function loadStripePubKey(): Promise<PubKey> {
  return axios.get(endpoint.stripePubKey)
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
