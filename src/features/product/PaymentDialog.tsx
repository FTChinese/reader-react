import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { FtcShelfItem, newOrderParams, ShelfItemParams } from '../../data/product-shelf';
import { PriceCardBody } from './PriceCard';
import styles from './PayDialog.module.css';
import { localizeTier } from '../../data/localization';
import { Tier } from '../../data/enum';
import { FormikHelpers } from 'formik';
import { FtcPayForm, FtcPayFormVal } from '../../components/forms/FtcPayForm';
import { useAuthContext } from '../../store/AuthContext';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { useState } from 'react';
import { createAliOrder, createWxOrder } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { alipayCallback } from '../../data/sitemap';

export function PaymentDialog(
  props: {
    show: boolean;
    onHide: () => void;
    tier: Tier;
    params: ShelfItemParams;
    children: JSX.Element;
  }
) {
  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          成为FT中文网会员
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <Card className={styles.card}>
              <Card.Header>
                {localizeTier(props.tier)}
              </Card.Header>
              <PriceCardBody
                params={props.params}
              />
            </Card>

            {props.children}

          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}

export function HandlePayment(
  props: {
    item: FtcShelfItem;
  }
) {

  const [ err, setErr ] = useState('');

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
            helper.setSubmitting(false);
            console.log(pi);
          })
          .catch((err: ResponseError) => {
            helper.setSubmitting(false);
            setErr(err.message);
          });

        break;
    }
  }

  return (
    <FtcPayForm
      onSubmit={handleSubmit}
      errMsg={err}
    />
  );
}
