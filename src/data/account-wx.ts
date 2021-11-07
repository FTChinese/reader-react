export type WxEmailLinkReq = {
  ftcId: string;
}

export type WxEmailUnlinkReq = {
  ftcId: string;
  anchor?: 'ftc' | 'wechat';
}
