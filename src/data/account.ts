import { LoginMethod } from './enum';
import { isMemberExpired, Membership } from './membership';

export type Wechat = {
  nickname: string | null;
  avatarUrl: string | null;
}
export type BaseAccount = {
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

export function accountVerified(account: ReaderAccount): ReaderAccount {
  account.isVerified = true;
  return account;
}

export function isAccountWxOnly(a: ReaderAccount): boolean {
  return (!a.id) && (!!a.unionId);
}

export function isAccountFtcOnly(a: ReaderAccount): boolean {
  return (!!a.id) && (!a.unionId);
}

export function isAccountLinked(a: ReaderAccount): boolean {
  return !!(a.id && a.unionId);
}

export function isAccountEqual(a: ReaderAccount, b: ReaderAccount): boolean {
  return a.id === b.id;
}

export function isEmailAccount(a: ReaderAccount): boolean {
  return !!a.email
}

type LinkingAccounts = {
  ftc: ReaderAccount;
  wx: ReaderAccount;
};

export function isLinkable({ftc, wx}: LinkingAccounts): string {
  if (isAccountEqual(ftc, wx)) {
    return '两个账号已经绑定，无需操作。如果您未看到绑定后的账号信息，请点击"账号安全"刷新。';
  }

  if (isAccountLinked(ftc)) {
    return `账号 ${ftc.email} 已经绑定了其他微信账号。一个FT中文网账号只能绑定一个微信账号。`;
  }

  if (isAccountLinked(wx)) {
    return `微信账号 ${wx.wechat.nickname} 已经绑定了其他FT中文网账号。一个FT中文网账号只能绑定一个微信账号。`;
  }

  if (
    !isMemberExpired(ftc.membership) &&
    !isMemberExpired(wx.membership)
  ) {
    return `您的微信账号和FT中文网的账号均购买了会员服务，两个会员均未到期。合并账号会删除其中一个账号的会员信息。为保障您的权益，暂不支持绑定两个会员未过期的账号。您可以寻求客服帮助。`;
  }

  return '';
}

export interface ReaderPassport extends ReaderAccount {
  expiresAt: number;
  token: string;
}

export type PassportProp = {
  passport: ReaderPassport;
};

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

