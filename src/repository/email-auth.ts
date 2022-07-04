import { endpoint } from './endpoint';
import { Credentials } from '../data/form-value';
import { ResponseError } from './response-error';
import { ReaderPassport } from '../data/account';
import { EmailSignUpReq } from '../data/authentication';
import { Fetch, UrlBuilder } from './request';

export function emailExists(email: string): Promise<boolean> {
  const url = new UrlBuilder(endpoint.emailExists)
    .setQuery("v", email).toString();
  return new Fetch()
    .get(url)
    .endOrReject()
    .then(resp => {
      return resp.status === 204
    })
    .catch((err: ResponseError) => {
      if (err.statusCode === 404) {
        return false;
      }

      return Promise.reject(err);
    });

}

export function emailLogin(c: Credentials): Promise<ReaderPassport> {
  return new Fetch()
    .post(endpoint.emailLogin)
    .sendJson(c)
    .endJson<ReaderPassport>();
}

export function emailSignUp(v: EmailSignUpReq): Promise<ReaderPassport> {
  return new Fetch()
    .post(endpoint.emailSignUp)
    .sendJson(v)
    .endJson<ReaderPassport>();
}

export function verifyEmail(token: string): Promise<boolean> {
  const url = new UrlBuilder(endpoint.emailAuth)
    .appendPath('verification')
    .appendPath(token)
    .toString();

  return new Fetch()
    .post(url)
    .endOrReject()
    .then(resp => {
      return resp.status === 204;
    });
}


