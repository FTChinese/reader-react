export type Customer = {
  id: string;
  ftcId: string;
  currency?: string;
  created: number;
  defaultSource?: string;
  defaultPaymentMethod?: string;
  email: string;
  liveMode: boolean;
}
