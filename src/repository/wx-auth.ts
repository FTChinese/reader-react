import { ReaderPassport } from '../data/account';
import { WxEmailLinkReq, WxEmailUnlinkReq } from '../data/account-wx';
import { WxLoginReq, EmailSignUpReq, WxOAuthCodeReq } from '../data/authentication';
import { endpoint } from './endpoint';
import { Fetch } from './request';

export function getWxOAuthCodeReq(): Promise<WxOAuthCodeReq> {
  return new Fetch()
    .get(endpoint.wxCode)
    .endJson<WxOAuthCodeReq>();
}

export function wxLogin(code: string): Promise<ReaderPassport> {
  return new Fetch()
    .post(endpoint.wxLogin)
    .sendJson<WxLoginReq>({code})
    .endJson<ReaderPassport>();
}

export function wxLinkExistingEmail(
  {ftcId, token}: {
    ftcId: string,
    token: string
  }
): Promise<ReaderPassport> {
  return new Fetch()
    .setBearerAuth(token)
    .post(endpoint.wxLink)
    .sendJson<WxEmailLinkReq>({ftcId})
    .endJson<ReaderPassport>();
}

export function wxLinkNewEmail(v: EmailSignUpReq, token: string): Promise<ReaderPassport> {
  return new Fetch()
    .setBearerAuth(token)
    .post(endpoint.wxSignUp)
    .sendJson(v)
    .endJson<ReaderPassport>();
}

export function wxUnlinkEmail(v: WxEmailUnlinkReq, token: string): Promise<ReaderPassport> {
  return new Fetch()
    .setBearerAuth(token)
    .post(endpoint.wxUnlink)
    .sendJson(v)
    .endJson<ReaderPassport>();
}
