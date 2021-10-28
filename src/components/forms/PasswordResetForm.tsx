import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import * as Yup from 'yup';
import { PasswordResetFormVal, verifyPasswordSchema } from '../../data/form-value';
import ProgressButton from '../buttons/ProgressButton';
import { TextInput } from '../controls/TextInput';

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
