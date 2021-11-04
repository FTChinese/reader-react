import { Formik, Form, FormikHelpers } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import * as Yup from 'yup';
import { EmailFormVal, invalidMessages } from '../../data/form-value';
import ProgressButton from '../buttons/ProgressButton';
import { TextInput } from '../controls/TextInput';

export function RequestPwResetForm(
  props: {
    onSubmit: (
      values: EmailFormVal,
      formikHelpers: FormikHelpers<EmailFormVal>
    ) => void | Promise<any>;
    errMsg: string;
  }
) {

  const [errMsg, setErrMsg] = useState('')

  // Sync props error message to state.
  // Must use props.errMsg to detect changes.
  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);

  return (
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
      <Formik<EmailFormVal>
        initialValues={{
          email: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email(invalidMessages.invalidEmail)
            .required(invalidMessages.required)
        })}
        onSubmit={props.onSubmit}
      >
        { formik => (
          <Form>
            <TextInput
              label="邮箱"
              name="email"
              type="email"
              placeholder="name@example.com"
              desc="请输入您的电子邮箱，我们会向该邮箱发送邮件，帮您重置密码"
            />

            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="发送邮件"
              isSubmitting={formik.isSubmitting}/>
          </Form>
        )}
      </Formik>
    </>
  );
}
