import { OrderKind, PaymentKind, Tier } from './enum';
import { formatMoney } from './localization';
import { Membership } from './membership';
import { StringPair } from './pair';
import { Price } from './price';

export type Order = {
  id: string,
  ftcId?: string;
  unionId?: string;
  tier: Tier;
  kind: OrderKind;
  originalPrice: number;
  payableAmount: number;
  payMethod: PaymentKind;
  yearsCount: number;
  monthsCount: number;
  daysCount: number;
  confirmedAt?: string;
  startDate?: string;
  endDate?: string;
};

export type PayIntent = {
  price: Price;
  order: Order;
};


export type WxPayIntent = PayIntent & {
  params: {
    desktopQr: string;
    mobileRedirect:  string;
  };
};

export type AliPayIntent = PayIntent & {
  params: {
    browserRedirect: string;
  };
};

export type PayResult = {
  paymentState: 'WAIT_BUYER_PAY' | 'TRADE_CLOSED' | 'TRADE_SUCCESS' | 'TRADE_FINISHED' | 'SUCCESS' | 'REFUND' | 'NOTPAY' | 'CLOSED' | 'REVOKED' | 'USERPAYING' | 'PAYERROR';
  paymentStateDesc: string;
  totalFee: number;
  transactionId: string;
  ftcOrderId: string;
  paidAt: string;
}

export type ConfirmationResult = {
  payment: PayResult;
  membership: Membership;
  order: Order;
};

export function ftcPayResultRows(payResult: PayResult): StringPair[] {
  return [
    ["订单号", payResult.ftcOrderId],
    ["支付状态", payResult.paymentStateDesc],
    ["金额", formatMoney('rmb', payResult.totalFee/100)],
    ["支付宝交易号", payResult.transactionId],
    ["支付时间", payResult.paidAt]
  ];
}

/**
 * @description The query parameter alipay supplied
 * in redirection after payment succeeded.
 */
export interface AliPayCbParams {
  charset: string;
  out_trade_no: string;
  method: string;
  total_amount: string;
  sign: string;
  trade_no: string;
  auth_app_id: string;
  version: string;
  app_id: string;
  sign_type: string;
  seller_id: string;
  timestamp: string;
}

export function newAliPayCbParams(q: URLSearchParams): AliPayCbParams {
  return {
    charset: q.get('charset') || '',
    out_trade_no: q.get('out_trade_no') || '',
    method: q.get('method') || '',
    total_amount: q.get('total_amount') || '',
    sign: q.get('sign') || '',
    trade_no: q.get('trade_no') || '',
    auth_app_id: q.get('auth_app_id') || '',
    version: q.get('version') || '',
    app_id: q.get('app_id') || '',
    sign_type: q.get('sign_type') || '',
    seller_id: q.get('seller_id') || '',
    timestamp: q.get('timestamp') || '',
  };
}

export function validateAliPayResp(o: Order, p: AliPayCbParams): string {
  if (o.id != p.out_trade_no) {
    return '订单号不匹配';
  }

  return '';
}

