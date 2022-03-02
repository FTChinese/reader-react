import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../components/hooks/useAuth';
import { ChevronDown, ChevronUp } from '../../components/graphics/icons';
import { cancelSubs, loadSubsDefaultPayMethod } from '../../repository/stripe';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { StripeDefaultPaymentMethod } from './StripDefaultPaymentMethod';
import { BorderHeader } from '../../components/header/BorderHeader';
import { RowContainer, RowSecondary, RowTrailButton } from '../../components/list/RowCotainer';
import { TwoColHeader } from '../../components/header/TwoColHeader';
import Modal from 'react-bootstrap/Modal';
import { ProgressButton } from '../../components/buttons/ProgressButton';
import Alert from 'react-bootstrap/Alert';
import { ResponseError } from '../../repository/response-error';
import { isStripe } from '../../data/membership';
import { PassportProp } from '../../data/account';

export function StripeSettings(props: PassportProp) {

  if (!isStripe(props.passport.membership)) {
    return null;
  }

  return (
    <div className="mt-4">
      <BorderHeader
        text="Stripe设置"
        level={5}
      />

      <PaymentMethodSetting
        passport={props.passport}
      />
      {
        props.passport.membership.autoRenew &&
        <StripeCancelSubs />
      }
    </div>
  );
}

function PaymentMethodSetting(props: PassportProp) {

  const [ show, setShow ] = useState(false);

  const subsId = props.passport.membership.stripeSubsId;
  if (!subsId) {
    console.error('Stripe subscription id not found');
    return null;
  }

  const load = () => loadSubsDefaultPayMethod(
    props.passport.token,
    subsId
  );

  return (
    <RowContainer>
      <>
        <PaymentMethodSelector/>

        <RowSecondary className='d-flex align-items-center'>
          <>
            <span className="me-1">添加或更改当前订阅的支付方式</span>
            <Button
              variant="link"
              onClick={() => setShow(!show)}
            >
              <span className="scale-down8">详情</span>
              {
                show ?
                <ChevronUp/> :
                <ChevronDown/>
              }

            </Button>
          </>
        </RowSecondary>
        {
          show &&
          <StripeDefaultPaymentMethod
            passport={props.passport}
            load={load}
          />
        }
      </>
    </RowContainer>
  );
}

/**
 * @description Cancel subscription.
 * Only show this when the subscription.cancelAtPeriodEnd is true.
 */
function StripeCancelSubs() {

  const [ show, setShow ] = useState(false);

  return (
    <RowContainer>
      <>
        <TwoColHeader
          left={<h6>关闭自动续订</h6>}
          right={
            <RowTrailButton
              text="关闭"
              onClick={() => setShow(true)}
            />
          }
        />
        <RowSecondary>
          <span>关闭自动续订将在本次订阅到期后停止扣款</span>
        </RowSecondary>

        <CancelSubsDialog
          show={show}
          onHide={() => setShow(false)}
        />
      </>
    </RowContainer>
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
    cancelSubs(passport.token, subsId)
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
          text="是的，我要关闭"
          onClick={handleClick}
        />
      </Modal.Footer>
    </Modal>
  );
}
