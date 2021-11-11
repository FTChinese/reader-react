import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import { Link, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import ProgressButton from '../components/buttons/ProgressButton';
import { TextInput } from '../components/controls/TextInput';
import { CenterLayout } from '../components/Layout';
import { verifyPasswordSchema } from '../data/form-value';
import { PasswordResetFormVal, PasswordResetVerified } from '../data/password-reset';
import { sitemap } from '../data/sitemap';
import { ResponseError } from '../repository/response-error';
import { resetPassword, verifyPwToken } from '../repository/password-reset';
import { cancelSource } from '../repository/cancel';

function ResetPassword(
  props: PasswordResetVerified
) {
  const [ done, setDone ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');

  if (done) {
    return (
      <div>
        <div className="text-center">密码已更新</div>
        <div className="d-grid mt-3">
          <Link to={sitemap.login} className="btn btn-primary">登录</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (
    values: PasswordResetFormVal,
    helper: FormikHelpers<PasswordResetFormVal>
  ) => {
    setErrMsg('');
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
  }

  return (
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
      <Formik<PasswordResetFormVal>
        initialValues={{
          password: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object(verifyPasswordSchema)}
        onSubmit={handleSubmit}
      >
        { formik => (
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
        )}
      </Formik>
    </>
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
    return (
      <div className="text-center">
        <h5>无法重置密码</h5>
        <p>
        您似乎使用了无效的重置密码链接，请重新<Link to={sitemap.forgotPassword}>获取重置密码邮件</Link>或直接<Link to={sitemap.login}>登录</Link>
        </p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <>
        <h5 className="text-center">验证过程出错了!</h5>
        <Alert
          variant="danger"
        >
          {errMsg}
        </Alert>
      </>
    );
  }

  return <></>;
}

export function PasswordReset(
  props: {
    token: string;
  }
) {
  const [ verified, setVerified ] = useState<PasswordResetVerified | undefined>(undefined);

  if (verified) {
    return <ResetPassword {...verified} />;
  }

  return <VerifyToken
    token={props.token}
    onVerified={setVerified}/>;
}

export function PasswordResetPage() {

  const { token } = useParams<{token: string}>();

  return (
    <CenterLayout>
       <PasswordReset
          token={token}
       />
    </CenterLayout>
  );
}
