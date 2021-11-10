import Modal from 'react-bootstrap/Modal';
import { ReaderPassport } from '../../data/account';
import { OnLinkOrUnlink } from './OnLinkOrUnlink';

/**
 * @description Show a dialog to let a user logged in
 * with email/mobile link to wechat.
 */
export function EmailLinkWxDialog(
  props: {
    passport: ReaderPassport;
    show: boolean;
    onClose: () => void;
    onLinked: OnLinkOrUnlink;
  }
) {
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
        <button className="btn btn-primary">获取微信授权</button>
      </Modal.Footer>
    </Modal>
  );
}
