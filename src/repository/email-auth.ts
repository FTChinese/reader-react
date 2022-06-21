import axios, { AxiosError, AxiosResponse } from 'axios';
import { endpoint } from './endpoint';
import { Credentials } from '../data/form-value';
import { ApiErrorPayload, ResponseError } from './response-error';
import { ReaderPassport } from '../data/account';
import { EmailSignUpReq } from '../data/authentication';

export function emailExists(email: string): Promise<boolean> {
  return axios.get<boolean>(
      endpoint.emailExists,
      {
        params: {
          v: email,
        }
      }
    )
    .then(resp => resp.status === 204)
    .catch(err => {
      const respErr = ResponseError.fromAxios(err);
      if (respErr.statusCode === 404) {
        return false;
      }

      return Promise.reject(respErr);
    });
}

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
        ResponseError.fromAxios(error),
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
        ResponseError.fromAxios(error),
      );
    });
}

export function verifyEmail(token: string): Promise<boolean> {
  return axios.post(endpoint.verifyEmail(token))
    .then(resp => {
      return resp.status === 204;
    })
    .catch(error => {
      return Promise.reject(
        ResponseError.fromAxios(error),
      );
    });
}


