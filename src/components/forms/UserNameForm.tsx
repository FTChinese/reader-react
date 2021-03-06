import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import { invalidMessages } from '../../data/form-value';
import { UpdateNameFormVal } from '../../data/update-account';
import { TextInput } from '../controls/TextInput';
import * as Yup from 'yup';
import { FormikSubmitButton } from '../controls/FormikSubmitButton';
import { ErrorAlert } from '../progress/ErrorAlert';

export function UserNameForm(
  props: {
    onSubmit: (
      values: UpdateNameFormVal,
      formikHelpers: FormikHelpers<UpdateNameFormVal>
    ) => void | Promise<any>;
    errMsg: string;
    userName: string | null;
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
      <Formik<UpdateNameFormVal>
        initialValues={{
          userName: props.userName || '',
        }}
        validationSchema={Yup.object({
          userName: Yup.string()
            .required(invalidMessages.required),
        })}
        onSubmit={props.onSubmit}
      >
        <Form>
          <TextInput
            name="userName"
            type="text"
          />
          <FormikSubmitButton
            text="保存"
            wrapped="end"
          />
        </Form>
      </Formik>
    </>
  );
}
