import { ReaderPassport } from '../../data/account';

/**
 * @description The callback function after accouns linked.
 */

export type OnLinkOrUnlink = (passport: ReaderPassport) => void;
