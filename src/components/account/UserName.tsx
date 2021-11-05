import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import * as Yup from 'yup';
import { invalidMessages, UpdateNameFormVal } from '../../data/form-value';
import ProgressButton from '../buttons/ProgressButton';
import { TextInput } from '../controls/TextInput';
import { AccountRow } from "./AccountRow";

export function DisplayName(
  props: {
    userName: string | null;
  }
) {
  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = (
    values: UpdateNameFormVal,
    helpers: FormikHelpers<UpdateNameFormVal>
  ) => {
    setErrMsg('');
    helpers.setSubmitting(true);

    console.log(values);
  }

  return (
    <AccountRow
      title="用户名"
      isEditing={editing}
      onEdit={() => setEditing(!editing)}
    >
      {
        editing ?
        <UserNameForm
          onSubmit={handleSubmit}
          onCancel={() => setEditing(false)}
          errMsg={errMsg}
          userName={props.userName}
        /> :
        <div>
          {props.userName || '未设置'}
        </div>
      }
    </AccountRow>
  );
}

function UserNameForm(
  props: {
    onSubmit: (
      values: UpdateNameFormVal,
      formikHelpers: FormikHelpers<UpdateNameFormVal>
    ) => void | Promise<any>;
    onCancel: () => void;
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
      {
        errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrMsg('')}>
          {errMsg}
        </Alert>
      }
      <Formik<UpdateNameFormVal>
        initialValues={{
          userName: props.userName || '',
        }}
        validationSchema={Yup.object({
          displayName: Yup.string()
            .required(invalidMessages.required),
        })}
        onSubmit={props.onSubmit}
      >
        { formik => (
          <Form>
            <TextInput
              name="userName"
              type="text"
            />

            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text="保存"
              isSubmitting={formik.isSubmitting}
              inline={true}
            />

          </Form>
        )}
      </Formik>
    </>
  );
}
