import { ReaderPassport } from '../data/account';
import { SetupIntent } from '../data/stripe';
import { unixNow } from '../utils/now';

const key = 'stripe_setup_sess';

export enum SetupUsage {
  PayNow, // Go to checkout after redirect
  Future, // Go to settings/stripe after redirect.
};

type SetupSession = {
  usage: SetupUsage;
  id: string;
  cus: string;
  exp: number;
};

type SetupCallbackParams = {
  setupIntent: string;
  setupIntentClientSecret: string;
  redirectStatus: string; // `succeeded` if everything's fine.
}

export function newSetupCbParams(query: URLSearchParams): SetupCallbackParams {
  return {
    setupIntent: query.get('setup_intent') || '',
    setupIntentClientSecret: query.get('setup_intent_client_secret') || '',
    redirectStatus: query.get('redirect_status') || '',
  };
}

function validateParams(params: SetupCallbackParams): string {
  if (!params.setupIntent || !params.setupIntentClientSecret) {
    return 'Missing required query parameters';
  }

  if (params.redirectStatus !== 'succeeded') {
    return `错误的状态: ${params.redirectStatus}`;
  }

  return '';
}

export function validateSetupSession(args: {
  params: SetupCallbackParams;
  sess: SetupSession;
  passport: ReaderPassport;
}): string {

  const invalid = validateParams(args.params);
  if (invalid) {
    return invalid;
  }

  if (args.params.setupIntent !== args.sess.id) {
    return '响应无效';
  }

  if (args.sess.exp < unixNow()) {
    return '响应超时';
  }

  if (args.sess.cus !== args.passport.stripeId) {
    return 'Not targeting current user';
  }

  return '';
}

export const stripeSetupSession = {

  save(si: SetupIntent, usage: SetupUsage) {
    const sess: SetupSession = {
      usage,
      id: si.id,
      cus: si.customerId,
      exp: unixNow() + 5 * 60,
    }

    localStorage.setItem(key, JSON.stringify(sess));
  },

  load(): SetupSession | null {
    const v = localStorage.getItem(key);
    if (!v) {
      return null;
    }

    return JSON.parse(v) as SetupSession;
  },

  clear() {
    localStorage.removeItem(key);
    console.log('Stripe setup session cleared');
  }
}
