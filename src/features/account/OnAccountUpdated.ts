import { BaseAccount } from "../../data/account";
import { Customer } from '../../data/stripe';

export type OnAccountUpdated = (a: BaseAccount) => void;

export type OnCustomerUpsert = (c: Customer) => void;
