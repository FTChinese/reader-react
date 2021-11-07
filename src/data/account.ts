import { unixNow } from '../utils/now';
import { LoginMethod } from './enum';
import { Membership } from './membership';

export class Wechat {
  nickname?: string;
  avatarUrl?: string;
}
export interface BaseAccount {
  id: string;
  unionId: string | null;
  stripeId: string | null;
  email: string;
  mobile: string | null;
  userName: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  campaignCode: string | null;
}

export function isMobileDerivedEmail(email: string): boolean {
  return email.endsWith('@ftchinese.user')
}

export function normalizeEmail(email: string): string {
  if (isMobileDerivedEmail(email)) {
    return '';
  }

  return email;
}

export function isTestAccount(a: BaseAccount): boolean {
  return a.email.endsWith('.test@ftchinese.com');
}

export type ReaderAccount = BaseAccount & {
  loginMethod: LoginMethod;
  wechat: Wechat;
  membership: Membership;
}

export function getDisplayName(account: ReaderAccount): string {
  if (account.userName) {
    return account.userName;
  }

  if (account.wechat.nickname) {
    return account.wechat.nickname;
  }

  if (account.email) {
    return account.email.split('@')[0];
  }

  return '';
}

export interface ReaderPassport extends ReaderAccount {
  expiresAt: number;
  token: string;
}

export function authHeader(p: ReaderPassport): { [key: string]: string } {
  return {
    'Authorization': `Bearer ${p.token}`,
  };
}

export function bearerAuthHeader(token: string): { [key: string]: string } {
  return {
    'Authorization': `Bearer ${token}`,
  };
}

export function isLoginExpired(pp: ReaderPassport): boolean {
  return (Date.now() / 1000) > pp.expiresAt;
}

export type SearchResult = {
  id: string | null;
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

export type WxOAuthLoginSession = {
  sessionId: string;
  unionId: string;
  createdAt: string;
}
