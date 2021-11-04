import { Formik, Form } from 'formik';
import {useState } from 'react';
import * as Yup from 'yup';
import { Unauthorized } from '../components/routes/Unauthorized';
import { useAuthContext } from '../store/AuthContext';
import { ResponseError } from '../repository/response-error';
import { ContentLayout } from '../components/Layout';
import { TextInput } from '../components/controls/TextInput';
import ProgressButton from '../components/buttons/ProgressButton';
import { invalidMessages, PasswordUpdateFormVal, toastMessages, verifyPasswordSchema } from '../data/form-value';
import Alert from 'react-bootstrap/Alert';
import { updatePassword } from '../repository/reader-account';
import { ReaderPassport } from '../data/account';

function UpdatePassword(props: {
  passport: ReaderPassport
}) {
  const [ errMsg, setErrMsg ] = useState('');

  return (
    <div>
      <h2 className="mb-3 mt-3 pt-3 border-top">修改登录密码</h2>

      <Formik<PasswordUpdateFormVal>
        initialValues={{
          oldPassword: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object({
          oldPassword: Yup.string()
            .min(8, '密码无效')
            .required(invalidMessages.required),
          ...verifyPasswordSchema
        })}
        onSubmit={(values, helper) => {
          helper.setSubmitting(true);

          updatePassword(values, props.passport)
            .then(ok => {
              helper.setSubmitting(!ok);
              if (ok) {
                alert(toastMessages.updateSuccess);
              } else {
                alert(toastMessages.unknownErr);
              }
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
                variant="error"
                dismissible
                onClose={() => setErrMsg('')}>
                {errMsg}
              </Alert>
            }

            <Form>
              <TextInput
                label="当前密码"
                name="oldPassword"
                type="password"
              />
              <TextInput
                label="新密码"
                name="password"
                type="password"
              />
              <TextInput
                label="确认新密码"
                name="confirmPassword"
                type="password"
              />
              <ProgressButton
                disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
                text="保存"
                isSubmitting={formik.isSubmitting}
                inline={true}
              />
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}


export function SettingPage() {
  const { passport } = useAuthContext();

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <ContentLayout>
      <div className="row">
        <div className="col-sm-6">
          <UpdatePassword passport={passport} />
        </div>
      </div>
    </ContentLayout>
  );
}

