import { useState } from 'react';
import { ReaderPassport } from '../../data/account';
import { Membership } from '../../data/membership';
import { refreshIAP } from '../../repository/apple';
import { reloadMembership } from '../../repository/membership';
import { ResponseError } from '../../repository/response-error';
import { stripeRepo } from '../../repository/stripe';

export function useMembership() {
  const [ refreshing, setRefreshing ] = useState(false);
  const [ stripeProgress, setStripeProgress ] = useState(false);

  const refresh = (passport: ReaderPassport): Promise<Membership> => {
    setRefreshing(true);

    switch (passport.membership.payMethod) {
      case 'stripe':
        const subsId = passport?.membership.stripeSubsId;
        if (!subsId) {
          return Promise.reject('Missing stripe subscription id');
        }

        return stripeRepo.refreshSubs(passport.token, subsId)
          .then(result => {
            console.log(result)
            setRefreshing(false);
            return Promise.resolve(result.membership);
          })
          .catch(err => {
            setRefreshing(false);
            return Promise.reject(err);
          });

      case 'apple':
        const txId = passport?.membership.appleSubsId;
        if (!txId) {
          return Promise.reject('Missing apple original transaction id');
        }

        return refreshIAP(passport.token, txId)
          .then(result => {
            console.log(result);
            setRefreshing(false);
            return Promise.resolve(result.membership);
          })
          .catch(err => {
            setRefreshing(false);
            return Promise.reject(err);
          });

      default:
        case 'alipay':
        case 'wechat':
        case 'b2b':
          return reloadMembership(passport.token)
            .then(m => {
              console.log(m);
              setRefreshing(false);
              return Promise.resolve(m);
            })
            .catch(err => {
              setRefreshing(false);
              return Promise.reject(err);
            });
    }
  };

  const cancelStripe = (passport: ReaderPassport): Promise<Membership> => {
    const subsId = passport.membership.stripeSubsId;
    if (!subsId) {
      return Promise.reject('Missing stripe subscription id');
    }

    setStripeProgress(true);

    return stripeRepo.cancelSubs(passport.token, subsId)
      .then( result => {
        console.log(result);
        setStripeProgress(false);
        return Promise.resolve(result.membership);
      })
      .catch(err => {
        console.error(err);
        setStripeProgress(false);
        return Promise.reject(err);
      });
  };

  const reactivateStripe = (passport: ReaderPassport): Promise<Membership> => {
    const subsId = passport.membership.stripeSubsId;
    if (!subsId) {
      return Promise.reject('Missing stripe subscription id');
    }

    setStripeProgress(true);
    return stripeRepo.reactivateSubs(passport.token, subsId)
      .then(result => {
        console.log(result);
        setStripeProgress(false)
        return Promise.resolve(result.membership);
      })
      .catch((err: ResponseError) => {
        console.error(err);
        setStripeProgress(false);
        return Promise.reject(err)
      });
  };

  return {
    refreshing,
    refresh,
    stripeProgress,
    reactivateStripe,
    cancelStripe,
  }
}
