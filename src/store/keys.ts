import { WxOAuthCodeReq, WxOAuthCodeSession } from '../data/authentication';
import { WxOAuthKind } from '../data/enum';
import { unixNow } from '../utils/now';

export const storeKeyAccount = 'fta-reader';
const storeKeyWxLogin = 'fta-wx-oauth'

export const wxCodeSessionStore = {

  save(req: WxOAuthCodeReq, k: WxOAuthKind) {
    const sess: WxOAuthCodeSession = {
      ...req,
      expiresAt: unixNow() + 5 * 60,
      kind: k,
    }

    localStorage.setItem(storeKeyWxLogin, JSON.stringify(sess));
  },

  load(): WxOAuthCodeSession | null {
    const v = localStorage.getItem(storeKeyWxLogin);
    if (!v) {
      return null;
    }

    return JSON.parse(v) as WxOAuthCodeSession;
  },

  remove() {
    localStorage.removeItem(storeKeyWxLogin);
  }
}
