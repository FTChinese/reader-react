import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { TextInput } from '../../../components/controls/TextInput';
import ProgressButton from '../../../components/buttons/ProgressButton';
import { EmailFormVal, invalidMessages } from '../../../data/form-value';
import { sitemap } from '../../../data/sitemap';
import { requestPasswordReset } from '../../../repository/auth';
import { ResponseError } from '../../../repository/response-error';
import Alert from 'react-bootstrap/Alert';

function ForgotPasswordForm() {
  const [ done, setDone ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');

  return done ? (
    <div>
      <span>请检查您的邮件，点击邮件中的“重置密码”按钮修改您的密码。如果几分钟内没有看到邮件，请检查是否被放进了垃圾邮件列表。</span>
      <div className="d-grid mt-3">
        <Link to={sitemap.login} className="btn btn-primary">返回</Link>
      </div>
    </div>
  ) : (
    <Formik<EmailFormVal>
      initialValues={{
        email: '',
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email(invalidMessages.invalidEmail)
          .required(invalidMessages.required)
      })}
      onSubmit={(values, helper) => {
        helper.setSubmitting(true);

        requestPasswordReset(values)
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
              label="邮箱"
              name="email"
              type="email"
              placeholder="name@example.com"
              desc="请输入您的电子邮箱，我们会向该邮箱发送邮件，帮您重置密码"
            />

            <div className="d-grid">
              <ProgressButton
                disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
                text="发送邮件"
                isSubmitting={formik.isSubmitting}/>
            </div>
          </Form>
        </>

      )}
    </Formik>
  );
}

export function RequestPasswordReset() {
  return (
    <>
      <h2 className="text-center">找回密码</h2>
      <ForgotPasswordForm />
    </>
  );
}
