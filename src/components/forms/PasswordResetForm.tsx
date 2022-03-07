import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { verifyPasswordSchema } from '../../data/form-value';
import { PasswordResetFormVal } from '../../data/password-reset';
import { FormikSubmitButton } from '../controls/FormikSubmitButton';
import { TextInput } from '../controls/TextInput';
import { ErrorAlert } from '../progress/ErrorAlert';

export function PasswordResetForm(
  props: {
    email: string;
    onSubmit: (
      values: PasswordResetFormVal,
      formikHelpers: FormikHelpers<PasswordResetFormVal>
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
    <Formik<PasswordResetFormVal>
      initialValues={{
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object(verifyPasswordSchema)}
      onSubmit={props.onSubmit}
    >
      <>
        <h4 className="text-center">更改 {props.email} 的密码</h4>

        <ErrorAlert
          msg={errMsg}
          onClose={() => setErrMsg('')}
        />
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
          <FormikSubmitButton
            text="重置"
            wrapped="block"
          />
        </Form>
      </>
    </Formik>
  );
}
