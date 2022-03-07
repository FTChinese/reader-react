export const sitePath = {
  login: 'login',
  signUp: 'signup',
  forgotPassword: 'forgot-password',
  passwordReset: 'password-reset',
  verification: 'verification',
  setting: 'settings',
  stripe: 'stripe',
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
  login: `/${sitePath.login}`,
  signUp: `/${sitePath.signUp}`,
  forgotPassword: `/${sitePath.forgotPassword}`,
  passwordReset: `/${sitePath.passwordReset}`,
  verification: `/${sitePath.verification}`,
  settings: `/${sitePath.setting}`,
  stripeSetting: `/${sitePath.setting}/${sitePath.stripe}`,
  membership: `/${sitePath.membership}`,
  subs: `/${sitePath.subs}`,
  checkout: `/${sitePath.checkout}`,
  stripeSetupCb: `/${sitePath.stripeSetupCb}`,
};

/**
 * @description Build the stripe's return_url
 * @example stripeSetupCbUrl(document.location.origin)
 */
export function stripeSetupCbUrl(baseUrl: string): string {
  return `${baseUrl}/reader/${sitePath.stripeSetupCb}`
}

export function passwordResetUrl(baseUrl: string): string {
  return `${baseUrl}/reader/${sitePath.passwordReset}`;
}

export function emailVerificationUrl(baseUrl: string): string {
  return `${baseUrl}/reader/${sitePath.verification}`;
}

export function alipayCallback(baseUrl: string): string {
  return `${baseUrl}/reader/${sitePath.alipayCb}`;
}
