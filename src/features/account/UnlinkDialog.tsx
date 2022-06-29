import { ChangeEvent, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { ReaderPassport, ReaderAccount } from '../../data/account';
import { PaymentKind, WxUnlinkAnchor } from '../../data/enum';
import { isMembershipZero, Membership } from '../../data/membership';
import { ResponseError } from '../../repository/response-error';
import { wxUnlinkEmail } from '../../repository/wx-auth';
import { StringPair, pairEmail, pairWxName } from '../../data/pair';
import { UnlinkableSubs } from '../member/UnlinkableSubs';
import { TwoColList } from '../../components/list/TwoColList';
import { useAuth } from '../../components/hooks/useAuth';
import { toast } from 'react-toastify';
import { CircleLoader } from '../../components/progress/LoadIndicator';
import { LeadIconButton } from '../../components/buttons/Buttons';

export function UnlinkDialog(
  props: {
    passport: ReaderPassport;
    show: boolean;
    onClose: () => void;
  }
) {

  const { refreshLogin } = useAuth();
  const [errMsg, setErrMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [anchor, setAnchor] = useState<WxUnlinkAnchor | null>(null);
  const [valid, setValid] = useState(false);

  const notMember = isMembershipZero(props.passport.membership);

  useEffect(() => {
    setValid(notMember);
  }, [props.passport.membership.tier]);

  const handleSelected = (anchor: WxUnlinkAnchor) => {
    setAnchor(anchor);
    setValid(true);
  };

  const handleSubmit =() => {
    setErrMsg('');
    setSubmitting(true);

    wxUnlinkEmail(
        {
          ftcId: props.passport.id,
          anchor: anchor,
        },
        props.passport.token
      )
      .then(passport => {
        setSubmitting(false);
        refreshLogin(passport);
        toast.info('已解除微信绑定');
        props.onClose();

      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        setErrMsg(err.message);
      });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>解除邮箱/微信关联</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <Card className="mb-3">
            <Card.Header>已关联账号</Card.Header>
            <TwoColList
              rows={UnlinkableAccountRows(props.passport)}
            />
          </Card>
          { !notMember &&
            <UnlinkAnchor
              member={props.passport.membership}
              onSelected={handleSelected}
            />
          }
          {
            errMsg &&
            <Alert
              dismissible
              variant="danger"
              onClose={() => setErrMsg('')}
            >
              {errMsg}
            </Alert>
          }
        </>
      </Modal.Body>
      <Modal.Footer>
        <LeadIconButton
          disabled={submitting || !valid}
          text="解除绑定"
          onClick={handleSubmit}
          icon={<CircleLoader progress={submitting} />}
        />
      </Modal.Footer>
    </Modal>
  );
}

/**
 * @description Show which side the membership should be kept after severing email-wechat link.
 * This is shown only if account has membership, regardless of valid or not.
 * For wxpay/alipay, we allow user to choose which side to keep it;
 * for Stripe/Apple, only ftc side is allowed and the checkbox should be pre-selected.
 */
function UnlinkAnchor(
  props: {
    member: Membership,
    onSelected: (anchor: WxUnlinkAnchor) => void,
  }
) {
  const ftcSideOnly = isFtcSideOnly(props.member.payMethod);

  // If membership is only allowed to be kept on ftc side,
  // we selet it directly without giving user any choice.
  useEffect(() => {
    if (ftcSideOnly) {
      props.onSelected('ftc');
    }
  }, [props.member.payMethod]);

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const anchor = castAnchor(e.target.value);
    if (anchor) {
      props.onSelected(anchor);
    }
  }

  return (
    <div>
      <UnlinkableSubs
        {...props.member}
      />

      <p>检测到您是FT的会员，解除账号绑定需要选择会员信息保留在哪个账号下</p>

      <div className="mb-3">
        <div className="form-check">
          <input className="form-check-input"
            type="radio"
            name="anchor"
            id="anchor-ftc"
            value="ftc"
            checked={ftcSideOnly}
            onChange={handleCheck}
          />
          <label className="form-check-label" htmlFor="anchor-ftc">邮箱账号</label>
        </div>

        <div className="form-check">
          <input className="form-check-input"
            type="radio"
            name="anchor"
            id="anchor-wechat"
            value="wechat"
            disabled={ftcSideOnly}
            onChange={handleCheck}
          />
          <label className="form-check-label" htmlFor="anchor-wechat">微信账号</label>
        </div>
        <small className="form-text text-muted">
        通过苹果内购、Stripe或企业购买的会员只能保留在邮箱账号下。
        </small>
      </div>


    </div>
  );
}

function UnlinkableAccountRows(a: ReaderAccount): StringPair[] {
  return [
    pairEmail(a.email),
    pairWxName(a.wechat.nickname),
  ];
}

function isFtcSideOnly(m?: PaymentKind): boolean {
  if (!m) {
    return false;
  }

  const emailOnlyPayMethods: PaymentKind[] = ['apple', 'stripe', 'b2b'];

  return emailOnlyPayMethods.includes(m);
}

function castAnchor(v: string): WxUnlinkAnchor | undefined {
  const anchors: WxUnlinkAnchor[] = ['ftc', 'wechat'];

  if (anchors.includes(v as WxUnlinkAnchor)) {
    return v as WxUnlinkAnchor;
  }

  return undefined;
}
