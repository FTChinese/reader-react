import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { toastMessages, } from '../../data/form-value';
import { UpdateNameFormVal } from '../../data/update-account';
import { updateUserName } from '../../repository/email-account';
import { ResponseError } from '../../repository/response-error';
import { UserNameForm } from '../../components/forms/UserNameForm';
import { AccountRow, useEditState } from "./AccountRow";
import { SecondaryLine } from '../../components/layout/TwoLineRow';
import { OnAccountUpdated } from '../../data/account';

export function UserNameRow(
  props: {
    token: string;
    userName: string | null;
    onUpdated: OnAccountUpdated;
  }
) {

  const [errMsg, setErrMsg] = useState('');
  const { onOff, toggle } = useEditState();

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
        toggle();
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
      isEditing={onOff}
      onEdit={toggle}
      editContent={
        <UserNameForm
          onSubmit={handleSubmit}
          errMsg={errMsg}
          userName={props.userName}
        />
      }
      nonEditContent={
        <SecondaryLine
          text={props.userName || '未设置'}
        />
      }
    />
  );
}

