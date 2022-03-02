import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../components/hooks/useAuth';
import { ChevronDown, ChevronUp } from '../../components/graphics/icons';
import { loadSubsDefaultPayMethod } from '../../repository/stripe';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { StripeDefaultPaymentMethod } from './StripDefaultPaymentMethod';
import { BorderHeader } from '../../components/header/BorderHeader';
import { RowContainer } from '../../components/list/RowCotainer';

export function StripeSettings() {
  return (
    <div className="mt-4">
      <BorderHeader
        text="Stripe设置"
        level={5}
      />

      <RowContainer>
        <PaymentMethodSetting/>
      </RowContainer>
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

