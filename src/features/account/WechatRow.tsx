import { useState } from 'react';
import { isAccountLinked, ReaderPassport } from "../../data/account";
import { useAuth } from '../../components/hooks/useAuth';
import { EmailLinkWxDialog } from '../wx/EmailLinkWxDialog';
import { OnReaderAccount } from '../wx/OnReaderAccount';
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
        <WechatMissing
          passport={props.passport}
        />
      }
    </AccountRow>
  )
}

function WechatLinked(
  props: {
    passport: ReaderPassport;
  }
) {

  const { refreshLogin } = useAuth();

  const [showUnlink, setShowUnlink] = useState(false);

  const handleUnlinked: OnReaderAccount = (passport: ReaderPassport) => {
    setShowUnlink(false);
    refreshLogin(passport);
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

function WechatMissing(
  props: {
    passport: ReaderPassport
  }
) {
  const { refreshLogin } = useAuth();
  const [ show, setShow ] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  const handleLinked: OnReaderAccount = (passport: ReaderPassport) => {
    setShow(false);
    refreshLogin(passport);
  }

  return (
    <>
      <button className="btn btn-link"
        onClick={handleClick}
      >
        尚未绑定
      </button>
      {
        show &&
        <EmailLinkWxDialog
          passport={props.passport}
          show={show}
          onClose={handleClick}
          onLinked={handleLinked}
        />
      }
    </>
  );
}


