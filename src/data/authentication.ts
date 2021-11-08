import { unixNow } from '../utils/now';
import { WxOAuthKind } from './enum';
import { Credentials } from './form-value';

export type SignupFormVal = Credentials & {
  confirmPassword: string;
};

export type EmailSignUpReq = Credentials & {
  sourceUrl: string;
}

export type WxOAuthCodeReq = {
  state: string;
  redirectTo: string; // The URL to request wechat to show QR code.
}

/**
 * @description Store WxOAuthCodeReq locally with expiration time.
 */
 export type WxOAuthCodeSession = WxOAuthCodeReq & {
  expiresAt: number; // Expiration time after which the state should be regarded as expired.
  kind: WxOAuthKind;
}

export type WxOAuthCodeResp = {
  code: string | null; // Won't exist if user denied authorization
  state: string | null;
}

export function validateWxOAuthCode(resp: WxOAuthCodeResp, req: WxOAuthCodeSession | null): string {
  if (!req) {
    return '本次会话请求数据缺失';
  }

  if (!resp.code && !resp.state) {
    return '响应参数缺失：code, state';
  }

  if (!resp.code) {
    return '响应参数缺失：code';
  }

  if (!resp.state) {
    return '响应参数缺失：state';
  }

  if (resp.state !== req.state) {
    return '无效的响应的状态';
  }

  if (req.expiresAt < unixNow()) {
    return '本次登录验证已超时';
  }

  return ''
}

/**
 * @description The request body to get access token and userinfo.
 */
export type WxLoginReq = {
  code: string; // Acquired from WxOAuthCodeResp.
};

