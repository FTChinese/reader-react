import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { toastMessages } from '../../data/form-value';
import { UpdatePasswordFormVal } from '../../data/update-account';
import { updatePassword } from '../../repository/email-account';
import { ResponseError } from '../../repository/response-error';
import { UpdatePasswordForm } from '../../components/forms/UpdatePasswordForm';
import { AccountRow, useEditState } from './AccountRow';
import { SecondaryLine } from '../../components/layout/TwoLineRow';

export function PasswordRow(
  props: {
    token: string;
  }
) {

  const [errMsg, setErrMsg] = useState('');
  const {
    onOff,
    toggle,
  } = useEditState();

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
          toggle();
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
      isEditing={onOff}
      onEdit={toggle}
      editContent={
        <UpdatePasswordForm
          onSubmit={handleSubmit}
          errMsg={errMsg}
        />
      }
      nonEditContent={
        <SecondaryLine
          text="*******"
        />
      }
    />
  )
}


