export type StringPair = [string, string];

export function pairWxName(nickname: string | null): StringPair {
  return ['微信', nickname || '-'];
}

export function pairMobile(mobile: string | null): StringPair {
  return ['手机', mobile || ''];
}

export function pairEmail(email: string): StringPair {
  return ['邮箱', email];
}
