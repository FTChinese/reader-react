import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../components/hooks/useAuth';
import { usePaymentSetting } from '../../components/hooks/usePaymentSetting';
import { ChevronDown, ChevronUp } from '../../components/icons';
import { ErrorBoudary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { ResponseError } from '../../repository/response-error';
import { loadSubsDefaultPayMethod } from '../../repository/stripe';
import { BankCard } from '../checkout/BankCard';
import { PaymentMethodTitle } from '../checkout/PaymentMethodTitle';

export function StripeSettings() {
  return (
    <div className="mt-4">
      <h5 className="border-bottom text-black60">Stripe设置</h5>

      <div className="border-bottom pt-2 pb-2">
        <PaymentMethodSetting/>
      </div>
    </div>
  );
}

function PaymentMethodSetting() {

  const [ show, setShow ] = useState(false);

  return (
    <>
      <PaymentMethodTitle/>

      <div className="d-flex align-items-center">
        <span className="me-1 scale-down8 text-black50">添加或更改当前订阅的支付方式</span>
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
      </div>

      {
        show && <SubsPaymentMethod />
      }
    </>
  );
}

function SubsPaymentMethod() {
  const { passport } = useAuth();
  const [ err, setErr ] = useState('');
  const [ progress, setProgress ] = useState(false);
  const { paymentSetting, selectPaymentMethod } = usePaymentSetting();

  useEffect(() => {
    if (!passport) {
      return;
    }
    const subsId = passport.membership.stripeSubsId;
    if (!subsId) {
      return;
    }
    if (paymentSetting.selectedMethod) {
      return;
    }
    setErr('');
    setProgress(true);
    loadSubsDefaultPayMethod(passport.token, subsId)
      .then(pm => {
        console.log(pm);
        selectPaymentMethod(pm);
        setProgress(false);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        if (err.notFound) {
          return;
        }
        setErr(err.toString());
      });
  }, []);

  return (
    <ErrorBoudary errMsg={err}>
      <Loading loading={progress}>
        <DisplayPaymentMethod/>
      </Loading>
    </ErrorBoudary>
  );
}

function DisplayPaymentMethod() {
  const { paymentSetting } = usePaymentSetting();

  if (!paymentSetting.selectedMethod) {
    return <div className="text-black60 scale-down8">未设置</div>;
  }

  return (
    <BankCard paymentMethod={paymentSetting.selectedMethod} />
  );
}
