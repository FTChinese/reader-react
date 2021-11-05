import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import * as Yup from 'yup';
import { UpdatePasswordFormVal, toastMessages, verifyPasswordSchema } from '../../data/form-value';
import { updatePassword } from '../../repository/reader-account';
import { ResponseError } from '../../repository/response-error';
import ProgressButton from '../buttons/ProgressButton';
import { TextInput } from '../controls/TextInput';
import { AccountRow } from "./AccountRow";

export function DisplayPassword(
  props: {
    token: string;
  }
) {

  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = (
    values: UpdatePasswordFormVal,
    helpers: FormikHelpers<UpdatePasswordFormVal>
  ) => {
    helpers.setSubmitting(true);

    updatePassword(values, props.token)
      .then(ok => {
        helpers.setSubmitting(!ok);
        if (ok) {
          alert(toastMessages.updateSuccess);
        } else {
          alert(toastMessages.unknownErr);
        }
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        if (err.invalid) {
          helpers.setErrors(err.toFormFields);
          return;
        }

        setErrMsg(err.message);
      });
  }

  return (
    <AccountRow
      title="密码"
      isEditing={editing}
      onEdit={() => setEditing(!editing)}
    >
      {
        editing ?

        <UpdatePasswordForm
          onSubmit={handleSubmit}
          errMsg={errMsg}
          onCancel={() => setEditing(false)}
        /> :
        <div>*******</div>
      }
    </AccountRow>
  )
}

function UpdatePasswordForm(
  props: {
    onSubmit: (
      values: UpdatePasswordFormVal,
      formikHelpers: FormikHelpers<UpdatePasswordFormVal>
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
      <Formik<UpdatePasswordFormVal>
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object(verifyPasswordSchema)}
        onSubmit={props.onSubmit}
      >
        { formik => (
          <Form>
            <TextInput
              label="当前密码"
              name="currentPassword"
              type="password"
            />
            <TextInput
              label="新密码"
              name="newPassword"
              type="password"
            />
            <TextInput
              label="确认新密码"
              name="confirmPassword"
              type="password"
            />

            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="重置"
              inline={true}
              isSubmitting={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
