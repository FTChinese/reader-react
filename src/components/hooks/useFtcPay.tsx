import { atom, useRecoilState } from 'recoil';
import { PaymentKind } from '../../data/enum';
import { AliPayIntent, WxPayIntent } from '../../data/order';

type FtcPaySetting = {
  selectedMethod?: PaymentKind;
  aliPayIntent?: AliPayIntent;
  wxPayIntent?: WxPayIntent;
};

const paySettingState = atom<FtcPaySetting>({
  key: 'ftcPaySetting',
  default: {
    selectedMethod: undefined,
    aliPayIntent: undefined,
    wxPayIntent: undefined,
  },
});

export function useFtcPay() {
  const [ ftcPaySetting, setFtcPaySetting ] = useRecoilState(paySettingState);

  function setPayMethod(k: PaymentKind) {
    setFtcPaySetting({
      ...ftcPaySetting,
      selectedMethod: k,
    });
  }

  function setAliPayIntent(pi: AliPayIntent) {
    setFtcPaySetting({
      selectedMethod: ftcPaySetting.selectedMethod,
      aliPayIntent: pi,
      wxPayIntent: undefined,
    });
  }

  function setWxPayIntent(pi: WxPayIntent) {
    setFtcPaySetting({
      selectedMethod: ftcPaySetting.selectedMethod,
      aliPayIntent: undefined,
      wxPayIntent: pi,
    });
  }

  return {
    ftcPaySetting,
    setPayMethod,
    setAliPayIntent,
    setWxPayIntent,
  }
}
