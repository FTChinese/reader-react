import { useState } from 'react';
import { isAccountLinked, ReaderPassport } from "../../data/account";
import { UnlinkDialog } from './UnlinkDialog';
import { WxAvatar } from '../wx/WxAvatar';
import { SecondaryLine, TwoLineRow } from '../../components/layout/TwoLineRow';
import { IconButton } from '../../components/buttons/IconButton';
import { Modal } from 'react-bootstrap';
import { ResponseError } from '../../repository/response-error';
import { getWxOAuthCodeReq } from '../../repository/wx-auth';
import { wxOAuthCbSession } from '../../store/wxOAuthCbSession';
import { BaseButton } from '../../components/buttons/BaseButton';
import { CircleLoader } from '../../components/progress/LoadIndicator';

export function WechatRow(
  props: {
    passport: ReaderPassport;
  }
) {

  const isLinked = isAccountLinked(props.passport);
  const [ showUnlink, setShowUnlink ] = useState(false);
  const [ showLink, setShowLink ] = useState(false);

  const handleClick = () => {
    if (isLinked) {
      setShowUnlink(true);
    } else {
      setShowLink(true);
    }
  };

  return (
    <>
      <TwoLineRow
        primary="微信"
        icon={
          <IconButton
            text={isLinked ? '解除绑定' : '去绑定'}
            onClick={handleClick}
          />
        }
      >
        { isLinked ?
          <WxAvatar wechat={props.passport.wechat} /> :
          <SecondaryLine text="未绑定" />
        }
      </TwoLineRow>

      <UnlinkDialog
        passport={props.passport}
        show={showUnlink}
        onClose={() => setShowUnlink(false)}
      />
      <EmailLinkWxDialog
        passport={props.passport}
        show={showLink}
        onClose={() => setShowLink(false)}
      />
    </>
  );
}

/**
 * @description Show a dialog to let a user logged in
 * with email/mobile link to wechat.
 */
function EmailLinkWxDialog(
  props: {
    passport: ReaderPassport;
    show: boolean;
    onClose: () => void;
  }
) {

  const [ submitting, setSubmitting ] = useState(false);

  const handleClick = () => {
    setSubmitting(true);
    getWxOAuthCodeReq()
      .then(codeReq => {
        wxOAuthCbSession.save(codeReq, 'link');
        setSubmitting(false);
        window.location.href = codeReq.redirectTo;
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        console.log(err);
      });
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>绑定微信？</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
        尚未关联微信。绑定微信账号后，可以使用微信账号账号快速登录
        </p>
      </Modal.Body>
      <Modal.Footer>
        <BaseButton
          disabled={submitting}
          text="获取微信授权"
          variant="primary"
          onClick={handleClick}
          startIcon={<CircleLoader progress={submitting} />}
        />
      </Modal.Footer>
    </Modal>
  );
}




