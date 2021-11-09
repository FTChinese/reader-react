import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { isAccountLinked, ReaderAccount, ReaderPassport, Wechat } from "../../data/account";
import { WxUnlinkAnchor } from '../../data/enum';
import { localizedTier } from '../../data/localization';
import { isMembershipZero, Membership } from '../../data/membership';
import ProgressButton from '../buttons/ProgressButton';
import { CardList } from '../list/CardList';
import { StringPair } from '../list/pair';
import { WxAvatar } from '../wx/WxAvatar';
import { AccountRow } from "./AccountRow";

export function DisplayWechat(
  props: {
    passport: ReaderPassport;
  }
) {

  const isLinked = isAccountLinked(props.passport);

  return (
    <AccountRow
      title="微信"
    >
      { isLinked ?
        <WechatLinked
          passport={props.passport}
        /> :
        <WechatMissing/>
      }
    </AccountRow>
  )
}

function WechatLinked(
  props: {
    passport: ReaderPassport;
  }
) {

  const [showUnlink, setShowUnlink] = useState(false);

  if (!props.passport.wechat.avatarUrl && !props.passport.wechat.nickname) {
    return <></>;
  }

  return (
    <div className="d-flex justify-content-between">
      <div className="flex-grow-1">
        <button className="btn btn-link"
          onClick={() => setShowUnlink(true)}
        >
          解除绑定
        </button>
      </div>
      <WxAvatar wechat={props.passport.wechat} />
      <UnlinkDialog
        passport={props.passport}
        show={showUnlink}
        onClose={() => setShowUnlink(false)}
      />
    </div>
  );
}

function WechatMissing() {
  return (
    <div className="d-flex">
      <div className="flex-grow-1">未设置</div>
      <button className="btn btn-link">绑定微信</button>
    </div>
  )
}

function UnlinkDialog(
  props: {
    passport: ReaderPassport;
    show: boolean;
    onClose: () => void;
  }
) {
  const [submitting, setSubmitting] = useState(false);
  const [anchor, setAnchor] = useState<WxUnlinkAnchor>();

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
          <CardList
            className="mb-3"
            rows={buildUnlinkList(props.passport)}
          />
          <UnlinkAnchor
            member={props.passport.membership}
            onSelected={setAnchor}
          />

        </>
      </Modal.Body>
      <Modal.Footer>
        <ProgressButton
          disabled={submitting}
          text="解除绑定"
          isSubmitting={submitting}
          asButton={true}
          inline={true}
        />
      </Modal.Footer>
    </Modal>
  );
}

function UnlinkAnchor(
  props: {
    member: Membership,
    onSelected: (anchor: WxUnlinkAnchor) => void,
  }
) {
  return (
    <div>
      <h5 className="text-center">检测到您是FT的会员，解除账号绑定需要选择会员信息保留在哪个账号下</h5>
      <p>通过苹果内购、Stripe或企业购买的会员只能保留在邮箱账号上</p>
      <div className="row">
        <div className="col">
          <div className="form-check">
            <input className="form-check-input"
              type="radio"
              name="anchor"
              id="anchor-ftc"
              value="ftc"
            />
            <label htmlFor="anchor-ftc">邮箱账号</label>
          </div>
        </div>
        <div className="col">
          <div className="form-check">
            <input className="form-check-input"
              type="radio"
              name="anchor"
              id="anchor-wechat"
              value="wechat"
            />
            <label htmlFor="anchor-wechat">微信账号</label>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildUnlinkList(a: ReaderAccount): StringPair[] {
  const rows: StringPair[] = [
    ['邮箱账号', a.email],
    ['微信账号', a.wechat.nickname || ''],
  ];

  if (isMembershipZero(a.membership)) {
    return rows
  }

  return rows.concat([
    ['会员类型', a.membership.tier ? localizedTier(a.membership.tier) : ''],
    ['会员期限', a.membership.expireDate || ''],
  ]);
}
