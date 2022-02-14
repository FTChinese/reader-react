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
  stripeCustomerOf: function(id: string): string {
    return `${stripeCusBase}/${id}`;
  },
  stripeCusDefaultPM: function(id: string): string {
    return `${stripeCusBase}/${id}/default-payment-method`;
  },


  stripeSubs: stripeSubsBase,
  stripeSubsOf: function(id: string): string {
    return `${stripeSubsBase}/${id}`;
  },
  stripeRefresh: function(id: string): string {
    return `${stripeSubsBase}${id}/refresh`;
  },
  stripeCancel: function(id: string): string {
    return `${stripeSubsBase}/${id}/cancel`;
  },
  stripeReactivate: function(id: string): string {
    return `${stripeSubsBase}/${id}/reactivate`;
  },
  stripeSubsDefaultPM: function(id: string): string {
    return `${stripeSubsBase}/${id}/default-payment-method`;
  },

  stripePaymentMethods: stripePMBase,
  stripePMOf: function(id: string): string {
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
