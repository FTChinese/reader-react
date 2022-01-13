import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '../store/AuthContext';
import { AuthLayout } from '../components/layout/Layout'
import { sitemap } from '../data/sitemap';
import { emailLogin } from '../repository/email-auth';
import { isCodeMissing, ResponseError } from '../repository/response-error';
import { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { FormikHelpers } from 'formik';
import { Credentials } from '../data/form-value';
import { EmailLoginForm } from '../components/forms/EmailLoginForm';
import { MobileLoginForm, SMSHelper } from '../components/forms/MobileLoginForm';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressButton from '../components/buttons/ProgressButton';
import Alert from 'react-bootstrap/Alert';
import { ChevronDown, ChevronUp } from '../components/icons';
import { InitWxOAuth } from '../features/wx/InitWxOAuth';
import { requestMobileLoginSMS, verifyMobileLoginSMS, mobileSignUp, mobileLinkExistingEmail } from '../repository/mobile-auth';
import { VerifySMSFormVal } from '../data/mobile';

function LinkPwResetOrSignUp() {
  return (
    <div className="d-flex justify-content-between mt-3">
      <Link to={sitemap.forgotPassword}>忘记密码?</Link>
      <Link to={sitemap.signUp}>新建账号</Link>
    </div>
  );
}

function EmailLogin() {
  const { setLoggedIn } = useAuthContext();
  const [ errMsg, setErrMsg ] = useState('');

  const handleSubmit = (
    values: Credentials,
    helper: FormikHelpers<Credentials>
  ): void | Promise<any> => {
    setErrMsg('');
    helper.setSubmitting(true);

    emailLogin(values)
      .then(passport => {
        helper.setSubmitting(false);
        setLoggedIn(passport);
      })
      .catch((err: ResponseError) => {
        helper.setSubmitting(false);
        if (err.invalid) {
          helper.setErrors(err.toFormFields);
          return;
        }
        setErrMsg(err.message);
      });
  }

  return (
    <>
      <EmailLoginForm
        onSubmit={handleSubmit}
        errMsg={errMsg}
        btnText="登录"
        email=''
      />

      <LinkPwResetOrSignUp/>
    </>
  );
}

function AlertMobileNotFound(
  props: {
    mobile: string;
    onClose: () => void;
  }
) {
  const { setLoggedIn } = useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const [ linkEmail, setLinkEmail ] = useState(false);

  const handleSignUp = () => {
    setSubmitting(true);
    mobileSignUp({ mobile: props.mobile })
      .then(passport => {
        setSubmitting(false);
        setLoggedIn(passport);
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
      });
  }

  return (
    <Modal
      show={!!props.mobile}
      onHide={props.onClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>手机首次登录</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>这是您首次使用手机号码 {props.mobile} 登录。如果您已经拥有邮箱注册的账号并且购买了FT订阅服务，建议您选择"关联邮箱账号"。</p>
        <p>请注意，选择"手机号新建账号"后，该手机号将无法关联您已有的邮箱账号。</p>

        <div className="d-flex justify-content-between">
          <ProgressButton
            text="手机号新建账号"
            disabled={submitting}
            isSubmitting={submitting}
            inline={true}
            asButton={true}
            onClick={handleSignUp}
          />
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={() => setLinkEmail(!linkEmail)}
          >
            <span className="pe-2">关联邮箱账号</span>
            {linkEmail ?
              <ChevronUp /> :
              <ChevronDown />
            }
          </Button>
        </div>

        {linkEmail &&
          <MobileLinkEmail
            mobile={props.mobile}
            onSubmitting={setSubmitting}
          />
        }
      </Modal.Body>
    </Modal>
  );
}

/**
 * @description Show the form to let a new mobile linking to existing email account.
 */
function MobileLinkEmail(
  props: {
    mobile: string;
    onSubmitting: (yes: boolean) => void
  }
) {
  const { setLoggedIn } = useAuthContext();
  const [ errMsg, setErrMsg ] = useState('');

  const handleSubmit = (
    values: Credentials,
    helper: FormikHelpers<Credentials>
  ): void | Promise<any> => {
    setErrMsg('');
    helper.setSubmitting(true);
    props.onSubmitting(true);

    mobileLinkExistingEmail({
      ...values,
      mobile: props.mobile
    })
      .then(passport => {
        helper.setSubmitting(false);
        props.onSubmitting(false);
        setLoggedIn(passport);
      })
      .catch((err: ResponseError) => {
        helper.setSubmitting(false);
        props.onSubmitting(false);
        if (err.invalid) {
          if (err.invalid.field === 'mobile') {
            setErrMsg(err.message);
            return;
          }
          helper.setErrors(err.toFormFields);
          return;
        }
        setErrMsg(err.message);
      });
  }

  return (
    <div className="mt-4 pt-3 border-top">
      <h4 className="text-center">验证已有邮箱账号</h4>
      <p>验证后将绑定手机号{props.mobile}和邮箱，下次可以直接使用该手机号登录</p>
      <EmailLoginForm
        onSubmit={handleSubmit}
        errMsg={errMsg}
        btnText="验证并绑定"
        email=""
      />

      <LinkPwResetOrSignUp/>
    </div>
  );
}

function MobileLogin() {
  const { setLoggedIn } = useAuthContext();
  const [ errMsg, setErrMsg ] = useState('');
  const [ mobile, setMobile ] = useState('');

  const handleSMSRqeust = (mobile: string, helper: SMSHelper) => {
    console.log(mobile);
    helper.setProgress(true);
    requestMobileLoginSMS({
        mobile,
      })
      .then(ok => {
        // Stop progressing after SMS sent no matter what happened.
        helper.setProgress(false);

        if (ok) {
          helper.setShowCounter(true);
          toast.info('验证码已发送');
        } else {
          setErrMsg('发送失败，请重试');
        }
      })
      .catch((err: ResponseError) => {
        helper.setProgress(false);
        setErrMsg(err.message);
      });
  }

  const handleSubmit = (
    values: VerifySMSFormVal,
    helper: FormikHelpers<VerifySMSFormVal>
  ): void | Promise<any> => {
    setErrMsg('');
    helper.setSubmitting(true);

    verifyMobileLoginSMS(values)
      .then(passport => {
        helper.setSubmitting(false);
        setLoggedIn(passport);
      })
      .catch((err: ResponseError) => {
        helper.setSubmitting(false);
        if (err.notFound) {
          setErrMsg('验证码无效！');
          return;
        }

        if (err.invalid) {

          // Show dialog to ask user to signup or link email account.
          if (isCodeMissing(err.invalid, 'mobile')) {
            setMobile(values.mobile);
          } else {
            helper.setErrors(err.toFormFields);
          }
          return;
        }
        setErrMsg(err.message);
      });
  }

  return (
    <>
      <Alert
        variant="danger"
        show={!!errMsg}
        dismissible
        onClose={() => setErrMsg('')}
      >
        {errMsg}
      </Alert>
      <MobileLoginForm
        onSubmit={handleSubmit}
        onRequestSMS={handleSMSRqeust}
        errMsg={errMsg}
        isLogin={true}
      />
      {
        mobile &&
        <AlertMobileNotFound
          mobile={mobile}
          onClose={() => setMobile('')}
        />
      }
    </>
  );
}

export function LoginPage() {

  const { passport } = useAuthContext();

  if (passport) {
    return <Navigate
      to={sitemap.home}
      replace={true}
    />;
  }

  return (
    <AuthLayout
      title="登录FT中文网"
    >
      <>
        <Tabs defaultActiveKey="email" className="mb-3 mt-5 nav-fill">
          <Tab eventKey="email" title="邮箱">
            <EmailLogin/>
          </Tab>
          <Tab eventKey="mobile" title="手机号码">
            <MobileLogin/>
          </Tab>
        </Tabs>

        <InitWxOAuth/>
      </>
    </AuthLayout>
  );
}
