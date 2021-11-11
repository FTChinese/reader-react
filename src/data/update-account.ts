import { EmailVal } from "./form-value";

export type UpdateNameFormVal = {
  userName: string;
};

export type UpdateEmailReq = EmailVal & {
  sourceUrl: string;
}

export type UpdatePasswordReq = {
  currentPassword: string;
  newPassword: string;
};

export type UpdatePasswordFormVal = UpdatePasswordReq & {
  confirmPassword: string;
};
