const paywallBasePath = '/api/paywall';
const readerBase = '/api/reader';
const serviceBase = '/service';

const emailAuthBase = `${readerBase}/auth/email`;
const mobileAuthBase = `${readerBase}/auth/mobile`;
const wxAuthBase = `${readerBase}/auth/wx`;
const pwResetBase = `${readerBase}/auth/password-reset`;
const accountBase = `${readerBase}/account`;
const memberBase = `${readerBase}/membership`;
const iapBase = `${readerBase}/apple`;
const ftcpayBase = `${readerBase}/ftc-pay`;

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

  membership: memberBase,
  memberAddon: `${memberBase}/addons`,

  aliOrder: `${ftcpayBase}/ali/desktop`,
  wxOrder: `${ftcpayBase}/wx/desktop`,
  verifyOrderOf: function(id: string): string {
    return `${ftcpayBase}/orders/${id}/verify`;
  },
  paywall: paywallBasePath,

  iapSubsOf: function(id: string): string {
    return `${iapBase}/subs/${id}`;
  },

  stripePubKey: `${paywallBasePath}/stripe/publishable-key`,

  stripeCustomers: `${readerBase}/stripe/customers`,
  setupIntent: `${readerBase}/stripe/setup-intents`,
  stripeSubs: `${readerBase}/stripe/subs`,
  paymentMethods: `${readerBase}/stripe/payment-methods`,

  qrSrc: function(url: string): string {
    const query = new URLSearchParams({
        url,
      })
      .toString();
    return `${serviceBase}/qr?${query}`;
  }
};
