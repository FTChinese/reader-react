const paywallBasePath = '/api/paywall';
const readerBase = '/api/reader';

const emailAuthBase = `${readerBase}/auth/email`;
const mobileAuthBase = `${readerBase}/auth/mobile`;
const pwResetBase = `${readerBase}/auth/password-reset`;
const accountBase = `${readerBase}/account`;

export const endpoint = {
  emailLogin: `${emailAuthBase}/login`,
  emailSignUp: `${emailAuthBase}/signup`,
  verifyEmail: function (token: string): string {
    return `${emailAuthBase}/verification/${token}`;
  },
  smsLogin: `${mobileAuthBase}/verification`,
  mobileLinkEmail: `${mobileAuthBase}/link`,
  mobileSignUp: `${mobileAuthBase}/signup`,
  requestPasswordReset: `${pwResetBase}/letter`,
  verifyResetToken: function (token: string): string {
    return `${pwResetBase}/tokens/${token}`;
  },
  resetPassword: `${pwResetBase}`,
  emailAccount: `${accountBase}`,

  // Update account fields
  changeEmail: `${accountBase}/email`,
  requestVerification: `${accountBase}/request-verification`,
  displayName: `${accountBase}/name`,
  changePassword: `${accountBase}/password`,
  verifyMobile: `${accountBase}/mobile/verification`,
  changeMobile: `${accountBase}/mobile`,
  address: `${accountBase}/address`,
  profile: `${accountBase}/profile`,
  wxAccount: `${accountBase}/wx`,
  wxSignUp: `${accountBase}/wx/signup`,
  wxLink: `${accountBase}/wx/link`,
  wxUnlink: `${accountBase}/wx/unlink`,
  paywall: paywallBasePath,
};
