const paywallBasePath = '/api/paywall';
const readerBase = '/api/reader';

const emailAuthBase = `${readerBase}/auth/email`;
const mobileAuthBase = `${readerBase}/auth/mobile`;
const wxAuthBase = `${readerBase}/auth/wx`;
const pwResetBase = `${readerBase}/auth/password-reset`;
const accountBase = `${readerBase}/account`;
const subsBase = `${readerBase}/subs`;

export const endpoint = {
  emailExists: `${emailAuthBase}/exists`,
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

  wxCode: `${wxAuthBase}/code`,
  wxLogin: `${wxAuthBase}/login`,
  wxRefresh: `${wxAuthBase}/refresh`,

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
  aliOrder: `${subsBase}/ali/desktop`,
  wxOrder: `${subsBase}/wx/desktop`,
  paywall: paywallBasePath,
  stripePrices: `${paywallBasePath}/stripes`,
  stripePriceOf: function(id: string): string {
    return `${paywallBasePath}/stripes/${id}`;
  },
};
