import { unixNow } from '../utils/now';
import { Credentials } from './form-value';

export type SignupFormVal = Credentials & {
  confirmPassword: string;
};

export type EmailSignUpReq = Credentials & {
  sourceUrl: string;
}

/**
 * @description Used to request user consent to login with wechat.
 */
 export type WxOAuthCodeReq = {
  state: string;
  expiresAt: number; // Expiration time after which the state should be regarded as expired.
  redirectTo: string; // The URL to request wechat to show QR code.
}

export type WxOAuthCodeResp = {
  code?: string; // Won't exist if user denied authorization
  state: string;
}

function validateWxOAuthCode(resp: WxOAuthCodeResp, req?: WxOAuthCodeReq): string {
  if (!req) {
    return '验证请求数据缺失';
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

/**
 * @description Response of WxLoginReq.
 */
export type WxOAuthLoginSession = {
  sessionId: string;
  unionId: string;
  createdAt: string;
}

export type WxRefreshReq = {
  sessionId: string;
};
