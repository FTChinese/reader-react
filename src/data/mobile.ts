import { Credentials } from "./form-value";

// Used to send sms, or create new mobile-only account.
export type MobileFormVal = {
  mobile: string;
};

export type VerifySMSFormVal = MobileFormVal & {
  code: string;
};

export type MobileLinkExistingEmailReq = Credentials & MobileFormVal;

export type MobileLinkNewEmailReq = Credentials & MobileFormVal & {
  sourceUrl: string;
};
