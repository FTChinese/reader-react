import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Wechat } from '../../data/account';
import { EmailVal } from '../../data/form-value';
import { CenterLayout } from '../Layout';
import { emailExists } from '../../repository/email-auth';
import { ResponseError } from '../../repository/response-error';
import { BackButton } from '../buttons/BackButton';
import { EmailForm } from '../forms/EmailForm';

export function WechatOnly(
  props: {
    token: string;
    wechat: Wechat;
  }
) {

  const [showDialog, setShowDialog] = useState(false);

  const handleDialog = () => {
    setShowDialog(!showDialog);
  }

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-lg-6">

        <div className="d-flex justify-content-center">
          <figure className="figure">
            <img
              className="figure-img img-fluid rounded"
              src={props.wechat.avatarUrl}
              alt="微信头像" />
            <figcaption className="figure-caption text-center">
              {props.wechat.nickname}
            </figcaption>
          </figure>
        </div>

        <div className="text-center">
          <p>您目前使用了微信账号登录FT中文网。为保障账号安全，建议绑定在FT中文网注册的邮箱账号。</p>

          <button
            className="btn btn-primary"
            onClick={handleDialog}
          >
            绑定邮箱
          </button>

          <LinkEmailDialog
            token={props.token}
            show={showDialog}
            onClose={handleDialog}
          />
        </div>

      </div>
    </div>
  );
}

function LinkEmailDialog(
  props: {
    token: string;
    show: boolean;
    onClose: () => void;
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
        <CenterLayout>
          {
            emailChecked ?
            <SignInOrUp
              email={emailChecked}
              found={emailFound}
              onCancel={() => setEmailChecked('')}
            /> :
            <EmailForm
              onSubmit={checkEmail}
              errMsg={errMsg}
              email=''
              desc="检测邮箱是否已注册"
              btnText="下一步"
            />
          }
        </CenterLayout>
      </Modal.Body>
    </Modal>
  );
}

function SignInOrUp(
  props: {
    email: string;
    found: boolean;
    onCancel: () => void;
  }
) {
  return (
    <>
      <BackButton onBack={props.onCancel}/>

      { props.found ?
        <div>Email found. Verify password</div> :
        <div>Email not found. Create new account</div>
      }
    </>
  );
}
