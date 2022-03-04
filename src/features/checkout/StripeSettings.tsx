import { useState } from 'react';
import { useAuth } from '../../components/hooks/useAuth';
import { ChevronDown, ChevronRight, ChevronUp } from '../../components/graphics/icons';
import { cancelStripeSubs } from '../../repository/stripe';
import { BorderHeader } from '../../components/header/BorderHeader';
import Modal from 'react-bootstrap/Modal';
import { ProgressButton } from '../../components/buttons/ProgressButton';
import Alert from 'react-bootstrap/Alert';
import { ResponseError } from '../../repository/response-error';
import { isStripeRenewOn } from '../../data/membership';
import { PassportProp } from '../../data/account';
import { IconButton } from '../../components/buttons/IconButton';
import { Link } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { TwoLineRow } from '../../components/layout/TwoLineRow';

/**
 * @description Show stripe payment setting.
 * This is visible as long as user is a stripe customer.
 */
export function StripeSettings(props: PassportProp) {

  if (!props.passport.stripeId) {
    return null;
  }

  return (
    <div className="mt-4">
      <BorderHeader
        text="Stripe设置"
        level={5}
      />

      <RowManagePaymentMethod />
      <RowDefaultPaymentMethod
        passport={props.passport}
      />
      {
        isStripeRenewOn(props.passport.membership) &&
        <RowCancelSubs />
      }
    </div>
  );
}

/**
 * @description Payment method managment.
 * @todo Enable deleting payment method, change
 * current subscription's default payment method.
 * If subscription does not exist, set default
 * payment method on customer.
 */
function RowManagePaymentMethod() {
  return (
    <TwoLineRow
      primary="管理支付方式"
      secondary="查看已有支付方式或添加新的支付方式"
      icon={
        <Link to={sitemap.stripeSetting}>
          <span className="scale-down8">设置</span>
          <ChevronRight />
        </Link>
      }
    />
  );
}

function RowDefaultPaymentMethod(props: PassportProp) {

  const [ show, setShow ] = useState(false);

  const icon = show ? <ChevronUp/> : <ChevronDown/>;

  return (
    <TwoLineRow
      primary="默认支付方式"
      secondary="自动续订时使用的默认支付方式"
      icon={
        <IconButton
          text="查看"
          end={icon}
          onClick={() => setShow(!show)}
        />
      }
    />
  );
}

/**
 * @description Cancel subscription.
 * Only show this when the subscription.cancelAtPeriodEnd is true.
 */
function RowCancelSubs() {

  const [ show, setShow ] = useState(false);

  return (
    <>
      <TwoLineRow
        primary="关闭自动续订"
        secondary="关闭自动续订将在本次订阅到期后停止扣款"
        icon={
          <IconButton
            text="关闭"
            end={<ChevronRight />}
            onClick={() => setShow(true)}
          />
        }
      />

      <CancelSubsDialog
        show={show}
        onHide={() => setShow(false)}
      />
    </>
  );
}

function CancelSubsDialog(
  props: {
    show: boolean;
    onHide: () => void;
  }
) {

  const { passport, setMembership } = useAuth();
  const [ progress, setProgress ] = useState(false);
  const [ err, setErr ] = useState('');

  const handleClick = () => {
    if (!passport) {
      return;
    }

    const subsId = passport.membership.stripeSubsId;
    if (!subsId) {
      return;
    }

    setProgress(true);
    cancelStripeSubs(passport.token, subsId)
      .then( result => {
        console.log(result);
        props.onHide();
        //
        setMembership(result.membership);
      })
      .catch((err: ResponseError) => {
        console.error(err);
        setErr(err.message);
        setProgress(false);
      });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          关闭自动续订？
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {
          err && <Alert>{err}</Alert>
        }
        <p>当前订阅周期到期后将不再从您的默认支付方式中扣款。</p>
        <p>当前订阅周期结束前您可以随时恢复自动续订。</p>
      </Modal.Body>
      <Modal.Footer>
        <ProgressButton
          progress={progress}
          disabled={progress}
          variant="danger"
          text="是的，我要关闭"
          onClick={handleClick}
        />
      </Modal.Footer>
    </Modal>
  );
}
