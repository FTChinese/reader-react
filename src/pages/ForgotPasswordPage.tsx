import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RequestPwResetForm } from '../components/forms/RequestPwResetForm';
import { CenterLayout } from '../components/Layout';
import { EmailVal } from '../data/form-value';
import { passwordResetUrl, sitemap } from '../data/sitemap';
import { requestPasswordReset } from '../repository/password-reset';
import { ResponseError } from '../repository/response-error';

function RequestPwResetLetter(
  props: {
    baseUrl: string;
  }
) {
  const [ done, setDone ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');

  if (done) {
    return (
      <div>
        <span>请检查您的邮件，点击邮件中的“重置密码”按钮修改您的密码。如果几分钟内没有看到邮件，请检查是否被放进了垃圾邮件列表。</span>
        <div className="d-grid mt-3">
          <Link to={sitemap.login} className="btn btn-primary">返回</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (
    values: EmailVal,
    helper: FormikHelpers<EmailVal>
  ): void | Promise<any> => {
    setErrMsg('');

    helper.setSubmitting(true);

    requestPasswordReset({
      ...values,
      sourceUrl: passwordResetUrl(props.baseUrl),
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
    <RequestPwResetForm
      errMsg={errMsg}
      onSubmit={handleSubmit}
    />
  );
}

export function ForgotPasswordPage() {

  console.log(document.location);
  return (
    <CenterLayout>
      <>
        <h2 className="text-center">找回密码</h2>
        <RequestPwResetLetter
          baseUrl={document.location.origin}
        />
      </>
    </CenterLayout>
  );
}
