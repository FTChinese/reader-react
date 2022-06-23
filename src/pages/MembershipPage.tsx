import { useAuth } from '../components/hooks/useAuth';
import { Unauthorized } from '../components/routes/Unauthorized';
import { CenterColumn } from '../components/layout/Column';
import { AddOnOverview, SubsOverview } from '../features/member/SubsOverview';
import { StripeSubsSettings } from '../features/member/StripeSubsSettings';
import { CustomerService } from '../features/member/CustomerSerivce';

export function MembershipPage() {
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <CenterColumn>
      <>
        <SubsOverview
          passport={passport}
        />

        <AddOnOverview
          member={passport.membership}
        />

        <StripeSubsSettings
          passport={passport}
        />
        <CustomerService />
      </>
    </CenterColumn>
  );
}


