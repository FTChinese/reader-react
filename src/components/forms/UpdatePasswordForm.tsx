import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { verifyPasswordSchema } from '../../data/form-value';
import { UpdatePasswordFormVal } from '../../data/update-account';
import { TextInput } from '../controls/TextInput';
import * as Yup from 'yup';
import { FormikSubmitButton } from '../controls/FormikSubmitButton';

export function UpdatePasswordForm(
  props: {
    onSubmit: (
      values: UpdatePasswordFormVal,
      formikHelpers: FormikHelpers<UpdatePasswordFormVal>
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
      <Formik<UpdatePasswordFormVal>
        initialValues={{
          currentPassword: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object(verifyPasswordSchema)}
        onSubmit={props.onSubmit}
      >
        <Form>
          <TextInput
            label="当前密码"
            name="currentPassword"
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
          <FormikSubmitButton
            text="重置"
            wrapped="end"
          />
        </Form>
      </Formik>
    </>
  );
}
