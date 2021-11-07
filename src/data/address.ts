export type AddressFormVal = {
  country: string | null;
  province: string | null;
  city: string | null;
  district: string | null;
  street: string | null;
  postcode: string | null;
}

export type Address = {
  ftcId: string;
} & AddressFormVal;
