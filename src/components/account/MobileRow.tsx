import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { toastMessages } from '../../data/form-value';
import { VerifySMSFormVal } from '../../data/mobile';
import { changeMobile, requestVerifyMobile } from '../../repository/email-account';
import { ResponseError } from '../../repository/response-error';
import { MobileLoginForm, SMSHelper } from '../forms/MobileLoginForm';
import { AccountRow } from "./AccountRow";
import { OnAccountUpdated } from './OnAccountUpdated';

export function DisplayMobile(
  props: {
    token: string;
    mobile: string | null;
    onUpdated: OnAccountUpdated;
  }
) {

  const [editing, setEditing] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleSMSRequest = (mobile: string, helper: SMSHelper) => {
    console.log(mobile);
    helper.setProgress(true);

    requestVerifyMobile(
        { mobile },
        props.token,
      )
      .then(ok => {
        if (ok) {
          helper.setShowCounter(true);
          toast.info(toastMessages.smsSent);
        } else {
          setErrMsg(toastMessages.smsFailed);
        }
      })
      .catch((err: ResponseError) => {
        helper.setProgress(false);
        setErrMsg(err.message);
      });
  };

  const handleSubmit = (
    values: VerifySMSFormVal,
    helper: FormikHelpers<VerifySMSFormVal>
  ): void | Promise<any> => {
    setErrMsg('');
    helper.setSubmitting(true);

    changeMobile(values, props.token)
      .then(ba => {
        helper.setSubmitting(false);
        toast.success(toastMessages.updateSuccess);
        props.onUpdated(ba)
      })
      .catch((err: ResponseError) => {
        helper.setSubmitting(false);
        if (err.invalid) {
          helper.setErrors(err.toFormFields);
          return
        }

        setErrMsg(err.message);
      });
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
