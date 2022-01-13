export const siteRoot = {
  login: 'login',
  signUp: 'signup',
  authCallback: 'oauth/callback',
  forgotPassword: 'forgot-password',
  passwordReset: 'password-reset',
  verification: 'verification',
  membership: 'membership',
  subs: 'subscription',
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
};

export function passwordResetUrl(baseUrl: string): string {
  return `${baseUrl}/reader${sitemap.passwordReset}`;
}

export function emailVerificationUrl(baseUrl: string): string {
  return `${baseUrl}/reader${sitemap.verification}`;
}
