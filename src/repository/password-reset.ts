import { endpoint } from './endpoint';
import { PasswordResetVerified, PasswordResetReqParams, PwResetLetterReq } from '../data/password-reset';
import { Fetch, UrlBuilder } from './request';


export function requestPasswordReset(req: PwResetLetterReq): Promise<boolean> {
  return new Fetch()
    .post(endpoint.requestPasswordReset)
    .sendJson(req)
    .endOrReject()
    .then(resp => {
      return resp.status === 204;
    });
}

export function verifyPwToken(token: string): Promise<PasswordResetVerified> {
  const url = new UrlBuilder(endpoint.resetPassword)
    .appendPath('tokens')
    .appendPath(token)
    .toString();

  return new Fetch()
    .get(url)
    .endJson<PasswordResetVerified>();
}

export function resetPassword(v: PasswordResetReqParams): Promise<boolean> {
  return new Fetch()
    .post(endpoint.resetPassword)
    .endOrReject()
    .then(resp => {
      return resp.status === 204;
    });
}
