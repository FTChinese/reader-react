import { Formik, Form, FormikHelpers } from "formik";
import { Credentials, invalidMessages } from "../../data/form-value";
import { TextInput } from "../controls/TextInput";
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { FormikSubmitButton } from '../controls/FormikSubmitButton';
import { ErrorAlert } from '../progress/ErrorAlert';

/**
 * @description A form to collect email login data, used for:
 * - Login with email
 * - New mobile user links to an existing email account
 * - Wechat user links to existing email.
 */
export function EmailLoginForm(
  props: {
    onSubmit: (
      values: Credentials,
      formikHelpers: FormikHelpers<Credentials>
    ) => void | Promise<any>;
    errMsg: string;
    btnText: string;
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
      <ErrorAlert
        msg={errMsg}
        onClose={() => setErrMsg('')}
      />
      <Formik<Credentials>
        initialValues={{
          email: props.email,
          password: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email(invalidMessages.invalidEmail)
            .required(invalidMessages.required),
          password: Yup.string()
            .min(8, '密码无效')
            .required(invalidMessages.required)
        })}
        onSubmit={props.onSubmit}
      >
        <Form>
          <TextInput
            label="邮箱"
            name="email"
            type="email"
            placeholder="name@example.com"
            disabled={!!props.email}
          />
          <TextInput
            label="密码"
            name="password"
            type="password"
          />
          <FormikSubmitButton
            text={props.btnText}
            wrapped="block"
          />
        </Form>
      </Formik>
    </>
  );
}
