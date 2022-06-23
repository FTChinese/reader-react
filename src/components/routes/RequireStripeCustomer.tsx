import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { ResponseError } from '../../repository/response-error';
import { createCustomer } from '../../repository/stripe';
import { BaseButton } from '../buttons/BaseButton';
import { useAuth } from '../hooks/useAuth';
import { SingleCenterCol } from '../layout/ContentLayout';
import { ErrorAlert } from '../progress/ErrorAlert';
import { CircleLoader } from '../progress/LoadIndicator';

export function RequireStripeCustomer(
  props: {
    children: JSX.Element;
  }
) {

  const { passport, setCustomerId } = useAuth();
  const [ progress, setProgress ] = useState(false);
  const [ err, setErr ] = useState('');

  if (!passport) {
    return null;
  }

  const handleClick = () => {
    setProgress(true);

    createCustomer(passport.token)
      .then(cus => {
        console.log('Stripe customer created');
        setProgress(false);
        setCustomerId(cus.id);
      })
      .catch((err: ResponseError) => {
        setErr(err.message);
        setProgress(false);
      });
  };

  if (passport.stripeId) {
    return props.children;
  }

  if (!passport.email) {
    return (
      <SingleCenterCol>
        <>
        <h2>使用Stripe支付服务需要提供邮箱</h2>
        <div className="text-center">
          <Link to={sitemap.settings}>
            去设置
          </Link>
        </div>
        </>
      </SingleCenterCol>
    );
  }

  return (
    <SingleCenterCol>
      <>
        <h2>注册为Stripe用户</h2>
        <p>Stripe支付需要使用邮箱注册其服务，该邮箱将用于接收账单信息，是否使用当前邮箱注册（{passport.email}）？</p>

        <ErrorAlert
          msg={err}
          onClose={() => setErr('')}
        />

        <div className="mt-3 text-end">
          <BaseButton
            text="注册"
            disabled={progress}
            onClick={handleClick}
            startIcon={<CircleLoader progress={progress} />}
          />
        </div>
      </>
    </SingleCenterCol>
  );
}
