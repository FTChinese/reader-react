import axios, { AxiosResponse } from 'axios';
import { endpoint } from './endpoint';
import { MobileFormVal, MobileLinkExistingEmailReq, MobileLinkNewEmailReq, VerifySMSFormVal } from '../data/form-value';
import { ResponseError } from './response-error';
import { ReaderPassport } from '../data/account';


export function requestMobileLoginSMS(v: MobileFormVal): Promise<boolean> {
  return axios.put<MobileFormVal, AxiosResponse<boolean>>(endpoint.smsLogin, v)
    .then(resp => {
      return resp.status == 204;
    })
    .catch(err => {
      return Promise.reject(
        ResponseError.newInstance(err)
      );
    });
}

export function verifyMobileLoginSMS(v: VerifySMSFormVal): Promise<ReaderPassport> {
  return axios.post<VerifySMSFormVal, AxiosResponse<ReaderPassport>>(endpoint.smsLogin, v)
    .then(resp => {
      return resp.data;
    })
    .catch(err => {
      return Promise.reject(
        ResponseError.newInstance(err),
      );
    });
}

// Create mobile-only account
export function mobileSignUp(v: MobileFormVal): Promise<ReaderPassport> {
  return axios.post<MobileFormVal, AxiosResponse<ReaderPassport>>(endpoint.mobileSignUp, v)
    .then(resp => resp.data)
    .catch(err => {
      return Promise.reject(ResponseError.newInstance(err));
    });
}

// A mobile number wants to link to an existing email account.
export function mobileLinkExistingEmail(req: MobileLinkExistingEmailReq): Promise<ReaderPassport> {
  return axios.post<MobileLinkExistingEmailReq, AxiosResponse<ReaderPassport>>(
      endpoint.mobileLinkEmail,
      req
    )
    .then(resp => resp.data)
    .catch(err => Promise.reject(ResponseError.newInstance(err)));
}

export function mobileLinkNewEmail(req: MobileLinkNewEmailReq): Promise<ReaderPassport> {
  return axios.post<MobileLinkNewEmailReq, AxiosResponse<ReaderPassport>>(
      endpoint.emailSignUp,
      req,
    )
    .then(resp => resp.data)
    .catch(err => Promise.reject(ResponseError.newInstance(err)));
}
