import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { EmailVal, invalidMessages } from '../../data/form-value';
import ProgressButton from '../buttons/ProgressButton';
import { TextInput } from '../controls/TextInput';
import * as Yup from 'yup';

export function EmailForm(
  props: {
    onSubmit: (
      values: EmailVal,
      formikHelpers: FormikHelpers<EmailVal>
    ) => void | Promise<any>;
    errMsg: string;
    desc: string;
    btnText: string;
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
      <Formik<EmailVal>
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
              placeholder="yourname@example.org"
              desc="检测邮箱是否已注册"
            />

            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="下一步"
              isSubmitting={formik.isSubmitting}/>
          </Form>
        )}
      </Formik>
    </>
  );
}
