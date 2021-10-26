import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { invalidMessages, regex, SignupFormVal } from '../../data/form-value';
import { TextInput } from '../controls/TextInput';
import ProgressButton from '../buttons/ProgressButton';
import Alert from 'react-bootstrap/Alert';

export function SignUpForm(
  props: {
    onSubmit: (values: SignupFormVal, formikHelpers: FormikHelpers<SignupFormVal>) => void | Promise<any>;
    errMsg: string;
    email?: string;
  }
) {

  return (
    <>
      {
        props.errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => props.errMsg = ''}>
          {props.errMsg}
        </Alert>
      }

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
        {formik => (
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
            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="注册"
              isSubmitting={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
