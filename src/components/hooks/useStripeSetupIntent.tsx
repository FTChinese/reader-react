import { atom, useRecoilState } from 'recoil';
import { emptySetupIntent, SetupIntent } from '../../data/stripe';

const setupIntentState = atom<SetupIntent>({
  key: 'stripeSetupIntent',
  default: emptySetupIntent(),
});

export function useStripeSetupIntent() {
  const [ setupIntent, setSetupIntent ] = useRecoilState(setupIntentState);

  return {
    setupIntent,
    setSetupIntent,
  };
}
