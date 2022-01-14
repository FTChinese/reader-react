import { OrderKind, PaymentMethod, Tier } from './enum';

export type OrderParams = {
  priceId: string;
  discountId?: string;
};

export type Order = {
  id: string,
  ftcId?: string;
  unionId?: string;
  tier: Tier;
  kind: OrderKind;
  originalPrice: number;
  payableAmount: number;
  payMethod: PaymentMethod;
  yearsCount: number;
  monthsCount: number;
  daysCount: number;
  confirmedAt?: string;
  startDate?: string;
  endDate?: string;
}
