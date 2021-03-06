import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { invalidMessages, regex } from '../../data/form-value';
import { TextInput } from '../controls/TextInput';
import { useEffect, useState } from 'react';
import { SignupFormVal } from '../../data/authentication';
import { FormikSubmitButton } from '../controls/FormikSubmitButton';
import { ErrorAlert } from '../progress/ErrorAlert';

export function SignUpForm(
  props: {
    onSubmit: (values: SignupFormVal, formikHelpers: FormikHelpers<SignupFormVal>) => void | Promise<any>;
    errMsg: string;
    email?: string;
  }
) {

  const [ errMsg, setErrMsg ] = useState('');

  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);

  return (
    <>
      <ErrorAlert
        msg={errMsg}
        onClose={() => setErrMsg('')}
      />
      <Formik<SignupFormVal>
        initialValues={{
          email: props.email || '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email(invalidMessages.invalidEmail)
            .required(invalidMessages.required),

          password: Yup.string()
            .matches(regex.password, invalidMessages.invalidPassword)
            .required(invalidMessages.required),

          confirmPassword: Yup.string()
            .test('password-match', invalidMessages.passwordMismatch, function(value, ctx) {
              return ctx.parent.password === value;
            })
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
          <TextInput
            label="确认密码"
            name="confirmPassword"
            type="password"
          />
          <FormikSubmitButton
            text="注册"
            wrapped="block"
          />
        </Form>
      </Formik>
    </>
  );
}
