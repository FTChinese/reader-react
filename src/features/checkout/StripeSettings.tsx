import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../components/hooks/useAuth';
import { ChevronDown, ChevronUp } from '../../components/graphics/icons';
import { loadSubsDefaultPayMethod } from '../../repository/stripe';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { StripeDefaultPaymentMethod } from './StripDefaultPaymentMethod';

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

  const { passport } = useAuth();
  const [ show, setShow ] = useState(false);

  if (!passport) {
    return null;
  }

  const subsId = passport.membership.stripeSubsId;
  if (!subsId) {
    console.error('Stripe subscription id not found');
    return null;
  }

  const load = () => loadSubsDefaultPayMethod(
    passport.token,
    subsId
  );

  return (
    <>
      <PaymentMethodSelector/>

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
        show &&
        <StripeDefaultPaymentMethod
          passport={passport}
          load={load}
        />
      }
    </>
  );
}

