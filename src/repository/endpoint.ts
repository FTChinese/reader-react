const paywallBasePath = '/api/paywall';
const readerBase = '/api/reader';
const serviceBase = '/service';

const emailAuthBase = `${readerBase}/auth/email`;
const mobileAuthBase = `${readerBase}/auth/mobile`;
const wxAuthBase = `${readerBase}/auth/wx`;
const pwResetBase = `${readerBase}/auth/password-reset`;
const accountBase = `${readerBase}/account`;
const memberBase = `${readerBase}/membership`;
const ftcpayBase = `${readerBase}/ftc-pay`;

export const endpoint = {
  emailAuth: emailAuthBase,
  emailExists: `${emailAuthBase}/exists`,
  emailLogin: `${emailAuthBase}/login`,
  emailSignUp: `${emailAuthBase}/signup`,

  smsLogin: `${mobileAuthBase}/verification`,
  mobileLinkEmail: `${mobileAuthBase}/link`,
  mobileSignUp: `${mobileAuthBase}/signup`,

  resetPassword: `${pwResetBase}`,
  requestPasswordReset: `${pwResetBase}/letter`,

  wxCode: `${wxAuthBase}/code`,
  wxLogin: `${wxAuthBase}/login`,
  wxRefresh: `${wxAuthBase}/refresh`,

  emailAccount: accountBase,
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

  ftcPayBase: ftcpayBase,
  aliOrder: `${ftcpayBase}/ali/desktop`,
  wxOrder: `${ftcpayBase}/wx/desktop`,

  paywall: paywallBasePath,

  iapSubs: `${readerBase}/apple/subs`,

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
