import { WxUnlinkAnchor } from './enum'

export type WxEmailLinkReq = {
  ftcId: string;
}

export type WxEmailUnlinkReq = {
  ftcId: string;
  anchor?: WxUnlinkAnchor;
}
