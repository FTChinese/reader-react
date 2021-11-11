import { EmailVal } from "./form-value";

export type PwResetLetterReq = EmailVal & {
  sourceUrl: string;
};
export interface PasswordResetVerified {
  email: string;
  token: string;
}

export type PasswordResetFormVal = {
  password: string;
  confirmPassword: string;
};

// Request parameters sent to reset password.
export interface PasswordResetReqParams {
  token: string;
  password: string;
}
