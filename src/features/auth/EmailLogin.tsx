import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EmailLoginForm } from '../../components/forms/EmailLoginForm';
import { useAuth } from '../../components/hooks/useAuth';
import { getAuthRedirect } from '../../components/routes/RequireAuth';
import { Credentials } from '../../data/form-value';
import { emailLogin } from '../../repository/email-auth';
import { ResponseError } from '../../repository/response-error';
import { LinkPwResetOrSignUp } from './LinkPwResetOrSignUp';

export function EmailLogin() {
  const { setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [ errMsg, setErrMsg ] = useState('');

  const handleSubmit = (
    values: Credentials,
    helper: FormikHelpers<Credentials>
  ): void | Promise<any> => {
    setErrMsg('');
    helper.setSubmitting(true);

    emailLogin(values)
      .then(passport => {
        setLoggedIn(passport, () => {
          console.log('Login success');
          navigate(getAuthRedirect(location), { replace: true });
        });
      })
      .catch((err: ResponseError) => {
        if (err.invalid) {
          helper.setErrors(err.toFormFields);
          return;
        }
        setErrMsg(err.message);
      })
      .finally(() => {
        helper.setSubmitting(false)
      });
  }

  return (
    <>
      <EmailLoginForm
        onSubmit={handleSubmit}
        errMsg={errMsg}
        btnText="登录"
        email=''
      />

      <LinkPwResetOrSignUp/>
    </>
  );
}
