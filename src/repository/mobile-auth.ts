import { endpoint } from './endpoint';
import { MobileFormVal, MobileLinkExistingEmailReq, MobileLinkNewEmailReq, VerifySMSFormVal } from '../data/mobile';
import { ReaderPassport } from '../data/account';
import { Fetch } from './request';


export function requestMobileLoginSMS(v: MobileFormVal): Promise<boolean> {
  return new Fetch()
    .put(endpoint.smsLogin)
    .sendJson(v)
    .endOrReject()
    .then(resp => {
      return resp.status === 204;
    });
}

export function verifyMobileLoginSMS(v: VerifySMSFormVal): Promise<ReaderPassport> {
  return new Fetch()
    .post(endpoint.smsLogin)
    .sendJson(v)
    .endJson<ReaderPassport>();
}

// Create mobile-only account
export function mobileSignUp(v: MobileFormVal): Promise<ReaderPassport> {
  return new Fetch()
    .post(endpoint.mobileSignUp)
    .sendJson(v)
    .endJson<ReaderPassport>();
}

// A mobile number wants to link to an existing email account.
export function mobileLinkExistingEmail(req: MobileLinkExistingEmailReq): Promise<ReaderPassport> {
  return new Fetch()
    .post(endpoint.mobileLinkEmail)
    .sendJson(req)
    .endJson<ReaderPassport>();
}

export function mobileLinkNewEmail(req: MobileLinkNewEmailReq): Promise<ReaderPassport> {
  return new Fetch()
    .post(endpoint.emailSignUp)
    .sendJson(req)
    .endJson<ReaderPassport>();
}
