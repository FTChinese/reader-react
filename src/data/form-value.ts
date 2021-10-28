import * as Yup from 'yup';

export const invalidMessages = {
  required: '必填项',
  invalidEmail: '无效的邮箱',
  invalidPassword: '必须包含数字和字母，不能少于8位',
  passwordMismatch: '两次输入的密码必须相同',
};

export const regex = {
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};

export const verifyPasswordSchema = {
  password: Yup.string()
    .matches(regex.password, invalidMessages.invalidPassword)
    .required(invalidMessages.required),
  confirmPassword: Yup.string()
    .test('password-match', invalidMessages.passwordMismatch, function (value, ctx) {
      return ctx.parent.password === value;
    })
    .required(invalidMessages.required)
};

export const toastMessages = {
  saveSuccess: '保存成功',
  updateSuccess: '更新成功',
  unknownErr: '失败：未知错误'
};

export interface Credentials {
  email: string;
  password: string;
}

export type SignupFormVal = Credentials & {
  confirmPassword: string;
};

export type EmailSignUpReq = Credentials & {
  sourceUrl: string;
}

export type EmailFormVal = {
  email: string;
};

export type PwResetLetterReq = EmailFormVal & {
  sourceUrl: string;
};

export type ResetPwReq = {
  token: string;
  password: string;
};

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

export interface PasswordResetFormVal {
  password: string;
  confirmPassword: string;
}

export interface PasswordUpdateFormVal {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateNameFormVal {
  displayName: string;
}
