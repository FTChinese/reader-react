import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import * as Yup from 'yup';
import { PasswordUpdateFormVal, verifyPasswordSchema } from '../../data/form-value';
import ProgressButton from '../buttons/ProgressButton';
import { TextInput } from '../controls/TextInput';
import { AccountRow } from "./AccountRow";

export function DisplayPassword() {

  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  return (
    <AccountRow
      title="密码"
    >
      <div>
        *******
        <button
          className="btn btn-link"
        >修改</button>
      </div>
    </AccountRow>
  )
}

function UpdatePasswordForm(
  props: {
    onSubmit: (
      values: PasswordUpdateFormVal,
      formikHelpers: FormikHelpers<PasswordUpdateFormVal>
    ) => void | Promise<any>;
    errMsg: string;
    onCancel: () => void;
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
      <Formik<PasswordUpdateFormVal>
        initialValues={{
          oldPassword: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object(verifyPasswordSchema)}
        onSubmit={props.onSubmit}
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
            <div className="d-flex justify-content-end">
              <button className="btn btn-link"
                onClick={props.onCancel}
              >
                取消
              </button>
              <ProgressButton
                disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
                text="重置"
                isSubmitting={formik.isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
