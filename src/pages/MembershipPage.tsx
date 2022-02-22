import { useAuth } from '../components/hooks/useAuth';
import { CurrentSubs } from '../features/subs/CurrentSubs';
import { Unauthorized } from '../components/routes/Unauthorized';
import { SingleCenterCol } from '../components/layout/ContentLayout';

export function MembershipPage() {
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <SingleCenterCol>
      <CurrentSubs
        {...passport.membership}
      />
    </SingleCenterCol>
  );
}
