import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { OButton, SpinnerOrText, TextButton } from '../components/buttons/Buttons';
import { useAuth } from '../components/hooks/useAuth';
import { useStripePaySetting } from '../components/hooks/useStripePaySetting';
import { useStripeWallet } from '../components/hooks/useStripeWallet';
import { CenterColumn } from '../components/layout/Column';
import { ErrorBoundary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { Unauthorized } from '../components/routes/Unauthorized';
import { hasStripeSubs } from '../data/membership';
import { StripePayMethod } from '../data/stripe';
import { StripeWalletScreen } from '../features/account/StripeWalletScreen';
import { PaymentMethodDialog } from '../features/stripepay/PaymentMethodDialog';

/**
 * @description Payment method managment.
 * @todo Enable deleting payment method, change
 * current subscription's default payment method.
 * If subscription does not exist, set default
 * payment method on customer.
 */
export function StripeWalletPage() {
  const { passport } = useAuth();
  if (!passport) {
    return <Unauthorized/>;
  }

  const [ showSelectPayMethod, setShowSelectPayMethod ] = useState(false);
  const [ subsPayMethod, setSubsPayMethod ] = useState<StripePayMethod | undefined>(undefined);

  const {
    loadErr,
    loading,
    loadDefaultPaymentMethod,
    defaultPayMethod,
    selectedPayMethod,
    onPayMethodUpdated,
  } = useStripePaySetting();

  const {
    submitErr,
    submitting,
    setCusDefaultPayment,
    setSubsDefaultPayment,
  } = useStripeWallet();

  useEffect(() => {
    loadDefaultPaymentMethod(passport);
  }, []);

  useEffect(() => {
    if (submitErr) {
      toast.error(submitErr);
    }
  }, [submitErr]);

  const payMethodInUse = selectedPayMethod || defaultPayMethod;

  const isDefault = selectedPayMethod?.id === defaultPayMethod?.id;

  return (

    <CenterColumn>
      <ErrorBoundary errMsg={loadErr}>
        <Loading loading={loading}>

          <>
            <h2 className="text-center">
              Stripe支付管理
            </h2>

            <StripeWalletScreen
              paymentMethod={payMethodInUse}
              isDefault={isDefault}
              submitting={submitting}
              onSetDefault={(method) => {
                // When user has valid subscription, ask user
                // to confirm upon modifying payment method.
                if (hasStripeSubs(passport.membership)) {
                  setSubsPayMethod(method)
                } else {
                  setCusDefaultPayment(passport, method)
                    .then(ok => {
                      if (ok) {
                        onPayMethodUpdated(method);
                      }
                    });
                }
              }}
              onAddCard={ () => setShowSelectPayMethod(true) }
            />

            <PaymentMethodDialog
              show={showSelectPayMethod}
              passport={passport}
              onHide={() => setShowSelectPayMethod(false)}
            />

            <SubsPayMethodDialog
              show={!!subsPayMethod}
              onHide={() => setSubsPayMethod(undefined)}
              progress={submitting}
              onConfirm={() => {
                const method = subsPayMethod;
                if (!method) {
                  return;
                }

                setSubsDefaultPayment(passport, method)
                  .then(ok => {
                    if (ok) {
                      onPayMethodUpdated(method);
                    }
                  });
              }}
            />
          </>

        </Loading>
      </ErrorBoundary>


    </CenterColumn>
  );
}

/**
 * Dialog when user is trying to modify a subscription's
 * payment method.
 */
function SubsPayMethodDialog(
  props: {
    show: boolean;
    onHide: () => void;
    progress: boolean;
    onConfirm: () => void;
  }
) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        更改订阅默认支付方式
      </Modal.Header>

      <Modal.Body>
      是否更改当前订阅的默认支付方式？这将影响自动续订日后的支付，请确保该支付方式有效。
      </Modal.Body>

      <Modal.Footer>
        <TextButton onClick={props.onHide}>取消</TextButton>
        <OButton
          onClick={props.onConfirm}
          variant="danger"
        >
          <SpinnerOrText
            text="确认更改"
            progress={props.progress}
          />
        </OButton>
      </Modal.Footer>
    </Modal>
  );
}
