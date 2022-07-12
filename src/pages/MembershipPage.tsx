import { useAuth } from '../components/hooks/useAuth';
import { Unauthorized } from '../components/routes/Unauthorized';
import { CenterColumn } from '../components/layout/Column';
import { StripeAction } from '../features/member/member-status';
import Modal from 'react-bootstrap/esm/Modal';
import { LeadIconButton } from '../components/buttons/Buttons';
import { CircleLoader } from '../components/progress/LoadIndicator';
import { useEffect, useState } from 'react';
import { useMemberState } from '../features/member/useMemberState';
import { ResponseError } from '../repository/response-error';
import { MemberScreen } from '../features/member/MemberScreen';
import { toast } from 'react-toastify';
import { ReaderPassport } from '../data/account';
import { Membership } from '../data/membership';

export function MembershipPage() {
  const { passport, setMembership } = useAuth();

  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <CenterColumn>
      <MemberPageScreen
        passport={passport}
        onRefreshed={setMembership}
      />
    </CenterColumn>
  );
}

function MemberPageScreen(
  props: {
    passport: ReaderPassport;
    onRefreshed: (m: Membership) => void;
  }
) {
  const [ alertCancel, setAlertCancel ] = useState(false);
  const {
    stripeInvoice,
    loadLatestInvoice,
    refresh,
    refreshing,
    stripeProgress,
    reactivateStripe,
    cancelStripe,
  } = useMemberState();

  useEffect(() => {
    if (props.passport.membership.stripeSubsId) {
      loadLatestInvoice(props.passport);
    }
  }, []);

  return (
    <>
      <MemberScreen
        member={props.passport.membership}
        refreshing={refreshing}
        onRefresh={() => {
          refresh(props.passport)
            .then(m => {
              props.onRefreshed(m);
            })
            .catch((err: ResponseError) => {
              toast.error(err.message);
            })
        }}
        onStripeAction={(action) => {
          switch (action) {
            case StripeAction.Cancel:
              setAlertCancel(true);
              break;

            case StripeAction.Activate:
              reactivateStripe(props.passport)
                .then(m => {
                  props.onRefreshed(m);
                })
                .catch((err: ResponseError) => {
                  toast.error(err.message);
                });
                break;
          }
        }}
        reactivating={stripeProgress}
        stripeInvoice={stripeInvoice}
      />

      <CancelStripeDialog
        show={alertCancel}
        onHide={() => setAlertCancel(false)}
        progress={stripeProgress}
        onCancel={() => {
          cancelStripe(props.passport)
          .then(m => {
            setAlertCancel(false);
            props.onRefreshed(m);
          })
          .catch((err: ResponseError) => {
            toast.error(err.message);
          });
        }}
      />
    </>
  );
}

function CancelStripeDialog(
  props: {
    show: boolean;
    onHide: () => void;
    progress: boolean;
    onCancel: () => void
  }
) {

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
        <p>当前订阅周期到期后将不再从您的默认支付方式中扣款。</p>
        <p>当前订阅周期结束前您可以随时恢复自动续订。</p>
      </Modal.Body>
      <Modal.Footer>
        <LeadIconButton
          disabled={props.progress}
          variant="danger"
          text="是的，我要关闭"
          onClick={props.onCancel}
          icon={<CircleLoader progress={props.progress} />}
        />
      </Modal.Footer>
    </Modal>
  );
}
