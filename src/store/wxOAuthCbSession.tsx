import { WxOAuthCodeReq, WxOAuthCodeSession } from '../data/authentication';
import { WxOAuthKind } from '../data/enum';
import { unixNow } from '../utils/now';

const key = 'fta_wxauth';

export const wxOAuthCbSession = {

  save(req: WxOAuthCodeReq, k: WxOAuthKind) {
    const sess: WxOAuthCodeSession = {
      ...req,
      expiresAt: unixNow() + 5 * 60,
      kind: k,
    }

    localStorage.setItem(key, JSON.stringify(sess));
  },

  load(): WxOAuthCodeSession | null {
    const v = localStorage.getItem(key);
    if (!v) {
      return null;
    }

    return JSON.parse(v) as WxOAuthCodeSession;
  },

  remove() {
    localStorage.removeItem(key);
  }
}

