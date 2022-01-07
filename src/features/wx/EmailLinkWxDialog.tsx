import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { ReaderPassport } from '../../data/account';
import { ResponseError } from '../../repository/response-error';
import { getWxOAuthCodeReq } from '../../repository/wx-auth';
import { wxCodeSessionStore } from '../../store/keys';
import ProgressButton from '../../components/buttons/ProgressButton';
import { OnReaderAccount } from './OnReaderAccount';

/**
 * @description Show a dialog to let a user logged in
 * with email/mobile link to wechat.
 */
export function EmailLinkWxDialog(
  props: {
    passport: ReaderPassport;
    show: boolean;
    onClose: () => void;
    onLinked: OnReaderAccount;
  }
) {

  const [ submitting, setSubmitting ] = useState(false);

  const handleClick = () => {
    setSubmitting(true);
    getWxOAuthCodeReq()
      .then(codeReq => {
        wxCodeSessionStore.save(codeReq, 'link');
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
        <ProgressButton
          disabled={submitting}
          text="获取微信授权"
          isSubmitting={submitting}
          inline={true}
          asButton={true}
          onClick={handleClick}
        />
      </Modal.Footer>
    </Modal>
  );
}
