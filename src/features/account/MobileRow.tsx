import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { toastMessages } from '../../data/form-value';
import { VerifySMSFormVal } from '../../data/mobile';
import { changeMobile, requestVerifyMobile } from '../../repository/email-account';
import { ResponseError } from '../../repository/response-error';
import { MobileLoginForm, SMSHelper } from '../../components/forms/MobileLoginForm';
import { AccountRow, useEditState } from "./AccountRow";
import { SecondaryLine } from '../../components/layout/TwoLineRow';
import { OnAccountUpdated } from '../../data/account';

export function MobileRow(
  props: {
    token: string;
    mobile: string | null;
    onUpdated: OnAccountUpdated;
  }
) {

  const [errMsg, setErrMsg] = useState('');
  const {
    onOff,
    toggle,
  } = useEditState();

  const handleSMSRequest = (mobile: string, helper: SMSHelper) => {
    setErrMsg('');
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
        props.onUpdated(ba);
        toggle;
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
      isEditing={onOff}
      onEdit={toggle}
      editContent={
        <MobileLoginForm
          onSubmit={handleSubmit}
          onRequestSMS={handleSMSRequest}
          errMsg={errMsg}
          isLogin={false}
          mobile={props.mobile}
        />
      }
      nonEditContent={
        <SecondaryLine
          text={props.mobile || '未设置'}
        />
      }
    />
  );
}
