import { ReaderPassport } from '../data/account';
import { SetupIntent } from '../data/stripe';
import { unixNow } from '../utils/now';

const key = 'stripe_setup_sessi';

type SetupSession = {
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

export const stripeSetupSession = {
  save(si: SetupIntent) {
    const sess: SetupSession = {
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

  validate(params: SetupCallbackParams, pp: ReaderPassport): string {
    if (!params.setupIntent || !params.setupIntentClientSecret) {
      return 'Missing required query parameters';
    }

    if (params.redirectStatus !== 'succeeded') {
      return `错误的状态: ${params.redirectStatus}`;
    }

    const sess = stripeSetupSession.load();

    if (!sess) {
      return 'Invalid session';
    }

    if (params.setupIntent !== sess.id) {
      return '响应无效';
    }

    if (sess.exp < unixNow()) {
      return '响应超时';
    }

    if (sess.cus !== pp.stripeId) {
      return 'Not targeting current user';
    }

    return '';
  },

  clear() {
    localStorage.removeItem(key);
    console.log('Stripe setup session cleared');
  }
}
