import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { VerifySMSFormVal } from '../../data/mobile';
import { MobileLoginForm, SMSHelper } from '../forms/MobileLoginForm';
import { AccountRow } from "./AccountRow";

export function DisplayMobile(
  props: {
    mobile: string | null;
  }
) {

  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleSMSRequest = (mobile: string, helper: SMSHelper) => {
    console.log(mobile);
    helper.setProgress(true);

    console.log(mobile);
  };

  const handleSubmit = (
    values: VerifySMSFormVal,
    helper: FormikHelpers<VerifySMSFormVal>
  ): void | Promise<any> => {
    setErrMsg('');
    helper.setSubmitting(true);

    console.log(values)
  }

  return (
    <AccountRow
      title="手机号"
      isEditing={editing}
      onEdit={() => setEditing(!editing)}
    >
      { editing ?
        <MobileLoginForm
          onSubmit={handleSubmit}
          onRequestSMS={handleSMSRequest}
          errMsg={errMsg}
          isLogin={false}
        /> :

        <div>{props.mobile || '未设置'}</div>
      }
    </AccountRow>
  );
}
