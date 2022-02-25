export const siteRoot = {
  login: 'login',
  signUp: 'signup',
  forgotPassword: 'forgot-password',
  passwordReset: 'password-reset',
  verification: 'verification',
  membership: 'membership',
  subs: 'subscription',
  checkout: 'checkout',
  wxOAuthCb: 'callback/wx-oauth', // This is set in the subscription-api.
  stripeSetupCb: 'callback/stripe-setup',
  alipayCb: 'callback/alipay',
  wxpayCb: 'callback/wxpay'
};

export const sitemap = {
  home: '/',
  login: `/${siteRoot.login}`,
  signUp: `/${siteRoot.signUp}`,
  forgotPassword: `/${siteRoot.forgotPassword}`,
  passwordReset: `/${siteRoot.passwordReset}`,
  verification: `/${siteRoot.verification}`,
  membership: `/${siteRoot.membership}`,
  subs: `/${siteRoot.subs}`,
  checkout: `/${siteRoot.checkout}`,
  stripeSetupCb: `/${siteRoot.stripeSetupCb}`,
};

/**
 * @description Build the stripe's return_url
 * @example stripeSetupCbUrl(document.location.origin)
 */
export function stripeSetupCbUrl(baseUrl: string): string {
  return `${baseUrl}/reader/${siteRoot.stripeSetupCb}`
}

export function passwordResetUrl(baseUrl: string): string {
  return `${baseUrl}/reader/${siteRoot.passwordReset}`;
}

export function emailVerificationUrl(baseUrl: string): string {
  return `${baseUrl}/reader/${siteRoot.verification}`;
}

export function alipayCallback(baseUrl: string): string {
  return `${baseUrl}/reader/${siteRoot.alipayCb}`;
}
