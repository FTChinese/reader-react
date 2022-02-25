import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { EmailVal, invalidMessages } from '../../data/form-value';
import { TextInput } from '../controls/TextInput';
import * as Yup from 'yup';
import { SubmitButton } from '../controls/SubmitButton';

/**
 * @description An email input form used in multiple places:
 * - Request password resetting letter
 * - Updating email
 * - Wechat links to email
 */
export function EmailForm(
  props: {
    onSubmit: (
      values: EmailVal,
      formikHelpers: FormikHelpers<EmailVal>
    ) => void | Promise<any>;
    errMsg: string;
    email: string;
    btnText: string;
    btnInline?: boolean;
    desc?: string;
    hideLabel?: boolean;
  }
) {

  const [errMsg, setErrMsg] = useState('');

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
          email: props.email,
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email(invalidMessages.invalidEmail)
            .required(invalidMessages.required)
        })}
        onSubmit={props.onSubmit}
      >
        <Form>
          <TextInput
            label={props.hideLabel ? undefined : '邮箱'}
            name="email"
            type="email"
            placeholder="yourname@example.org"
            desc={props.desc}
          />
          <SubmitButton
            text={props.btnText}
            variant={props.btnInline ? 'link' : 'primary'}
            wrapped={props.btnInline ? 'end' : 'block'}
          />
        </Form>
      </Formik>
    </>
  );
}
