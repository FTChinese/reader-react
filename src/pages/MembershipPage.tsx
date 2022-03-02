import { useAuth } from '../components/hooks/useAuth';
import { Unauthorized } from '../components/routes/Unauthorized';
import { SingleCenterCol } from '../components/layout/ContentLayout';
import { AddOnOverview, SubsOverview } from '../features/member/SubsOverview';
import { StripeSettings } from '../features/checkout/StripeSettings';
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

        <StripeSettings
          passport={passport}
        />
        <CustomerService />
      </>
    </SingleCenterCol>
  );
}


