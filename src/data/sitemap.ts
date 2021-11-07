export const sitemap = {
  home: '/',
  login: '/login',
  signUp: '/signup',
  authCallback: '/oauth/callback',
  forgotPassword: '/forgot-password',
  passwordReset: '/password-reset',
  verification: '/verification',
  membership: '/membership',
  subs: '/subscription',
};

export function passwordResetUrl(baseUrl: string): string {
  return `${baseUrl}/reader${sitemap.passwordReset}`;
}

export function emailVerificationUrl(baseUrl: string): string {
  return `${baseUrl}/reader${sitemap.verification}`;
}
