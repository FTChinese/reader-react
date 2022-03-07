import { useAuth } from '../components/hooks/useAuth';
import { Unauthorized } from '../components/routes/Unauthorized';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { AddOnOverview, SubsOverview } from '../features/member/SubsOverview';
import { StripeSubsSettings } from '../features/checkout/StripeSubsSettings';
import { CustomerService } from '../features/member/CustomerSerivce';

export function MembershipPage() {
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized/>;
  }

  return (
    <SingleCenterCol>
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
    </SingleCenterCol>
  );
}


