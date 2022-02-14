import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { BackButton } from '../../components/buttons/BackButton';
import { FtcPayFormVal, FtcPayForm } from '../../components/forms/FtcPayForm';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { FtcShelfItem, WxPayIntent, newOrderParams } from '../../data/product-shelf';
import { alipayCallback } from '../../data/sitemap';
import { endpoint } from '../../repository/endpoint';
import { createAliOrder, createWxOrder } from '../../repository/ftcpay';
import { ResponseError } from '../../repository/response-error';
import { useAuthContext } from '../../store/AuthContext';

export function AliWxPay(
  props: {
    item: FtcShelfItem;
  }
) {

  const [ err, setErr ] = useState('');
  const [ wxPi, setWxPi ] = useState<WxPayIntent>();

  const { passport } = useAuthContext();
  if (!passport) {
    return <Unauthorized/>;
  }

  const handleSubmit = (
    values: FtcPayFormVal,
    helper: FormikHelpers<FtcPayFormVal>
  ): void | Promise<any> => {
    helper.setSubmitting(true);

    console.log(values);

    switch (values.method) {
      case 'alipay':
        createAliOrder(
            {
              ...newOrderParams(props.item),
              returnUrl: alipayCallback(document.location.origin),
            },
            passport.token
          )
          .then(pi => {
            console.log(pi);

            window.location.href = pi.params.browserRedirect
          })
          .catch((err: ResponseError) => {
            helper.setSubmitting(false);
            setErr(err.message);
          });

        break;

      case 'wechat':
        createWxOrder(newOrderParams(props.item), passport.token)
          .then(pi => {
            console.log(pi);
            if (pi.params.desktopQr) {
              helper.setSubmitting(false);
              setWxPi(pi);
              return;
            }

            if (pi.params.mobileRedirect) {
              window.location.href = pi.params.mobileRedirect;
              return;
            }
          })
          .catch((err: ResponseError) => {
            helper.setSubmitting(false);
            setErr(err.message);
          });

        break;
    }
  }

  if (wxPi) {
    return (
      <DisplayWxQR
        url={wxPi.params.desktopQr}
        onBack={() => setWxPi(undefined)}
      />
    );
  }

  return (
    <FtcPayForm
      onSubmit={handleSubmit}
      errMsg={err}
    />
  );
}

function DisplayWxQR(
  props: {
    url: string;
    onBack: () => void;
  }
) {
  return (
    <div>
      <BackButton
        onBack={props.onBack}
      />
      <div className="text-center">
        <h5>微信扫码支付</h5>
        <img src={endpoint.qrSrc(props.url)}/>
      </div>
    </div>
  )
}
