import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import * as Yup from 'yup';
import { normalizeEmail } from '../../data/account';
import { EmailFormVal, invalidMessages } from '../../data/form-value';
import ProgressButton from '../buttons/ProgressButton';
import { TextInput } from '../controls/TextInput';
import { AccountRow } from "./AccountRow";

export function DisplayEmail(
  props: {
    email: string;
    isVerified: boolean;
  }
) {
  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const email = normalizeEmail(props.email);

  const handleSubmit = (
    values: EmailFormVal,
    helpers: FormikHelpers<EmailFormVal>
  ) => {
    setErrMsg('');
    helpers.setSubmitting(true);

    console.log(values);
  }

  return (
    <AccountRow
      title="邮箱"
    >
      {
        editing ?
        <EmailForm
          onSubmit={handleSubmit}
          errMsg={errMsg}
          email={email}
          onCancel={() => setEditing(false)}
        /> :
        <EmailDetails
          email={email}
          isVerified={props.isVerified}
          onUpdate={() => setEditing(true)}
        />
      }
    </AccountRow>
  );
}

function EmailDetails(
  props: {
    email: string;
    isVerified: boolean;
    onUpdate: () => void;
  }
) {

  if (!props.email) {
    return (
      <div>
        未设置
        <button className="btn btn-link" onClick={props.onUpdate}>设置</button>
      </div>
    );
  }

  return (
    <div>
      {props.email} {props.isVerified ? '' : '（未验证）'}
      <button className="btn btn-link" onClick={props.onUpdate}>更改</button>
    </div>
  );
}

function EmailForm(
  props: {
    onSubmit: (
      values: EmailFormVal,
      formikHelpers: FormikHelpers<EmailFormVal>
    ) => void | Promise<any>;
    errMsg: string;
    onCancel: () => void;
    email: string;
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
          email: props.email,
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
              name="email"
              type="email"
              placeholder="name@example.com"
            />

            <div className="d-flex justify-content-end">
              <button className="btn btn-link"
                onClick={props.onCancel}
              >
                取消
              </button>

              <ProgressButton
                disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
                text="保存"
                isSubmitting={formik.isSubmitting}
                inline={true}
              />
            </div>

          </Form>
        )}
      </Formik>
    </>
  );
}
