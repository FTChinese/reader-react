import { useAuthContext } from '../store/AuthContext';
import { CurrentSubs } from '../features/subs/CurrentSubs';
import { Unauthorized } from '../components/routes/Unauthorized';


export function MembershipPage() {
  const { passport } = useAuthContext();
  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <CurrentSubs
            {...passport.membership}
          />
  );
}
