import { OrderKind, PaymentKind, Tier } from './enum';
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
}

type PayIntent = {
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
