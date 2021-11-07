import axios, { AxiosError, AxiosResponse } from 'axios';
import { endpoint } from './endpoint';
import { Credentials, EmailSignUpReq, MobileFormVal, MobileLinkExistingEmailReq, MobileLinkNewEmailReq, PwResetLetterReq, VerifySMSFormVal } from '../data/form-value';
import { ApiErrorPayload, ResponseError } from './response-error';
import { ReaderPassport, WxOAuthSession } from '../data/account';
import { PasswordResetReqParams, PasswordResetVerified } from '../data/password-reset';

const CancelToken = axios.CancelToken;
export const cancelSource = CancelToken.source();

export function emailLogin(c: Credentials): Promise<ReaderPassport> {
  return axios.post<Credentials, AxiosResponse<ReaderPassport>>(
      endpoint.emailLogin,
      c
    )
    .then(resp => {
      return resp.data;
    })
    .catch((error: AxiosError<ApiErrorPayload>) => {
      return Promise.reject(
        ResponseError.newInstance(error),
      );
    });
}

export function emailSignUp(v: EmailSignUpReq): Promise<ReaderPassport> {
  return axios.post<EmailSignUpReq, AxiosResponse<ReaderPassport>>(endpoint.emailSignUp, v)
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      return Promise.reject(
        ResponseError.newInstance(error),
      );
    });
}

export function requestMobileLoginSMS(v: MobileFormVal): Promise<boolean> {
  return axios.put<MobileFormVal, AxiosResponse<boolean>>(endpoint.smsLogin, v)
    .then(resp => {
      return resp.status == 204;
    })
    .catch(err => {
      return Promise.reject(
        ResponseError.newInstance(err),
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

export function verifyEmail(token: string): Promise<boolean> {
  return axios.post(endpoint.verifyEmail(token))
    .then(resp => {
      return resp.status === 204;
    })
    .catch(error => {
      return Promise.reject(
        ResponseError.newInstance(error),
      );
    });
}

export function requestPasswordReset(req: PwResetLetterReq): Promise<boolean> {
  return axios.post(endpoint.requestPasswordReset, req)
    .then(resp => {
      return resp.status === 204;
    })
    .catch(error => {
      return Promise.reject(
        ResponseError.newInstance(error),
      );
    });
}

export function verifyPwToken(token: string): Promise<PasswordResetVerified> {
  return axios.get<never, AxiosResponse<PasswordResetVerified>>(endpoint.verifyResetToken(token), {
    cancelToken: cancelSource.token,
  })
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        console.log('Verify password token cancelled', error.message);
        return Promise.reject(new Error('Cancelled'));
      }

      return Promise.reject(
        ResponseError.newInstance(error),
      );
    });
}

export function resetPassword(v: PasswordResetReqParams): Promise<boolean> {
  return axios.post(endpoint.resetPassword, v)
    .then(resp => {
      return resp.status === 204;
    })
    .catch(error => {
      return Promise.reject(
        ResponseError.newInstance(error),
      );
    });
}

export function getWxOAuthSession(): Promise<WxOAuthSession> {
  return axios.get<WxOAuthSession>(endpoint.wxCode)
    .then(resp => resp.data)
    .catch(err => Promise.reject(ResponseError.newInstance(err)));
}
