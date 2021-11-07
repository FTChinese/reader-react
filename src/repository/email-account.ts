import axios, { AxiosResponse } from 'axios';
import { authHeader, BaseAccount, bearerAuthHeader, ReaderPassport } from '../data/account';
import { UpdatePasswordFormVal, UpdateNameFormVal, MobileFormVal } from '../data/form-value';
import { ReaderAccount } from '../data/account';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';
import { Address, AddressFormVal } from '../data/address';
import { Profile, ProfileFormVal } from '../data/profile';

export function loadAccount(p: ReaderPassport): Promise<ReaderAccount> {
  return axios.get<undefined, AxiosResponse<ReaderAccount>>(endpoint.emailAccount, {
    headers: authHeader(p),
  })
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      return Promise.reject(ResponseError.newInstance(error));
    });
}

export function requestEmailVerification(p: ReaderPassport): Promise<boolean> {
  return axios.post(endpoint.requestVerification, {}, {
    headers: authHeader(p)
  })
    .then(resp => {
      return resp.status === 204;
    })
    .catch(error => {
      return Promise.reject(ResponseError.newInstance(error));
    });
}

export function updateDisplayName(v: UpdateNameFormVal, p: ReaderPassport): Promise<BaseAccount> {
  return axios.patch<UpdateNameFormVal, AxiosResponse<BaseAccount>>(
    endpoint.displayName,
    v,
    {
      headers: authHeader(p)
    }
  )
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      return Promise.reject(ResponseError.newInstance(error));
    });
}

export function updatePassword(v: UpdatePasswordFormVal, token: string,): Promise<boolean> {
  return axios.patch(
    endpoint.changePassword,
    v,
    {
      headers: bearerAuthHeader(token),
    },
  )
    .then(resp => {
      return resp.status === 204;
    })
    .catch(error => {
      return Promise.reject(ResponseError.newInstance(error));
    });
}

export function requestVerifyMobile(v: MobileFormVal, token: string): Promise<boolean> {
  return axios.put<MobileFormVal, AxiosResponse<boolean>>(
    endpoint.verifyMobile,
    v,
    {
      headers: bearerAuthHeader(token)
    }
  )
    .then(resp => resp.status === 204)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function loadAddress(token: string): Promise<Address> {
  return axios.get<Address>(
    endpoint.address,
    {
      headers: bearerAuthHeader(token)
    }
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function updateAddress(v: AddressFormVal, token: string): Promise<Address> {
  return axios.patch<Address, AxiosResponse<Address>, AddressFormVal>(
    endpoint.address,
    v,
    {
      headers: bearerAuthHeader(token)
    }
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function loadProfile(token: string): Promise<Profile> {
  return axios.get<Profile>(
      endpoint.profile,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function updateProfile(v: ProfileFormVal, token: string): Promise<Profile> {
  return axios.patch<Profile, AxiosResponse<Profile>, ProfileFormVal>(
      endpoint.profile,
      v,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
