import { useEffect, useState } from 'react';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { invalidMessages } from '../../data/form-value';
import * as Yup from 'yup';
import { TextInput } from '../controls/TextInput';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { CounterButton } from '../buttons/CounterButton';
import styles from '../buttons/CounterButton.module.css';
import { VerifySMSFormVal } from '../../data/mobile';
import { FormikSubmitButton } from '../controls/FormikSubmitButton';
import { ErrorAlert } from '../progress/ErrorAlert';
import Button from 'react-bootstrap/Button';
import { CircleLoader } from '../progress/LoadIndicator';

export interface SMSHelper {
  setProgress: (p: boolean) => void;
  setShowCounter: (s: boolean) => void;
}

export function MobileLoginForm(
  props: {
    onSubmit: (
      values: VerifySMSFormVal,
      formikHelpers: FormikHelpers<VerifySMSFormVal>
    ) => void | Promise<any>;
    onRequestSMS: (
      value: string,
      helper: SMSHelper,
    ) => void;
    errMsg: string;
    isLogin: boolean;
    mobile?: string | null;
  }
) {

  const [errMsg, setErrMsg] = useState('');
  const [requestingSMS, setRequestingSMS] = useState(false);
  const [showCounter, setShowCounter] = useState(false);

  useEffect(() => {
    setErrMsg(props.errMsg);
  }, [props.errMsg]);

  const handleRequestSMS = (mobile: string) => {
    props.onRequestSMS(
      mobile,
      {
        setProgress: setRequestingSMS,
        setShowCounter: setShowCounter,
      }
    );
  };

  return (
    <>
      <ErrorAlert
        msg={errMsg}
        onClose={() => setErrMsg('')}
      />
      <Formik<VerifySMSFormVal>
        initialValues={{
          mobile: props.mobile || '',
          code: '',
        }}
        validationSchema={Yup.object({
          mobile: Yup.string()
            // .matches(/^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\d{8}$/, '请输入正确的手机号')
            .required(invalidMessages.required),
          code: Yup.string()
            .required(invalidMessages.required),
        })}
        onSubmit={props.onSubmit}
      >
        {formik => (
          <Form>
            <TextInput
              label="手机号码"
              name="mobile"
              type="text"
              desc="仅限中国大陆地区"
            />

            <div  className="mb-3">
              <label
                className="form-label"
                htmlFor="code"
              >
                验证码
              </label>

              <InputGroup>
                <FormControl
                  type="text"
                  id="code"
                  name="code"
                  onInput={formik.handleChange}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.code}
                />

                {
                  showCounter ?
                  <CounterButton
                    variant="outline-secondary"
                    from={60}
                    onFinish={() => setShowCounter(false)}
                  /> :
                  <RequestSMSButton
                    progress={requestingSMS}
                    onClick={handleRequestSMS}
                  />
                }
              </InputGroup>
              {
                formik.errors.mobile ? (
                  <div className="invalid-feedback">
                    {formik.errors.mobile}
                  </div>
                ) : null
              }
            </div>
            <FormikSubmitButton
              text={props.isLogin ? '登录' : '保存'}
              wrapped={props.isLogin ? 'block' : 'end'}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}

function RequestSMSButton(
  props: {
    progress: boolean;
    onClick: (mobile: string) => void;
  }
) {

  const { touched, errors, isSubmitting, values } = useFormikContext<VerifySMSFormVal>();

  return (
    <Button
      disabled={!(touched.mobile && !errors.mobile) || isSubmitting}
      variant="outline-secondary"
      className={styles.counter}
      onClick={() => props.onClick(values.mobile)}
    >
      <CircleLoader progress={props.progress} />
      {
        !props.progress && '获取'
      }
    </Button>
  );
}
