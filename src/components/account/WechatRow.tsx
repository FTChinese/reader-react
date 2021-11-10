import { useState } from 'react';
import { isAccountLinked, ReaderPassport } from "../../data/account";
import { useAuthContext } from '../../store/AuthContext';
import { OnLinkOrUnlink } from '../wx/OnLinkOrUnlink';
import { UnlinkDialog } from '../wx/UnlinkDialog';
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

  const { setLoggedIn } = useAuthContext();

  const [showUnlink, setShowUnlink] = useState(false);

  const handleUnlinked: OnLinkOrUnlink = (passport: ReaderPassport) => {
    setShowUnlink(false);
    setLoggedIn(passport);
  };

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
        onClose={() => setShowUnlink(false)} onUnlinked={handleUnlinked}
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


