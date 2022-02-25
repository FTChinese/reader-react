import { FormikHelpers, Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { PaymentKind } from '../../data/enum';
import { RadioInput } from '../controls/RadioInput';
import { SubmitButton } from '../controls/SubmitButton';

export type FtcPayFormVal = {
  method: PaymentKind;
};

export function FtcPayForm(
  props: {
    onSubmit: (
      values: FtcPayFormVal,
      formikHelpers: FormikHelpers<FtcPayFormVal>
    ) => void | Promise<any>;
    errMsg: string;
  }
) {

  const [ errMsg, setErrMsg ] = useState('');

  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);

  return (
    <>
      {
        errMsg &&
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrMsg('')}>
          {errMsg}
        </Alert>
      }
      <Formik<FtcPayFormVal>
        initialValues={{
          method: '' as PaymentKind,
        }}
        onSubmit={props.onSubmit}
      >
        <Form>
          <RadioInput
            id="alipay"
            name="method"
            label="支付宝"
            value="alipay"
          />
          <RadioInput
            id="wechat"
            name="method"
            label="微信支付"
            value="wechat"
          />
          <SubmitButton
            text="支付"
            wrapped="block"
          />
        </Form>
      </Formik>
    </>
  );
}
