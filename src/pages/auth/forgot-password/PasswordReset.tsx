import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { PasswordResetFormVal, verifyPasswordSchema } from '../../../data/form-value';
import { sitemap } from '../../../data/sitemap';
import { TextInput } from '../../../components/controls/TextInput';
import ProgressButton from '../../../components/buttons/ProgressButton';
import { cancelSource, resetPassword, verifyPwToken } from '../../../repository/auth';
import { ResponseError } from '../../../repository/response-error';
import Alert from 'react-bootstrap/Alert';
import { PasswordResetVerified } from '../../../data/password-reset';

function ResetPasswordForm(props: PasswordResetVerified) {
  const [ done, setDone ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');

  return done ? (
    <div>
      <div className="text-center">密码已更新</div>
      <div className="d-grid mt-3">
        <Link to={sitemap.login} className="btn btn-primary">登录</Link>
      </div>
    </div>
  ) : (
    <Formik<PasswordResetFormVal>
      initialValues={{
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object(verifyPasswordSchema)}
      onSubmit={(values, helper) => {
        helper.setSubmitting(true);

        resetPassword({
          token: props.token,
          password: values.password
        })
          .then(ok => {
            helper.setSubmitting(!ok);
            setDone(ok);
          })
          .catch((err: ResponseError) => {
            helper.setSubmitting(false);
            if (err.invalid) {
              helper.setErrors(err.toFormFields);
              return;
            }
            setErrMsg(err.message);
          });
      }}
    >
      { formik => (
        <>
          <h4 className="text-center">更改 {props.email} 的密码</h4>

          {
            errMsg &&
            <Alert
              variant="danger"
              dismissible
              onClose={() => setErrMsg('')}>
              {errMsg}
            </Alert>
          }

          <Form>
            <TextInput
              label="密码"
              name="password"
              type="password"
            />
            <TextInput
              label="确认密码"
              name="confirmPassword"
              type="password"
            />
            <div className="d-grid">
              <ProgressButton
                disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
                text="重置"
                isSubmitting={formik.isSubmitting}/>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}

function VerifyToken(props: {
  token: string,
  onVerified: (v: PasswordResetVerified) => void
}) {
  const [ progress, setProgress ] = useState(true);
  const [ notFound, setNotFound ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');

  useEffect(() => {
    verifyPwToken(props.token)
      .then(v => {
        props.onVerified(v);
      })
      .catch((err: ResponseError) => {
        setProgress(false);

        if (err.notFound) {
          setNotFound(true);
          return;
        }

        setErrMsg(err.message);
      });

    return function() {
      cancelSource.cancel('Operation cancelled by the user.');
    };
  }, []);

  if (progress) {
    return (
      <div className="text-center">
        正在验证...
      </div>
    );
  }

  if (notFound) {
    return <div className="text-center">
      无法重置密码。您似乎使用了无效的重置密码链接，请重新<Link to={sitemap.passwordReset}>获取重置密码邮件</Link>或直接<Link to={sitemap.login}>登录</Link>
    </div>;
  }

  if (errMsg) {
    return (
      <Alert
        variant="danger"
        dismissible
        onClose={() => setErrMsg('')}>
        {errMsg}
      </Alert>
    );
  }

  return <></>;
}

export function PasswordReset() {
  const [ verified, setVerified ] = useState<PasswordResetVerified | undefined>(undefined);

  const { token } = useParams<{token: string}>();

  if (verified) {
    return <ResetPasswordForm {...verified} />;
  }

  return <VerifyToken
    token={token}
    onVerified={setVerified}/>;
}
