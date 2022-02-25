import { useFtcPay } from '../../components/hooks/useFtcPay';
import { CheckLarge } from '../../components/icons';
import { PaymentKind } from '../../data/enum';
import { localizePaymentMethod } from '../../data/localization';

const payIcons: Record<PaymentKind, string> = {
  'alipay': 'https://www.ftacademy.cn/images/alipay-68x24.png',
  'wechat': 'https://www.ftacademy.cn/images/wxpay-113x24.png',
  'stripe': 'https://www.ftacademy.cn/images/stripe-58x24.png',
  'apple': '',
  'b2b': '',
};

export function FtcPayProvider(
  props: {
    method: PaymentKind,
  }
) {
  const { ftcPaySetting, setPayMethod } = useFtcPay();

  const handleClick = () => {
    setPayMethod(props.method);
  };

  return (
    <div className="d-flex align-items-center pt-2 pb-2 border-bottom">
      <div className="flex-grow-1"
        onClick={handleClick}
      >
        <img src={payIcons[props.method]} />
      </div>
      <div className="text-teal">
        {
          (props.method === ftcPaySetting.selectedMethod) &&
          <CheckLarge/>
        }
      </div>
    </div>
  );
}
