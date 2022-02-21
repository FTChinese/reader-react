const paywallBasePath = '/api/paywall';
const readerBase = '/api/reader';
const serviceBase = '/service';

const emailAuthBase = `${readerBase}/auth/email`;
const mobileAuthBase = `${readerBase}/auth/mobile`;
const wxAuthBase = `${readerBase}/auth/wx`;
const pwResetBase = `${readerBase}/auth/password-reset`;
const accountBase = `${readerBase}/account`;
const ftcpayBase = `${readerBase}/ftc-pay`;
const stripeCusBase = `${readerBase}/stripe/customers`;
const stripeSubsBase = `${readerBase}/stripe/subs`;
const stripePMBase = `${readerBase}/stripe/payment-methods`;
const stripeSetupBase = `${readerBase}/stripe/setup-intents`;

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
  aliOrder: `${ftcpayBase}/ali/desktop`,
  wxOrder: `${ftcpayBase}/wx/desktop`,
  paywall: paywallBasePath,

  stripePubKey: `${paywallBasePath}/stripe/publishable-key`,
  stripePrices: `${paywallBasePath}/stripe/prices`,
  stripePriceOf: function(id: string): string {
    return `${paywallBasePath}/stripe/prices/${id}`;
  },

  stripeCustomers: stripeCusBase,
  customerOf: function(id: string): string {
    return `${stripeCusBase}/${id}`;
  },
  cusPaymentMethods: function(id:  string): string {
    return `${stripeCusBase}/${id}/payment-methods`;
  },
  cusDefaultPayMethod: function(id: string): string {
    return `${stripeCusBase}/${id}/default-payment-method`;
  },

  setupIntent: stripeSetupBase,
  payMethodOfSetup: function(id: string): string {
    return `${stripeSetupBase}/${id}/payment-method`;
  },

  stripeSubs: stripeSubsBase,
  stripeSubsOf: function(id: string): string {
    return `${stripeSubsBase}/${id}`;
  },
  refreshSubs: function(id: string): string {
    return `${stripeSubsBase}${id}/refresh`;
  },
  cancelSubs: function(id: string): string {
    return `${stripeSubsBase}/${id}/cancel`;
  },
  reactivateSubs: function(id: string): string {
    return `${stripeSubsBase}/${id}/reactivate`;
  },
  subsDefaultPayMethod: function(id: string): string {
    return `${stripeSubsBase}/${id}/default-payment-method`;
  },

  paymentMethods: stripePMBase,
  paymentMethodOf: function(id: string): string {
    return `${stripePMBase}/${id}`;
  },

  qrSrc: function(url: string): string {
    const query = new URLSearchParams({
        url,
      })
      .toString();
    return `${serviceBase}/qr?${query}`;
  }
};
