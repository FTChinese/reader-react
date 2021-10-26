import { useState} from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../store/AuthContext';
import { AuthLayout } from '../components/Layout';
import { sitemap } from '../data/sitemap';
import { emailSignUp } from '../repository/auth';
import { ResponseError } from '../repository/response-error';
import { SignUpForm } from '../components/forms/SignUpForm';

export function SignUpPage() {
  const { setLoggedIn } = useAuthContext();
  const [ errMsg, setErrMsg ] = useState('');

  return (
    <AuthLayout
      title="注册">
      <>
        <SignUpForm
          onSubmit={(values, helper) => {
            setErrMsg('');
            helper.setSubmitting(true);
            emailSignUp(values)
              .then(passport => {
                helper.setSubmitting(false);
                setLoggedIn(passport);
              })
              .catch((err: ResponseError) => {
                helper.setSubmitting(false);
                if (err.invalid) {
                  if (err.invalid.field === 'email') {
                    helper.setErrors({
                      'email': '该账号已经注册，请直接登录'
                    });
                  } else {
                    helper.setErrors(err.toFormFields);
                  }
                  return;
                }
                setErrMsg(err.message);
              });
          }}
          errMsg={errMsg}
        />
        <div className="mt-2">
          <Link to={sitemap.login}>登录</Link>
        </div>
      </>
    </AuthLayout>
  );
}
