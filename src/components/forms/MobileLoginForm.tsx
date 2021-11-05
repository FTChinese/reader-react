import { useEffect, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { invalidMessages, VerifySMSFormVal } from '../../data/form-value';
import * as Yup from 'yup';
import { TextInput } from '../controls/TextInput';
import ProgressButton from '../buttons/ProgressButton';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { CounterButton } from '../buttons/CounterButton';
import styles from '../buttons/CounterButton.module.css';
import Alert from 'react-bootstrap/Alert';

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
  }
) {

  const [errMsg, setErrMsg] = useState('');
  const [requestingSMS, setRequestingSMS] = useState(false);
  const [showCounter, setShowCounter] = useState(false);

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
          onClose={() => setErrMsg('')}
        >
          {errMsg}
        </Alert>
      }
      <Formik<VerifySMSFormVal>
        initialValues={{
          mobile: '',
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
                  <ProgressButton
                    disabled={!(formik.touched.mobile && !formik.errors.mobile) || formik.isSubmitting}
                    text="获取"
                    isSubmitting={requestingSMS}
                    variant="outline-secondary"
                    styleClass={styles.counter}
                    asButton={true}
                    inline={true}
                    onClick={() => {
                      props.onRequestSMS(
                        formik.values.mobile,
                        {
                          setProgress: setRequestingSMS,
                          setShowCounter: setShowCounter,
                        }
                      )
                    }}
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

            <ProgressButton
              disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
              text={props.isLogin ? '登录' : '保存'}
              isSubmitting={formik.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
