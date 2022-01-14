import { useState} from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../store/AuthContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { emailVerificationUrl, sitemap } from '../data/sitemap';
import { emailSignUp } from '../repository/email-auth';
import { isCodeAlreadyExists, ResponseError } from '../repository/response-error';
import { SignUpForm } from '../components/forms/SignUpForm';
import { FormikHelpers } from 'formik';
import { SignupFormVal } from '../data/authentication';
import { invalidMessages } from '../data/form-value';

export function SignUpPage() {

  const { setLoggedIn } = useAuthContext();
  const [ errMsg, setErrMsg ] = useState('');

  const handleSubmit = (values: SignupFormVal, helper: FormikHelpers<SignupFormVal>) => {
    setErrMsg('');
    helper.setSubmitting(true);

    emailSignUp({
      email: values.email,
      password: values.password,
      sourceUrl: emailVerificationUrl(window.location.origin)
    })
      .then(passport => {
        helper.setSubmitting(false);
        setLoggedIn(passport);
      })
      .catch((err: ResponseError) => {
        helper.setSubmitting(false);
        if (err.invalid) {
          if (isCodeAlreadyExists(err.invalid, 'email')) {
            helper.setErrors({
              email: invalidMessages.emailAlreadyExists,
            });
          } else {
            helper.setErrors(err.toFormFields);
          }
          return;
        }
        setErrMsg(err.message);
      });
  }

  return (
    <AuthLayout
      title="注册">
      <>
        <SignUpForm
          onSubmit={handleSubmit}
          errMsg={errMsg}
        />
        <div className="mt-2">
          <Link to={sitemap.login}>登录</Link>
        </div>
      </>
    </AuthLayout>
  );
}
