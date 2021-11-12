import { FormikHelpers, Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { toastMessages, verifyPasswordSchema } from '../../data/form-value';
import { UpdatePasswordFormVal } from '../../data/update-account';
import { updatePassword } from '../../repository/email-account';
import { ResponseError } from '../../repository/response-error';
import ProgressButton from '../buttons/ProgressButton';
import { TextInput } from '../controls/TextInput';
import { UpdatePasswordForm } from '../forms/UpdatePasswordForm';
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
    setErrMsg('');
    helpers.setSubmitting(true);

    updatePassword(
        {
          currentPassword: values.currentPassword,
          newPassword: values.password,
        },
        props.token
      )
      .then(ok => {
        helpers.setSubmitting(!ok);
        if (ok) {
          toast.success(toastMessages.updateSuccess);
          setEditing(false);
        } else {
          toast.error(toastMessages.unknownErr);
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
        /> :
        <div>*******</div>
      }
    </AccountRow>
  )
}


