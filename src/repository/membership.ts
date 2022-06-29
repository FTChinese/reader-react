import { Membership } from '../data/membership';
import { endpoint } from './endpoint';
import { Fetch } from './request';

export function reloadMembership(token: string): Promise<Membership> {
  return new Fetch()
    .setBearerAuth(token)
    .get(endpoint.membership)
    .endJson<Membership>();
}

export function claimAddOn(token: string): Promise<Membership> {
  return new Fetch()
    .setBearerAuth(token)
    .post(endpoint.memberAddon)
    .endJson<Membership>();
}
