import axios, { AxiosResponse } from 'axios';
import { bearerAuthHeader, ReaderPassport } from '../data/account';
import { WxEmailLinkReq, WxEmailUnlinkReq } from '../data/account-wx';
import { WxLoginReq, EmailSignUpReq, WxOAuthCodeReq } from '../data/authentication';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function getWxOAuthCodeReq(): Promise<WxOAuthCodeReq> {
  return axios.get<WxOAuthCodeReq>(endpoint.wxCode)
    .then(resp => resp.data)
    .catch(err => Promise.reject(ResponseError.fromAxios(err)));
}

export function wxLogin(code: string): Promise<ReaderPassport> {
  return axios.post<ReaderPassport, AxiosResponse<ReaderPassport>, WxLoginReq>(
      endpoint.wxLogin,
      { code, }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function wxLinkExistingEmail(
  {ftcId, token}: {
    ftcId: string,
    token: string
  }
): Promise<ReaderPassport> {
  return axios.post<ReaderPassport, AxiosResponse<ReaderPassport>, WxEmailLinkReq>(
      endpoint.wxLink,
      {
        ftcId,
      },
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function wxLinkNewEmail(v: EmailSignUpReq, token: string): Promise<ReaderPassport> {
  return axios.post<ReaderPassport, AxiosResponse<ReaderPassport>, EmailSignUpReq>(
      endpoint.wxSignUp,
      v,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}

export function wxUnlinkEmail(v: WxEmailUnlinkReq, token: string): Promise<ReaderPassport> {
  return axios.post<ReaderPassport, AxiosResponse<ReaderPassport>, WxEmailUnlinkReq>(
      endpoint.wxUnlink,
      v,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.fromAxios(error)));
}
