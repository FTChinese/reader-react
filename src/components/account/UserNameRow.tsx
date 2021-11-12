import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { toastMessages, } from '../../data/form-value';
import { UpdateNameFormVal } from '../../data/update-account';
import { updateUserName } from '../../repository/email-account';
import { ResponseError } from '../../repository/response-error';
import { UserNameForm } from '../forms/UserNameForm';
import { AccountRow } from "./AccountRow";
import { OnAccountUpdated } from './OnAccountUpdated';

export function UserNameRow(
  props: {
    token: string;
    userName: string | null;
    onUpdated: OnAccountUpdated;
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

    updateUserName(values, props.token)
      .then(ba => {
        helpers.setSubmitting(false);
        toast.success(toastMessages.updateSuccess);
        props.onUpdated(ba);
        setEditing(false);
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
      title="用户名"
      isEditing={editing}
      onEdit={() => setEditing(!editing)}
    >
      {
        editing ?
        <UserNameForm
          onSubmit={handleSubmit}
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

