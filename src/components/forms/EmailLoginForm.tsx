import { Formik, Form, FormikHelpers } from "formik";
import Alert from "react-bootstrap/Alert";
import { Credentials, invalidMessages } from "../../data/form-value";
import ProgressButton from "../buttons/ProgressButton";
import { TextInput } from "../controls/TextInput";
import * as Yup from 'yup';

export function EmailLoginForm(
  props: {
    onSubmit: (
      values: Credentials,
      formikHelpers: FormikHelpers<Credentials>
    ) => void | Promise<any>;
    errMsg: string;
  }
) {

  return (
    <>
      {
        props.errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => props.errMsg = ''}
        >
          {props.errMsg}
        </Alert>
      }
      <Formik<Credentials>
        initialValues={{
          email: '',
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
        {formik => (
          <Form>
            <TextInput
              label="邮箱"
              name="email"
              type="email"
              placeholder="name@example.com"
            />
            <TextInput
              label="密码"
              name="password"
              type="password"
            />
            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="登录"
              isSubmitting={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
