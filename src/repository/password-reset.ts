import axios, { AxiosResponse } from 'axios';
import { endpoint } from './endpoint';
import { PwResetLetterReq } from '../data/form-value';
import { ResponseError } from './response-error';
import { PasswordResetVerified, PasswordResetReqParams } from '../data/password-reset';
import { cancelSource } from './cancel';


export function requestPasswordReset(req: PwResetLetterReq): Promise<boolean> {
  return axios.post(endpoint.requestPasswordReset, req)
    .then(resp => {
      return resp.status === 204;
    })
    .catch(error => {
      return Promise.reject(
        ResponseError.newInstance(error)
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
