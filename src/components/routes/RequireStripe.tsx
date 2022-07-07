import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { stripePromise } from './stripePromise';
import { Loading } from '../progress/Loading';

export function RequireStripe(
  props: {
    children: JSX.Element
  }
) {
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    stripePromise.then(s => {
      if (!s) {
        toast.error('Stripe initialization failed!')
        return;
      }

      setLoading(false);
    });

  }, []);

  return (
    <Loading loading={loading}>
      {props.children}
    </Loading>
  );
}
