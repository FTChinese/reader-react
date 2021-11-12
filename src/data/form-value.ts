import * as Yup from 'yup';

export const invalidMessages = {
  required: '必填项',
  invalidEmail: '无效的邮箱',
  invalidPassword: '必须包含数字和字母，不能少于8位',
  passwordMismatch: '两次输入的密码必须相同',
  smsNotFound: '验证码无效！',
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
  unknownErr: '失败：未知错误',
  smsSent: '验证码已发送',
  smsFailed: '发送失败，请重试'
};

export type EmailVal = {
  email: string;
};

export type Credentials = EmailVal & {
  password: string;
}





