import { useEffect, useState } from 'react';
import { ErrorBoundary } from '../../components/progress/ErrorBoundary';
import { Loading } from '../../components/progress/Loading';
import { PassportProp } from '../../data/account';
import { PaymentMethod } from '../../data/stripe';
import { ResponseError } from '../../repository/response-error';
import { listCusPaymentMethods } from '../../repository/stripe';
import { BankCard } from './BankCard';

/**
 * @description Load a customer's existing paymemnt methods and display it.
 */
export function CustomerPaymentMethods(
  props: PassportProp & {
    selectable: boolean;
  },
) {

  const [ progress, setProgress ] = useState(true);
  const [ err, setErr ] = useState('');
  const [ methods, setMethods ] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const cusId = props.passport.stripeId;
    if (!cusId) {
      setErr('Missing stripe customer id');
      return;
    }

    setErr('');
    setProgress(true);
    listCusPaymentMethods(
        props.passport.token,
        cusId
      )
      .then(list => {
        setProgress(false);
        setMethods(list.data);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        setErr(err.toString());
      });
  }, []);

  return (
    <div className="mb-3">
      <ErrorBoundary errMsg={err}>
        <Loading loading={progress}>
          <ListPaymentMethods
            methods={methods}
            selectable={props.selectable}
          />
        </Loading>
      </ErrorBoundary>
    </div>
  );
}

function ListPaymentMethods(
  props: {
    methods: PaymentMethod[];
    selectable: boolean;
  }
) {
  if (props.methods.length == 0) {
    return <div>尚未设置任何支付方式</div>;
  }

  return (
    <>
      {
        props.methods.map(m => (
          <BankCard
            key={m.id}
            paymentMethod={m}
            border={true}
            showDefault={true}
            selectable={props.selectable}
          />
        ))
      }
    </>
  );
}
