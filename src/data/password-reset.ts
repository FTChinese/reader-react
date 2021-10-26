export interface PasswordResetVerified {
  email: string;
  token: string;
}

// Request parameters sent to reset password.
export interface PasswordResetReqParams {
  token: string;
  password: string;
}
