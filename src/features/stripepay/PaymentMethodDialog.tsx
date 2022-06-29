import Modal from 'react-bootstrap/Modal';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { SetupPaymentMethod } from './SetupPaymentMethod';
import { SetupUsage } from '../../store/stripeSetupSession';
import { ReaderPassport } from '../../data/account';
import { StripePayMethod } from '../../data/stripe';
import { useStripePaySetting } from '../../components/hooks/useStripePaySetting';
import { ErrorBoundary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { BankCardRow } from './BankCardRow';
import { useEffect } from 'react';

export function PaymentMethodDialog(
  props: {
    show: boolean;
    passport: ReaderPassport;
    onHide: () => void;
  }
) {

  const {
    defaultPayMethod,
    selectedPayMethod,
    setSelectedPayMethod,
    loading,
    loadErr,
    paymentMethods,
    listPaymentMethods,
  } = useStripePaySetting();

  useEffect(() => {
    const cusId = props.passport.stripeId;
    if (!cusId) {
      return;
    }

    listPaymentMethods(props.passport.token, cusId);
  }, []);

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>选择或添加支付方式</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <ErrorBoundary errMsg={loadErr}>
              <Loading loading={loading}>
                <ListPaymentMethods
                  methods={paymentMethods}
                  defaultMethod={defaultPayMethod}
                  selectedMethod={selectedPayMethod}
                  onSelect={setSelectedPayMethod}
                />
              </Loading>
            </ErrorBoundary>

            <SetupPaymentMethod
              passport={props.passport}
              usage={SetupUsage.PayNow}
            />
          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}

function ListPaymentMethods(
  props: {
    methods: StripePayMethod[];
    defaultMethod?: StripePayMethod;
    selectedMethod?: StripePayMethod;
    onSelect: (pm: StripePayMethod) => void;
  }
) {

  if (props.methods.length == 0) {
    return <div>尚未设置任何支付方式</div>;
  }

  return (
    <>
      {
        props.methods.map(m => (
          <BankCardRow
            key={m.id}
            paymentMethod={m}
            selected={m.id === props.selectedMethod?.id}
            isDefault={m.id === props.defaultMethod?.id}
            onSelect={() => {
              props.onSelect(m);
            }}
          />
        ))
      }
    </>
  );
}




