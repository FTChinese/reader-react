import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { normalizeEmail, OnAccountUpdated } from '../../data/account';
import { EmailVal, toastMessages } from '../../data/form-value';
import { emailVerificationUrl } from '../../data/sitemap';
import { updateEmail } from '../../repository/email-account';
import { ResponseError } from '../../repository/response-error';
import { EmailForm } from '../../components/forms/EmailForm';
import { AccountRow, useEditState } from "./AccountRow";
import { SecondaryLine } from '../../components/list/TwoLineRow';

export function EmailRow(
  props: {
    token: string;
    email: string;
    isVerified: boolean;
    onUpdated: OnAccountUpdated;
  }
) {

  const [errMsg, setErrMsg] = useState('');
  const {
    onOff,
    toggle,
  } = useEditState();

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

    updateEmail(
        {
          email: values.email,
          sourceUrl: emailVerificationUrl(window.location.origin)
        },
        props.token,
      )
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
      title="邮箱"
      isEditing={onOff}
      onEdit={toggle}
      editContent={
        <EmailForm
          onSubmit={handleSubmit}
          errMsg={errMsg}
          email={email}
          btnText="保存"
          btnInline={true}
          hideLabel={true}
        />
      }
      nonEditContent={
        <SecondaryLine
          text={emailText}
        />
      }
    />
  );
}

