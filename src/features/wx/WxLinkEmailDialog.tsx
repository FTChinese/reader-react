import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { OnReaderAccount, ReaderAccount, ReaderPassport } from '../../data/account';
import { Credentials, EmailVal, invalidMessages } from '../../data/form-value';
import { emailExists, emailLogin } from '../../repository/email-auth';
import { isCodeAlreadyExists, ResponseError } from '../../repository/response-error';
import { BackButton } from '../../components/buttons/BackButton';
import { EmailForm } from '../../components/forms/EmailForm';
import { EmailLoginForm } from '../../components/forms/EmailLoginForm';
import { LinkAccounts } from './LinkAccounts';
import { SignUpForm } from '../../components/forms/SignUpForm';
import { SignupFormVal } from '../../data/authentication';
import { wxLinkNewEmail } from '../../repository/wx-auth';
import { emailVerificationUrl } from '../../data/sitemap';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';

/**
 * @description Show a dialog to let a user logged
 * in with wechat link to email.
 * Link to existing email requires 3 steps:
 * 1. Check email
 * 2. Verify Password and get email account data.
 * 3. Link. You need to compare the two account to ensure that they could be linked; otherwise show the reason why it is denied.
 *
 * Link to new account requires 2 steps:
 * 1. Check email
 * 2. Ask user to create account.
 *
 * Both operations returnes a fresh copy of account data.
 * Use it to replace the cachec version.
 */
export function WxLinkEmailDialog(
  props: {
    passport: ReaderPassport;
    show: boolean;
    onClose: () => void;
    onLinked: OnReaderAccount;
  }
) {
  const [errMsg, setErrMsg] = useState('');
  // Switch ui to sign in or up.
  const [emailChecked, setEmailChecked] = useState('');
  // Determine if it is sign-in or sign-up.
  const [emailFound, setEmailFound] = useState(false);

  const checkEmail = (
    values: EmailVal,
    helper: FormikHelpers<EmailVal>,
  ) => {
    helper.setSubmitting(true);

    emailExists(values.email)
      .then(ok => {
        helper.setSubmitting(false);
        setEmailChecked(values.email);
        setEmailFound(ok);
      })
      .catch((err: ResponseError) => {
        helper.setSubmitting(false);
        if (err.invalid) {
          helper.setErrors(err.toFormFields)
          return;
        }
        setErrMsg(err.message);
      });
  };

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>绑定邮箱</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FullscreenSingleCol>
          {
            emailChecked ?
            <SignInOrUp
              passport={props.passport}
              email={emailChecked}
              found={emailFound}
              onCancel={() => setEmailChecked('')}
              onLinked={props.onLinked}
            /> :
            <EmailForm
              onSubmit={checkEmail}
              errMsg={errMsg}
              email=''
              desc="检测邮箱是否已注册"
              btnText="下一步"
            />
          }
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}

function SignInOrUp(
  props: {
    passport: ReaderPassport;
    email: string;
    found: boolean;
    onCancel: () => void;
    onLinked: OnReaderAccount;
  }
) {

  // If email is found, ask user to verify password.
  if (props.found) {
    return (
      <>
        <BackButton onBack={props.onCancel}/>
        <EmailLogIn
          passport={props.passport}
          email={props.email}
          onLinked={props.onLinked}
        />
      </>
    );
  }

  // Otherwise ask user to create a new account.
  return (
    <>
      <BackButton onBack={props.onCancel}/>
      <EmailSignUp
        token={props.passport.token}
        email={props.email}
        onLinked={props.onLinked}
      />
    </>
  );
}

function EmailLogIn(
  props: {
    passport: ReaderPassport; // Current logged-in account.
    email: string; // Email to link.
    onLinked: OnReaderAccount;
  }
) {

  const [ errMsg, setErrMsg ] = useState('');
  const [ ftcAccount, setFtcAccount ] = useState<ReaderAccount>();

  const handleLogIn = (
    values: Credentials,
    helpers: FormikHelpers<Credentials>
  ) => {
    setErrMsg('');
    setFtcAccount(undefined);
    helpers.setSubmitting(true);

    emailLogin(values)
      .then(passport => {

        helpers.setSubmitting(false);
        setFtcAccount(passport);
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
    <>
      <h5 className="text-center">邮箱已注册，验证密码后绑定</h5>
      <EmailLoginForm
        onSubmit={handleLogIn}
        errMsg={errMsg}
        btnText="验证密码"
        email={props.email}
      />
      {
        ftcAccount &&
        <LinkAccounts
          token={props.passport.token}
          wxAccount={props.passport}
          ftcAccount={ftcAccount}
          onLinked={props.onLinked}
        />
      }
    </>
  );
}

function EmailSignUp(
  props: {
    token: string; // Current wechat passport token
    email: string; // Email to link.
    onLinked: OnReaderAccount;
  }
) {

  const [ errMsg, setErrMsg ] = useState('');

  const handleSignUp = (values: SignupFormVal, helper: FormikHelpers<SignupFormVal>) => {
    setErrMsg('');
    helper.setSubmitting(false);

    wxLinkNewEmail(
        {
          email: values.email,
          password: values.password,
          sourceUrl: emailVerificationUrl(window.location.origin)
        },
        props.token,
      )
      .then(passport => {
        helper.setSubmitting(false);
        props.onLinked(passport);
      })
      .catch((err: ResponseError) => {
        helper.setSubmitting(false);
        if (err.invalid) {
          if (isCodeAlreadyExists(err.invalid, 'email')) {
            helper.setErrors({
              email: invalidMessages.emailAlreadyExists,
            })
          } else {
            helper.setErrors(err.toFormFields);
          }
          return;
        }

        setErrMsg(err.message);
      });
  };

  return (
    <>
      <h5 className="text-center">注册FT中文网账号</h5>
      <p>该邮箱上位注册FT中文网账号，设置密码后为您创建账号并关联微信</p>
      <SignUpForm
        onSubmit={handleSignUp}
        errMsg={errMsg}
        email={props.email}
      />
    </>
  );
}

