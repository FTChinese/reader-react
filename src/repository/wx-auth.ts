import axios, { AxiosResponse } from 'axios';
import { bearerAuthHeader, ReaderPassport } from '../data/account';
import { WxEmailLinkReq, WxEmailUnlinkReq } from '../data/account-wx';
import { WxOAuthCodeReq, WxOAuthLoginSession, WxLoginReq, EmailSignUpReq } from '../data/authentication';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function getWxOAuthSession(): Promise<WxOAuthCodeReq> {
  return axios.get<WxOAuthCodeReq>(endpoint.wxCode)
    .then(resp => resp.data)
    .catch(err => Promise.reject(ResponseError.newInstance(err)));
}

export function wxLogin(code: string): Promise<WxOAuthLoginSession> {
  return axios.post<WxOAuthLoginSession, AxiosResponse<WxOAuthLoginSession>, WxLoginReq>(
      endpoint.wxLogin,
      { code, }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function wxlinkNewEmail(v: EmailSignUpReq, token: string): Promise<ReaderPassport> {
  return axios.post<ReaderPassport, AxiosResponse<ReaderPassport>, EmailSignUpReq>(
      endpoint.wxSignUp,
      v,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function wxLinkExistingEmail(ftcId: string, token: string): Promise<boolean> {
  return axios.post<boolean, AxiosResponse<boolean>, WxEmailLinkReq>(
      endpoint.wxLink,
      {
        ftcId,
      },
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.status === 204)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function wxLinkEmail(v: WxEmailUnlinkReq, token: string): Promise<boolean> {
  return axios.post<boolean, AxiosResponse<boolean>, WxEmailUnlinkReq>(
      endpoint.wxUnlink,
      v,
      {
        headers: bearerAuthHeader(token)
      }
    )
    .then(resp => resp.status === 204)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
