import { FormikHelpers } from 'formik';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { isAccountWxOnly, isLinkable, isMobileDerivedEmail, ReaderAccount, ReaderPassport } from '../../data/account';
import { Credentials, EmailVal } from '../../data/form-value';
import { CenterLayout } from '../Layout';
import { emailExists, emailLogin } from '../../repository/email-auth';
import { ResponseError } from '../../repository/response-error';
import { BackButton } from '../buttons/BackButton';
import { EmailForm } from '../forms/EmailForm';
import { EmailLoginForm } from '../forms/EmailLoginForm';
import { CardList } from '../list/CardList';
import { StringPair } from '../list/pair';
import { localizedTier } from '../../data/localization';
import ProgressButton from '../buttons/ProgressButton';
import Alert from 'react-bootstrap/Alert';
import { wxLinkExistingEmail } from '../../repository/wx-auth';
import { useAuthContext } from '../../store/AuthContext';
import { WxAvatar } from '../wx/WxAvatar';

/**
 * @description The callback function after accouns linked.
 */
type OnLinked = (passport: ReaderPassport) => void;

/**
 * @description WechatOnly show wechat name and avatar when the logged-in account
 * contains only wechat data.
 */
export function WechatOnly(
  props: ReaderPassport
) {

  const { setLoggedIn } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);

  const handleDialog = () => {
    setShowDialog(!showDialog);
  }

  const handleLinked: OnLinked = (passsport: ReaderPassport) => {
    setShowDialog(false);
    setLoggedIn(passsport);
  }

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-lg-6">

        <div className="d-flex justify-content-center">
          <WxAvatar wechat={props.wechat} />
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
            passport={props}
            show={showDialog}
            onClose={handleDialog}
            onLinked={handleLinked}
          />
        </div>

      </div>
    </div>
  );
}

/**
 * @description Show a dialog to let user link to email.
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
function LinkEmailDialog(
  props: {
    passport: ReaderPassport;
    show: boolean;
    onClose: () => void;
    onLinked: OnLinked;
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
        </CenterLayout>
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
    onLinked: OnLinked;
  }
) {

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

  return (
    <>
      <BackButton onBack={props.onCancel}/>
      <div>Email not found. Create new account</div>
    </>
  );
}

function EmailLogIn(
  props: {
    passport: ReaderPassport; // Current logged-in account.
    email: string; // Email to link.
    onLinked: OnLinked;
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
        const denied = isLinkable({
          ftc: passport,
          wx: props.passport,
        });

        if (denied) {
          setErrMsg(denied);
          return;
        }

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
        <LinkWechatEmail
          token={props.passport.token}
          wxAccount={props.passport}
          ftcAccount={ftcAccount}
          onLinked={props.onLinked}
        />
      }
    </>
  );
}

/**
 * @description Display the two accounts to be linked and a button
 * to let user to confirm the link.
 */
function LinkWechatEmail(
  props: {
    token: string;
    wxAccount: ReaderAccount,
    ftcAccount: ReaderAccount,
    onLinked: OnLinked;
  }
) {

  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = () => {
    setSubmitting(true);

    wxLinkExistingEmail({
        ftcId: props.ftcAccount.id,
        token: props.token,
      })
      .then(passport => {
        setSubmitting(false);
        props.onLinked(passport);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        setErrMsg(err.message);
      });
  };

  return (
    <div className="mt-5">
      <h4 className="text-center">关联如下账号</h4>
      <CardList
        rows={buildAccountRows(props.ftcAccount)}
        header="邮箱/手机账号"
        className="mt-3"
      />
      <CardList
        rows={buildAccountRows(props.wxAccount)}
        header="微信账号"
        className="mt-3 mb-3"
      />
      {
        errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrMsg('')}
        >
          {errMsg}
        </Alert>
      }
      <ProgressButton
        disabled={submitting}
        text="绑定账号"
        isSubmitting={submitting}
        asButton={true}
        onClick={handleSubmit}
      />
    </div>
  );
}

function buildAccountRows(a: ReaderAccount): StringPair[] {
  let firstRow: StringPair;

  if (isAccountWxOnly(a)) {
    firstRow = ['昵称', a.wechat.nickname || '-'];
  } else if (isMobileDerivedEmail(a.email)) {
    firstRow = ['手机', a.mobile || ''];
  } else {
    firstRow = ['邮箱', a.email];
  }

  return [
    firstRow,
    ['会员类型', a.membership.tier ? localizedTier(a.membership.tier) : '-'],
    ['会员期限', a.membership.expireDate || '-'],
  ];
}
