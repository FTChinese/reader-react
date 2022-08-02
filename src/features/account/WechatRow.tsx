import { useState } from 'react';
import { isAccountLinked, ReaderPassport } from "../../data/account";
import { UnlinkDialog } from './UnlinkDialog';
import { WxAvatar } from '../wx/WxAvatar';
import { PrimaryLine, SecondaryLine, TwoLineRow } from '../../components/list/TwoLineRow';
import { Modal } from 'react-bootstrap';
import { ResponseError } from '../../repository/response-error';
import { getWxOAuthCodeReq } from '../../repository/wx-auth';
import { wxOAuthCbSession } from '../../store/wxOAuthCbSession';
import { CircleLoader } from '../../components/progress/LoadIndicator';
import { LeadIconButton, TextButton } from '../../components/buttons/Buttons';

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
        first={<PrimaryLine
          text="微信"
          trailIcon={
            <TextButton
              text={isLinked ? '解除绑定' : '去绑定'}
              onClick={handleClick}
            />
          }
        />}
        second={ isLinked ?
          <WxAvatar wechat={props.passport.wechat} /> :
          <SecondaryLine text="未绑定" />
        }
      />

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
        <LeadIconButton
          disabled={submitting}
          text="获取微信授权"
          variant="primary"
          onClick={handleClick}
          icon={<CircleLoader progress={submitting} />}
        />
      </Modal.Footer>
    </Modal>
  );
}




