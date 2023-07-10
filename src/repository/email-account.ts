import { BaseAccount, ReaderPassport } from '../data/account';
import { ReaderAccount } from '../data/account';
import { endpoint } from './endpoint';
import { Address, AddressFormVal } from '../data/address';
import { Profile, ProfileFormVal } from '../data/profile';
import { UpdateEmailReq, UpdateNameFormVal, UpdatePasswordReq } from '../data/update-account';
import { MobileFormVal, VerifySMSFormVal } from '../data/mobile';
import { Fetch } from './request';

export function loadAccount(p: ReaderPassport): Promise<ReaderAccount> {
  return new Fetch()
    .setBearerAuth(p.token)
    .get(endpoint.emailAccount)
    .endJson<ReaderAccount>();
}

export function requestEmailVerification(p: ReaderPassport): Promise<boolean> {
  return new Fetch()
    .setBearerAuth(p.token)
    .post(endpoint.requestVerification)
    .endOrReject()
    .then(resp => {
      return resp.status === 204
    });
}

export function updateUserName(v: UpdateNameFormVal, token: string): Promise<BaseAccount> {
  return new Fetch()
    .setBearerAuth(token)
    .patch(endpoint.displayName)
    .sendJson(v)
    .endJson<BaseAccount>();
}

export function updateEmail(v: UpdateEmailReq, token: string): Promise<BaseAccount> {
  return new Fetch()
    .setBearerAuth(token)
    .patch(endpoint.changeMobile)
    .sendJson(v)
    .endJson<BaseAccount>();
}

export function updatePassword(v: UpdatePasswordReq, token: string,): Promise<boolean> {
  return new Fetch()
    .setBearerAuth(token)
    .patch(endpoint.changePassword)
    .sendJson(v)
    .endOrReject()
    .then(resp => {
      return resp.status === 204;
    });
}

/**
 * @description Get a verification code
 * @returns True if success, false if failure.
 */
export function requestVerifyMobile(v: MobileFormVal, token: string): Promise<boolean> {
  return new Fetch()
    .setBearerAuth(token)
    .put(endpoint.verifyMobile)
    .sendJson(v)
    .endOrReject()
    .then(resp => {
      return resp.status === 204;
    });
}

export function changeMobile(v: VerifySMSFormVal, token: string): Promise<BaseAccount> {
  return new Fetch()
    .setBearerAuth(token)
    .patch(endpoint.changeMobile)
    .sendJson(v)
    .endJson<BaseAccount>();
}

export function loadAddress(token: string): Promise<Address> {
  return new Fetch()
    .setBearerAuth(token)
    .get(endpoint.address)
    .endJson<Address>();
}

export function updateAddress(v: AddressFormVal, token: string): Promise<Address> {
  return new Fetch()
    .setBearerAuth(token)
    .patch(endpoint.address)
    .sendJson(v)
    .endJson<Address>();
}

export function loadProfile(token: string): Promise<Profile> {
  return new Fetch()
    .setBearerAuth(token)
    .get(endpoint.profile)
    .endJson<Profile>();
}

export function updateProfile(v: ProfileFormVal, token: string): Promise<Profile> {
  return new Fetch()
    .setBearerAuth(token)
    .patch(endpoint.profile)
    .sendJson(v)
    .endJson<Profile>();
}
