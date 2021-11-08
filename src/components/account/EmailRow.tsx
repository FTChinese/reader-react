import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { normalizeEmail } from '../../data/account';
import { EmailVal } from '../../data/form-value';
import { EmailForm } from '../forms/EmailForm';
import { AccountRow } from "./AccountRow";

export function DisplayEmail(
  props: {
    email: string;
    isVerified: boolean;
  }
) {
  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const email = normalizeEmail(props.email);

  const emailText = email
    ? `${email}${props.isVerified ? '' : ' （未验证）'}`
    : '未设置';

  const handleSubmit = (
    values: EmailVal,
    helpers: FormikHelpers<EmailVal>
  ) => {
    setErrMsg('');
    helpers.setSubmitting(true);

    console.log(values);
  }

  return (
    <AccountRow
      title="邮箱"
      isEditing={editing}
      onEdit={() => setEditing(!editing)}
    >
      {
        editing ?
        <EmailForm
          onSubmit={handleSubmit}
          errMsg={errMsg}
          email={email}
          btnText="保存"
          btnInline={true}
          hideLabel={true}
        /> :
        <div>{emailText}</div>
      }
    </AccountRow>
  );
}

